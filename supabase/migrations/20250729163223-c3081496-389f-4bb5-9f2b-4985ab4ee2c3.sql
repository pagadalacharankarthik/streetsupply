-- Create categories enum
CREATE TYPE public.product_category AS ENUM (
  'rice', 'pulses', 'oil', 'spices', 'vegetables', 
  'fruits', 'dairy', 'meat', 'seafood', 'grains', 
  'condiments', 'herbs'
);

-- Create order status enum  
CREATE TYPE public.order_status AS ENUM (
  'pending', 'processing', 'in_transit', 'delivered', 'cancelled'
);

-- Create suppliers table
CREATE TABLE public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  description TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  categories product_category[] DEFAULT '{}',
  min_order_amount INTEGER DEFAULT 0,
  delivery_time TEXT DEFAULT '24 hours',
  rating DECIMAL(3,2) DEFAULT 0.0,
  trust_score INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  discount_text TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category product_category NOT NULL,
  unit TEXT NOT NULL, -- kg, litre, piece, etc
  price_per_unit DECIMAL(10,2) NOT NULL,
  minimum_quantity INTEGER DEFAULT 1,
  stock_quantity INTEGER DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  status order_status DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_date DATE,
  tracking_id TEXT,
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Suppliers policies (suppliers can manage their own data)
CREATE POLICY "Suppliers can view all suppliers" 
ON public.suppliers FOR SELECT 
USING (true);

CREATE POLICY "Users can create supplier profile" 
ON public.suppliers FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Suppliers can update their own profile" 
ON public.suppliers FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Suppliers can delete their own profile" 
ON public.suppliers FOR DELETE 
USING (auth.uid() = user_id);

-- Products policies (suppliers can manage their products, everyone can view)
CREATE POLICY "Everyone can view active products" 
ON public.products FOR SELECT 
USING (is_active = true);

CREATE POLICY "Suppliers can create their own products" 
ON public.products FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.suppliers 
  WHERE id = supplier_id AND user_id = auth.uid()
));

CREATE POLICY "Suppliers can update their own products" 
ON public.products FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.suppliers 
  WHERE id = supplier_id AND user_id = auth.uid()
));

CREATE POLICY "Suppliers can delete their own products" 
ON public.products FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.suppliers 
  WHERE id = supplier_id AND user_id = auth.uid()
));

-- Orders policies (vendors can manage their orders, suppliers can view their orders)
CREATE POLICY "Vendors can view their own orders" 
ON public.orders FOR SELECT 
USING (auth.uid() = vendor_id);

CREATE POLICY "Suppliers can view orders for their products" 
ON public.orders FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.suppliers 
  WHERE id = supplier_id AND user_id = auth.uid()
));

CREATE POLICY "Vendors can create orders" 
ON public.orders FOR INSERT 
WITH CHECK (auth.uid() = vendor_id);

CREATE POLICY "Vendors can update their own orders" 
ON public.orders FOR UPDATE 
USING (auth.uid() = vendor_id);

CREATE POLICY "Suppliers can update order status" 
ON public.orders FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.suppliers 
  WHERE id = supplier_id AND user_id = auth.uid()
));

-- Order items policies (follow order permissions)
CREATE POLICY "Users can view order items for their orders" 
ON public.order_items FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.orders 
  WHERE id = order_id AND (
    vendor_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.suppliers 
      WHERE id = supplier_id AND user_id = auth.uid()
    )
  )
));

CREATE POLICY "Vendors can create order items" 
ON public.order_items FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.orders 
  WHERE id = order_id AND vendor_id = auth.uid()
));

-- Create function to generate order numbers
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  new_number TEXT;
BEGIN
  new_number := 'ORD-' || LPAD((EXTRACT(epoch FROM now())::bigint % 1000000)::text, 6, '0');
  RETURN new_number;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON public.suppliers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to auto-generate order numbers
CREATE OR REPLACE FUNCTION public.set_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := public.generate_order_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_order_number_trigger
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.set_order_number();