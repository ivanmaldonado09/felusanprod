import React, { useContext, useState } from "react";
import { CartContext } from "./CartContext";
import "./Cart.css";

const Cart = () => {
  const { cart, setCart, coupon, setCoupon } = useContext(CartContext);
  const [couponCode, setCouponCode] = useState("");

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
      removeItem(index);
    }
  };

  // Función para eliminar un producto
  const removeItem = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    // Cuando el carrito quede vacío, el efecto en el contexto se encarga de limpiar el cupón
  };

  // Función para aplicar descuento consultando la API
  // En lugar de modificar los precios de los productos, solo se almacena el cupón en el contexto.
  const aplicarDescuento = async () => {
    if (coupon) {
      alert("El cupón ya fue aplicado.");
      return;
    }
    if (!couponCode.trim()) {
      alert("Por favor ingresa un código de descuento.");
      return;
    }
    try {
      const response = await fetch(
        `http://felusan.com/apis/buscardescuento.php?cupon=${couponCode}`
      );
      if (!response.ok) {
        throw new Error("Error en la consulta del cupón");
      }
      const data = await response.json();
      if (data && data.descuento) {
        const discountPercentage = parseFloat(data.descuento); // Ejemplo: 15 para un 15%
        // Se almacena el cupón en el contexto sin modificar los precios de cada producto.
        setCoupon({ code: couponCode, discount: discountPercentage });
        alert(
          `Se ha aplicado un descuento del ${discountPercentage}%.`
        );
      } else {
        alert("Cupón inválido");
      }
    } catch (error) {
      console.error("Error al aplicar el descuento", error);
      alert("Error al aplicar el descuento. Intente nuevamente.");
    }
  };

  // Función para procesar el pago por WhatsApp
  const procesarPago = async () => {
    const originalTotal = cart.reduce(
      (total, item) => total + item.precio * item.cantidad,
      0
    );

    let mensaje =
      "Hola! Quiero realizar este pedido:\n" +
      cart
        .map(
          (item) =>
            `Producto: ${item.nombre}\n - Color: ${item.color}\n - Talle: ${item.talle}\n - Cantidad: ${item.cantidad}\n - Precio por unidad: $${item.precio}`
        )
        .join("\n");

    if (coupon) {
      const discountFactor = coupon.discount / 100;
      const totalConCupon = originalTotal * (1 - discountFactor);
      mensaje += `\n*Total: $${originalTotal.toLocaleString("es-AR", {
        minimumFractionDigits: 2,
      })}*`;
      mensaje += `\n*Total con cupón: $${totalConCupon.toLocaleString("es-AR", {
        minimumFractionDigits: 2,
      })}*`;
      mensaje += `\nCupón aplicado: *${coupon.code}*`;
    } else {
      mensaje += `\nTotal: $${originalTotal.toLocaleString("es-AR", {
        minimumFractionDigits: 2,
      })}`;
    }

    const url = `https://api.whatsapp.com/send?phone=5491140924419&text=${encodeURIComponent(
      mensaje
    )}`;
    window.open(url, "_blank");
    // Al finalizar la compra se limpia el carrito y el cupón.
    setCart([]);
    setCoupon(null);
    localStorage.removeItem("cart");
  };

  // Calculamos el total original a partir de los productos del carrito.
  const originalTotal = cart.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );
  // Si hay cupón, calculamos el total con descuento.
  const totalConDescuento = coupon ? originalTotal * (1 - coupon.discount / 100) : originalTotal;

  return (
    <div className="cart">
      <h2>Carrito</h2>
      {cart.length > 0 ? (
        cart.map((item, index) => (
          <div key={index} className="cart-item">
            <img src={item.imagen} alt={item.nombre} className="cart-item-image" />
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
            <p>
              Precio por unidad: $
              {Number(item.precio).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
            </p>
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
            {coupon ? (
              <>
                <h3 style={{ textDecoration: "line-through", color: "gray" }}>
                  Total: ${originalTotal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                </h3>
                <h3>
                  Total con descuento: ${totalConDescuento.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                </h3>
              </>
            ) : (
              <h3>
                Total: ${originalTotal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
              </h3>
            )}
          </div>

          <div className="cart-info">
            <p className="cart-deposit-text">
              ¿Tienes un código de descuento? Ingrésalo y presiona el botón "Aplicar descuento" <br />
            </p>
            <input
              type="text"
              className="descuento-input"
              placeholder="Código de descuento"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              disabled={coupon !== null}
            />
            <br />
            <button className="descuento-button" onClick={aplicarDescuento}>
              Aplicar descuento
            </button>
          </div>

          <div className="cart-info">
            <p className="cart-deposit-text">
              Deposita el total y continúa el pedido por nuestro WhatsApp 😊 <br />
              <strong>Alias:</strong>{" "}
              <span className="cart-alias">felusan.indumentaria</span>
              <img src="/images/mp.png" alt="Mercado Pago" className="mp-icon" />
            </p>
          </div>

          <button className="pay-button" onClick={procesarPago}>
            Continuar con el pago en Whatsapp
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
