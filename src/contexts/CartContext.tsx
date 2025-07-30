import { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  id: string;
  productId: string;
  productName: string;
  supplierId: string;
  supplierName: string;
  price: number;
  unit: string;
  quantity: number;
  minQuantity: number;
  imageUrl?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const quantity = item.quantity || item.minQuantity;
    const existingItem = items.find(i => i.productId === item.productId);
    
    if (existingItem) {
      updateQuantity(item.productId, existingItem.quantity + quantity);
    } else {
      setItems([...items, { ...item, quantity }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setItems(items.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(items.map(item => 
      item.productId === productId 
        ? { ...item, quantity: Math.max(quantity, item.minQuantity) }
        : item
    ));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getItemCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}