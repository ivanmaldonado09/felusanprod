import React, { useContext } from "react";
import { CartContext } from "./CartContext";
import "./Cart.css";

const Cart = () => {
 const {cart, setCart} = useContext(CartContext);
  

  // Función para aumentar la cantidad de un producto
  const increaseQuantity = (index) => {
    const updatedCart = [...cart];
    updatedCart[index].cantidad += 1;
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Función para disminuir la cantidad de un producto
  const decreaseQuantity = (index) => {
    const updatedCart = [...cart];
    if (updatedCart[index].cantidad > 1) {
      updatedCart[index].cantidad -= 1;
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      removeItem(index); // Si la cantidad llega a 0, elimina el producto
    }
  };

  // Función para eliminar un producto
  const removeItem = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

const procesarPago = async () => {
 

  const mensaje = "Hola! Quiero realizar este pedido:\n" + cart.map(item => 
    `Producto: ${item.nombre}\n - Color: ${item.color}\n - Talle: ${item.talle}\n - Cantidad: ${item.cantidad}\n - Precio por unidad: $${item.precio}`
  ).join('\n') + `\nTotal: $${cart.reduce((total, item) => total + item.precio * item.cantidad, 0)}`;

  const url = `https://api.whatsapp.com/send?phone=5491140924419&text=${encodeURIComponent(mensaje)}`;

  window.open(url, '_blank');
}
  

  return (
    <div className="cart">
    <h2>Carrito</h2>
    {cart.length > 0 ? (
      cart.map((item, index) => (
        <div key={index} className="cart-item">
          {/* Imagen pequeña del producto */}
          <img
            src={item.imagen}
            alt={item.nombre}
            className="cart-item-image"
          />
          <div className="cart-item-details">
            <p>{item.nombre}</p>
            <p>Color: {item.color}</p>
            <p>Talle: {item.talle}</p>
          </div>
          <div className="cart-quantity">
            <button onClick={() => decreaseQuantity(index)}>-</button>
            <span>{item.cantidad}</span>
            <button onClick={() => increaseQuantity(index)}>+</button>
          </div>
          <p>Precio por unidad: ${Number(item.precio).toLocaleString("es-AR", { minimumFractionDigits: 2 })}</p>
          <button className="remove-button" onClick={() => removeItem(index)}>
            Eliminar
          </button>
        </div>
      ))
    ) : (
      <p>El carrito está vacío.</p>
    )}
    {cart.length > 0 && (
      <>
        <div className="cart-total">
          <h3>Total: ${cart.reduce((total, item) => total + item.precio * item.cantidad, 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}</h3>
        </div>
        <div className="cart-info">
          <p className="cart-deposit-text">
            Deposita el total y continúa el pedido por nuestro WhatsApp 😊 <br />
            <strong>Alias:</strong> <span className="cart-alias">felusan.indumentaria</span>
            <img src='/images/mp.png'  alt="Mercado Pago" className="mp-icon" />
          </p>
        </div>
        <button
          className="pay-button"
          onClick={procesarPago}>
          Continuar con el pago en Whatsapp
        </button>
      </>
    )}
  </div>
  

  );
};

export default Cart;
