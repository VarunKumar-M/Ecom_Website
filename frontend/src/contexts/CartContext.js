import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [] });

  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        const { data } = await API.get('/cart');
        setCart(data);
      } else {
        setCart({ items: [] });
      }
    };
    fetchCart();
  }, [user]);

  const addToCart = async (productId, qty=1) => {
    const { data } = await API.post('/cart', { productId, qty });
    setCart(data);
  };

  const removeItem = async (productId) => {
    const { data } = await API.delete(`/cart/item/${productId}`);
    setCart(data);
  };

  return <CartContext.Provider value={{ cart, addToCart, removeItem }}>{children}</CartContext.Provider>;
};
