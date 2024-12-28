import React, { useState, useEffect } from 'react';
import './Carrusel.css';

const Carrusel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    '/images/modelo1.png',
    '/images/modelo2.png',
    '/images/modelo3.png',
    '/images/modelo4.png',
  ]; // Rutas de ejemplo, cámbialas según tus imágenes

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  // Cambia automáticamente la imagen cada 4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, 4000); // 4000 ms = 4 segundos

    return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonte
  }, [images.length]);

  // Cambiar la imagen al tocarla
  const handleImageClick = () => {
    handleNext(); // Cambia a la siguiente imagen
  };

  return (
    <div className="carrusel" onClick={handleImageClick}>
      <img src={images[currentIndex]} alt={`Slide ${currentIndex + 1}`} className="carrusel-image" />
    </div>
  );
};

export default Carrusel;
