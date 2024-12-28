import React, { useState, useEffect } from "react";
import { obtenerProductos } from "../api/inicioApi";
import ProductoCard from "./ProductoCard";
import "./ProductosInicio.css";

const ProductosInicio = () => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const productosData = await obtenerProductos();
        setProductos(productosData);
      } catch (err) {
        setError("Hubo un problema al cargar los productos.");
      }
    };
    cargarProductos();
  }, []);

  return (
    <div className="container-inicio">
      
      {error && <p className="error">{error}</p>}
      <div className="productos-grid-inicio">
        {productos.length > 0 ? (
          productos.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))
        ) : (
          <p>No hay productos disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default ProductosInicio;
