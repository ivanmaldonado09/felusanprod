import React, { useState, useEffect, useContext } from "react";
import "./ModalProducto.css";
import "./Productos.css";
import { CartContext } from './CartContext';


const ProductoCard = ({ producto }) => {
  const [fotoIndexCard, setFotoIndexCard] = useState(0);  // Índice para la tarjeta
  const [fotoIndexModal, setFotoIndexModal] = useState(0);  // Índice para el modal
  const [intervalIdCard, setIntervalIdCard] = useState(null); // Intervalo para la tarjeta
  const [intervalIdModal, setIntervalIdModal] = useState(null); // Intervalo para el modal
  const [showModal, setShowModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedTalle, setSelectedTalle] = useState(null);

  const fotosArray = producto.fotos ? producto.fotos.split(",") : [];

  const {cart, setCart} = useContext(CartContext);
  
  useEffect(() => {
    // Guardar el carrito en localStorage cada vez que cambie
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Función para iniciar el cambio automático de fotos en la tarjeta
  const startAutoChangeCard = () => {
    if (!showModal && !intervalIdCard) { // Solo iniciar si el modal no está abierto
      const interval = setInterval(() => {
        setFotoIndexCard((prevIndex) => (prevIndex + 1) % fotosArray.length);
      }, 1500); // Cambiar la foto cada 1500ms para la tarjeta
      setIntervalIdCard(interval);
    }
  };

  // Función para detener el cambio automático de fotos en la tarjeta
  const stopAutoChangeCard = () => {
    clearInterval(intervalIdCard);
    setIntervalIdCard(null);
  };

  // Función para iniciar el cambio automático de fotos en el modal
  const startAutoChangeModal = () => {
    if (!intervalIdModal) {
      const interval = setInterval(() => {
        setFotoIndexModal((prevIndex) => (prevIndex + 1) % fotosArray.length);
      }, 2500); // Cambiar la foto cada 2500ms para el modal
      setIntervalIdModal(interval);
    }
  };

  // Función para detener el cambio automático de fotos en el modal
  const stopAutoChangeModal = () => {
    clearInterval(intervalIdModal);
    setIntervalIdModal(null);
  };

  const openModal = () => {
    setShowModal(true);
    stopAutoChangeCard(); // Detener el cambio automático de fotos de la tarjeta
    startAutoChangeModal(); // Iniciar el cambio automático de fotos en el modal
  };

  const closeModal = () => {
    setShowModal(false);
    stopAutoChangeModal(); // Detener el cambio automático de fotos del modal
    startAutoChangeCard(); // Reanudar el cambio automático de fotos de la tarjeta
    setSelectedColor(null);
    setSelectedTalle(null);
  };

  const addToCart = () => {
    if (!selectedColor || !selectedTalle) {
      alert("Por favor selecciona un color y un talle antes de añadir al carrito.");
      return;
    }
  
    const item = {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      color: selectedColor,
      talle: selectedTalle,
      cantidad: 1, // Por defecto añadimos una unidad
      imagen: fotosArray[0] || "placeholder.jpg",
    };
  
    // Verificar si el producto ya está en el carrito con el mismo color y talle
    const existingItemIndex = cart.findIndex(
      (cartItem) =>
        cartItem.id === item.id &&
        cartItem.color === item.color &&
        cartItem.talle === item.talle
    );
  
    if (existingItemIndex !== -1) {
      // Si ya existe, incrementar la cantidad
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].cantidad += 1;
      setCart(updatedCart);
    } else {
      // Si no existe, añadir al carrito
      setCart([...cart, item]);
    }
  
    // Cerrar el modal después de agregar al carrito
    closeModal();
  };



  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleSizeSelect = (talle) => {
    setSelectedTalle(talle);
  };

  const getAvailableColores = () => {
    if (selectedTalle) {
      const coloresDisponibles = producto.stock_variantes
        .filter((variant) => variant.talle === selectedTalle && variant.stock > 0)
        .map((variant) => variant.color);
      return [...new Set(coloresDisponibles)];
    }

    const coloresDisponibles = producto.stock_variantes
      .filter((variant) => variant.stock > 0)
      .map((variant) => variant.color);
    return [...new Set(coloresDisponibles)];
  };

  const getAvailableTalles = () => {
    if (selectedColor) {
      const tallesDisponibles = producto.stock_variantes
        .filter((variant) => variant.color === selectedColor && variant.stock > 0)
        .map((variant) => variant.talle);
      return [...new Set(tallesDisponibles)];
    }

    const tallesDisponibles = producto.stock_variantes
      .filter((variant) => variant.stock > 0)
      .map((variant) => variant.talle);
    return [...new Set(tallesDisponibles)];
  };

  useEffect(() => {
    return () => {
      if (intervalIdCard) {
        clearInterval(intervalIdCard); // Limpiar el intervalo de la tarjeta
      }
      if (intervalIdModal) {
        clearInterval(intervalIdModal); // Limpiar el intervalo del modal
      }
    };
  }, [intervalIdCard, intervalIdModal]);

  return (
    <div
      className="productoCard"
      onMouseEnter={startAutoChangeCard} // Iniciar cambio de fotos cuando el mouse entra
      onMouseLeave={stopAutoChangeCard} // Detener cambio de fotos cuando el mouse sale
    >
      <img
        src={fotosArray[fotoIndexCard] || "placeholder.jpg"}
        alt={`Foto de ${producto.nombre}`}
        onClick={openModal}
      />
      <h3>{producto.nombre}</h3>
    
      <p className="precio">${Number(producto.precio).toLocaleString("es-AR", { minimumFractionDigits: 2 })}</p>

      <button className="boton" onClick={openModal}>
        Comprar
      </button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <button className="close" onClick={closeModal}>
              X
            </button>
            <div className="modal-body">
              <div className="foto-container">
                <img
                  src={fotosArray[fotoIndexModal] || "placeholder.jpg"}
                  alt={`Foto de ${producto.nombre}`}
                  className="modal-foto"
                />
              </div>
              <div className="modal-info">
                <h3>{producto.nombre}</h3>
                <p className="precio">${Number(producto.precio).toLocaleString("es-AR", { minimumFractionDigits: 2 })}</p>

                <div className="colores">
                  <h4>Colores</h4>
                  {getAvailableColores().map((color, index) => (
                    <button
                      key={index}
                      onClick={() => handleColorSelect(color)}
                      className={selectedColor === color ? "selected" : "nonSelected"}
                    >
                      {color}
                    </button>
                  ))}
                </div>

                <div className="talles">
                  <h4>Talles</h4>
                  {getAvailableTalles().map((talle, index) => (
                    <button
                      key={index}
                      onClick={() => handleSizeSelect(talle)}
                      className={selectedTalle === talle ? "selected" : "nonSelected"}
                    >
                      {talle}
                    </button>
                  ))}
                </div>

                <div className="selected-options">
                  <p>Color seleccionado: {selectedColor || "Ninguno"}</p>
                  <p>Talle seleccionado: {selectedTalle || "Ninguno"}</p>
                </div>

                <button className="add-to-cart" onClick={addToCart}> Agregar al carrito </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductoCard;
