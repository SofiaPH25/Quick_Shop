
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { CartItem, Product, ToastMessage } from '../types';
import { getItem, setItem } from '../utils/localStorage';

const CART_KEY = 'quickshop_cart';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  addToast: (message: string, type?: ToastMessage['type']) => void;
  toasts: ToastMessage[];
  dismissToast: (id: number) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const storedCart = getItem<CartItem[]>(CART_KEY);
    if (storedCart) {
      setCartItems(storedCart);
    }
  }, []);

  useEffect(() => {
    setItem(CART_KEY, cartItems);
  }, [cartItems]);

  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'info') => {
    setToasts(prevToasts => [...prevToasts, { id: Date.now(), message, type }]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          addToast(`Cannot add more than ${product.stock} units of ${product.name}.`, 'error');
          return prevItems.map(item =>
            item.id === product.id ? { ...item, quantity: product.stock } : item
          );
        }
        addToast(`${product.name} quantity updated in cart.`, 'success');
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      } else {
        if (quantity > product.stock) {
          addToast(`Cannot add ${quantity} units. Only ${product.stock} of ${product.name} available.`, 'error');
           return [...prevItems, { ...product, quantity: product.stock }];
        }
        addToast(`${product.name} added to cart.`, 'success');
        return [...prevItems, { ...product, quantity }];
      }
    });
  }, [addToast]);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === productId);
      if(itemToRemove) addToast(`${itemToRemove.name} removed from cart.`, 'info');
      return prevItems.filter(item => item.id !== productId)
    });
  }, [addToast]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCartItems(prevItems => {
      const productInCart = prevItems.find(item => item.id === productId);
      if (!productInCart) return prevItems;

      if (quantity <= 0) {
        return prevItems.filter(item => item.id !== productId);
      }
      if (quantity > productInCart.stock) {
         addToast(`Maximum stock for ${productInCart.name} is ${productInCart.stock}.`, 'error');
        return prevItems.map(item =>
          item.id === productId ? { ...item, quantity: productInCart.stock } : item
        );
      }
      return prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
    });
  }, [addToast]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    addToast('Cart cleared.', 'info');
  }, [addToast]);

  const getCartTotal = useCallback((): number => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const getCartItemCount = useCallback((): number => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartItemCount, toasts, addToast, dismissToast }}>
      {children}
    </CartContext.Provider>
  );
};
    