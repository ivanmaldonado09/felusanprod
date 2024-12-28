import React from 'react';
import Carrusel from './Carrusel';
import './Inicio.css';	

import ProductosInicio from './ProductosInicio';

const Inicio = () => {
  return (
    <div>
      <Carrusel />
      <h2>NUEVOS LANZAMIENTOS 🚀</h2>
      <ProductosInicio limit={8} />
    </div>
  );
};

export default Inicio;
