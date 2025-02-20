import React, { createContext, useState, useEffect } from 'react';

// Crear el contexto
export const CartContext = createContext();

// Tiempo de expiración en milisegundos (30 minutos)
const CART_EXPIRATION_TIME = 30 * 60 * 1000; 

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    const storedTimestamp = localStorage.getItem('cartTimestamp');

    if (storedCart && storedTimestamp) {
      const now = Date.now();
      if (now - parseInt(storedTimestamp, 10) < CART_EXPIRATION_TIME) {
        return JSON.parse(storedCart);
      } else {
        localStorage.removeItem('cart');
        localStorage.removeItem('cartTimestamp');
        return [];
      }
    }
    return [];
  });

  // Inicializamos el cupón desde localStorage
  const [coupon, setCoupon] = useState(() => {
    const storedCoupon = localStorage.getItem('coupon');
    return storedCoupon ? JSON.parse(storedCoupon) : null;
  });

  // Sincronizar el carrito con localStorage
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
      localStorage.setItem('cartTimestamp', Date.now().toString());
    } else {
      localStorage.removeItem('cart');
      localStorage.removeItem('cartTimestamp');
      // Cuando el carrito queda vacío, se limpia el cupón
      setCoupon(null);
      localStorage.removeItem('coupon');
    }
  }, [cart]);

  // Sincronizar el cupón con localStorage
  useEffect(() => {
    if (coupon) {
      localStorage.setItem('coupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('coupon');
    }
  }, [coupon]);

  const cartCount = cart.reduce((total, item) => total + item.cantidad, 0);

  return (
    <CartContext.Provider value={{ cart, setCart, coupon, setCoupon, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};
