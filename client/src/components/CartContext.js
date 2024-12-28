import React, { createContext, useState, useEffect } from 'react';

// Crear el contexto
export const CartContext = createContext();

// Componente proveedor
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    // Sincronizar el carrito con localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Calcular la cantidad total de productos en el carrito
  const cartCount = cart.reduce((total, item) => total + item.cantidad, 0);

  return (
    <CartContext.Provider value={{ cart, setCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};
