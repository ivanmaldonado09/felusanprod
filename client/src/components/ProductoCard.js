import React, { useState, useEffect, useContext } from "react";
import "./ModalProducto.css";
import "./Productos.css";
import { CartContext } from "./CartContext";

const ProductoCard = ({ producto }) => {
  const [fotoIndexCard, setFotoIndexCard] = useState(0);
  const [fotoIndexModal, setFotoIndexModal] = useState(0);
  const [intervalIdCard, setIntervalIdCard] = useState(null);
  const [intervalIdModal, setIntervalIdModal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedTalle, setSelectedTalle] = useState(null);

  const fotosArray = producto.fotos ? producto.fotos.split(",") : [];
  const { cart, setCart } = useContext(CartContext);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Funciones para la tarjeta (solo cambio automático)
  const startAutoChangeCard = () => {
    if (!showModal && !intervalIdCard) {
      const interval = setInterval(() => {
        setFotoIndexCard((prevIndex) => (prevIndex + 1) % fotosArray.length);
      }, 1500);
      setIntervalIdCard(interval);
    }
  };

  const stopAutoChangeCard = () => {
    clearInterval(intervalIdCard);
    setIntervalIdCard(null);
  };

  // Funciones de navegación para el modal
  const prevPhotoModal = (e) => {
    e.stopPropagation();
    setFotoIndexModal((prevIndex) => (prevIndex - 1 + fotosArray.length) % fotosArray.length);
  };

  const nextPhotoModal = (e) => {
    e.stopPropagation();
    setFotoIndexModal((prevIndex) => (prevIndex + 1) % fotosArray.length);
  };

  // Cambio automático en el modal
  const startAutoChangeModal = () => {
    if (!intervalIdModal) {
      const interval = setInterval(() => {
        setFotoIndexModal((prevIndex) => (prevIndex + 1) % fotosArray.length);
      }, 2500);
      setIntervalIdModal(interval);
    }
  };

  const stopAutoChangeModal = () => {
    clearInterval(intervalIdModal);
    setIntervalIdModal(null);
  };

  const openModal = () => {
    setShowModal(true);
    stopAutoChangeCard();
    startAutoChangeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    stopAutoChangeModal();
    startAutoChangeCard();
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
      cantidad: 1,
      imagen: fotosArray[0] || "placeholder.jpg",
    };

    const existingItemIndex = cart.findIndex(
      (cartItem) =>
        cartItem.id === item.id &&
        cartItem.color === item.color &&
        cartItem.talle === item.talle
    );

    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].cantidad += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, item]);
    }
    alert("Producto añadido al carrito.");
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
      if (intervalIdCard) clearInterval(intervalIdCard);
      if (intervalIdModal) clearInterval(intervalIdModal);
    };
  }, [intervalIdCard, intervalIdModal]);

  return (
    <div
      className="productoCard"
      onMouseEnter={startAutoChangeCard}
      onMouseLeave={stopAutoChangeCard}
    >
      {/* Tarjeta sin flechas: solo se muestra la imagen */}
      <div className="image-container" onClick={openModal}>
        <img
          src={fotosArray[fotoIndexCard] || "placeholder.jpg"}
          alt={`Foto de ${producto.nombre}`}
        />
      </div>
      <h3>{producto.nombre}</h3>
      <p className="precio">
        ${Number(producto.precio).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
      </p>
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
                {/* Flechas solo en el modal */}
                <button className="arrow left" onClick={prevPhotoModal}>
                  {"<"}
                </button>
                <img
                  src={fotosArray[fotoIndexModal] || "placeholder.jpg"}
                  alt={`Foto de ${producto.nombre}`}
                  className="modal-foto"
                />
                <button className="arrow right" onClick={nextPhotoModal}>
                  {">"}
                </button>
              </div>
              <div className="modal-info">
                <h3>{producto.nombre}</h3>
                <p className="precio">
                  ${Number(producto.precio).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                </p>

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

                <button className="add-to-cart" onClick={addToCart}>
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductoCard;
