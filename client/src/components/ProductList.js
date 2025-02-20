import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { obtenerProductos } from "../api/productoApi"; // Importamos la API
import "./ProductList.css";

const ProductList = () => {
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Cargar los productos desde la API
  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const productosData = await obtenerProductos();
      setProductos(productosData);
    } catch (err) {
      setError("Error al cargar los productos.");
    }
  };

  const manejarEliminar = async (id) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este producto? Se eliminarán también todas sus variantes y fotos asociadas."
    );

    if (confirmed) {
      setLoading(true);
      try {
        const response = await fetch("http://felusan.com/apis/eliminar.php", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id }),
        });

        const result = await response.json();

        if (result.success) {
          setProductos((prevProductos) =>
            prevProductos.filter((producto) => producto.id !== id)
          );
          alert("Producto eliminado correctamente");
        } else {
          alert(result.message || "Error al eliminar el producto");
        }
      } catch (err) {
        setError("Error de red: " + err.message);
        alert("Error al eliminar el producto");
      } finally {
        setLoading(false);
      }
    }
  };

  const manejarEditar = (id) => {
    navigate(`/admin/editar/${id}`);
  };

  // Filtrar los productos según el término de búsqueda
  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <>
      <div className="admin-container">
        <button
          className="add-product-btn"
          onClick={() => navigate('/admin/agregar')}
          disabled={loading}
        >
          Agregar Producto
        </button>

        <button
          className="add-product-btn"
          onClick={() => navigate('/admin/agregarTalle')}
          disabled={loading}
        >
          Agregar Talle
        </button>

        <button
          className="add-product-btn"
          onClick={() => navigate('/admin/agregarColor')}
          disabled={loading}
        >
          Agregar Color
        </button>

        <button
          className="add-product-btn"
          onClick={() => navigate('/admin/categorias')}
          disabled={loading}
        >
          Categorias
        </button>


        <button
          className="add-product-btn"
          onClick={() => navigate('/admin/cupones')}
          disabled={loading}
        >
          Cupones
        </button>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="product-list-container">
        <h1>Lista de Productos</h1>
        {loading && <div className="loading">Cargando...</div>}
        {productosFiltrados.length === 0 ? (
          <p>No hay productos disponibles.</p>
        ) : (
          <table className="product-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Género</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td>{producto.nombre}</td>
                  <td>${producto.precio}</td>
                  <td>{producto.genero}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => manejarEditar(producto.id)}
                      disabled={loading}
                    >
                      Editar
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => manejarEliminar(producto.id)}
                      disabled={loading}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default ProductList;
