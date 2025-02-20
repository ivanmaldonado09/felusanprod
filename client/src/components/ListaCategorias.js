import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ListaCategorias.css';

const ListaCategorias = () => {
  const [categories, setCategories] = useState([]); // Categorías principales con sus subcategorías
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Función para obtener las categorías del endpoint PHP
  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch("http://felusan.com/apis/obtener_categorias.php");
      const data = await response.json();
      if (data.success) {
        // Se asume que data.data es un array de categorías principales,
        // cada una con { id, nombre, es_mostrada, subcategorias: [...] }
        setCategories(data.data);
      } else {
        setError("Error al cargar las categorías.");
      }
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Función para eliminar una categoría
  const handleDelete = async (categoryId) => {
    if (!window.confirm("¿Está seguro de eliminar esta categoría?")) return;
    try {
      const formData = new FormData();
      formData.append('id', categoryId);

      const response = await fetch("http://felusan.com/apis/eliminar_categoria.php", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        fetchCategories(); // Actualiza la lista después de eliminar
      } else {
        alert(result.message || "Error al eliminar la categoría.");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Función para alternar el estado de "es_mostrada" de una categoría
  const handleToggle = async (categoryId) => {
    try {
      const formData = new FormData();
      formData.append('id', categoryId);

      const response = await fetch("http://felusan.com/apis/toggle_categoria.php", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        fetchCategories(); // Actualiza la lista después de cambiar el estado
      } else {
        alert(result.message || "Error al cambiar el estado de la categoría.");
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
      <h2>Categorías</h2>
      <div className="mb-3">
        <Link to="/admin/agregarCategoria" className="btn btn-primary">
          Agregar Categoría
        </Link>
      </div>

      {error && <div className="alertL alert-danger">{error}</div>}

      <table className="tableL table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Mostrada</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">
                No hay categorías registradas.
              </td>
            </tr>
          )}
          {categories.map(mainCat => (
            <React.Fragment key={mainCat.id}>
              {/* Fila de la categoría principal */}
              <tr className="tableL-primary">
                <td>{mainCat.id}</td>
                <td>{mainCat.nombre}</td>
                <td>{mainCat.es_mostrada ? "Sí" : "No"}</td>
                <td>
                  <Link to={`/admin/editarCategoria/${mainCat.id}`} className="btn btn-sm btn-warning me-2">
                    Editar
                  </Link>
                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() => handleToggle(mainCat.id)}
                  >
                    {mainCat.es_mostrada ? "Ocultar" : "Mostrar"}
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(mainCat.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
              {/* Mostrar todas las subcategorías, sin filtrarlas por es_mostrada */}
              {mainCat.subcategorias &&
                mainCat.subcategorias.map(subCat => (
                  <tr key={subCat.id} className="table-secondary">
                    <td>{subCat.id}</td>
                    <td style={{ paddingLeft: '30px' }}>↳ {subCat.nombre}</td>
                    <td>{subCat.es_mostrada ? "Sí" : "No"}</td>
                    <td>
                      <Link to={`/admin/editarCategoria/${subCat.id}`} className="btn btn-sm btn-warning me-2">
                        Editar
                      </Link>
                      <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() => handleToggle(subCat.id)}
                      >
                        {subCat.es_mostrada ? "Ocultar" : "Mostrar"}
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(subCat.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              }
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaCategorias;
