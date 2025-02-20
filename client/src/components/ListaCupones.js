import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ListaCategorias.css';

const ListaCupones = () => {
  const [cupones, setCupones] = useState([]); // Categorías principales con sus subcategorías
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Función para obtener las categorías del endpoint PHP
  const fetchCupones = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch("http://localhost/felusanprod/client/apis/obtenerCupones.php");
      const data = await response.json();
      // Si data es un array, lo usamos directamente, sino buscamos data.data
      if (Array.isArray(data)) {
        setCupones(data);
      } else if (data.success) {
        setCupones(data.data);
      } else {
        setError("Error al cargar los cupones.");
      }
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCupones();
  }, []);

  // Función para eliminar cuponn
  const handleDelete = async (cuponId) => {
    if (!window.confirm("¿Está seguro de eliminar este cupon?")) return;
    try {
      const formData = new FormData();
      formData.append('id', cuponId);

      const response = await fetch("http://localhost/felusanprod/client/apis/eliminarCupon.php", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        fetchCupones(); // Actualiza la lista después de eliminar
      } else {
        alert(result.message || "Error al eliminar el cupon");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };



  if (loading) {
    return <div className="containerL mt-4">Cargando...</div>;
  }

  return (
    <div className="containerL mt-4">
      <h2>Cupones</h2>
      <div className="mb-3">
        <Link to="/admin/agregarCupon" className="btn btn-primary">
          Agregar Cupon
        </Link>
      </div>

      {error && <div className="alertL alert-danger">{error}</div>}

      <table className="tableL table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descuento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cupones.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">
                Actualmente no hay cupones.
              </td>
            </tr>
          )}
          {cupones.map(cupon => (
            <React.Fragment key={cupon.id}>
              {/* Fila de la categoría principal */}
              <tr className="tableL-primary">
                <td>{cupon.id}</td>
                <td>{cupon.nombre}</td>
                <td>{cupon.descuento}</td>
                <td>
                
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(cupon.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaCupones;
