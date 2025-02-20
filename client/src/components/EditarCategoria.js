import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const EditarCategoria = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [nombre, setNombre] = useState('');
  const [esMostrada, setEsMostrada] = useState(true);
  const [padreId, setPadreId] = useState(null); // null significa categoría principal
  const [parentOptions, setParentOptions] = useState([]); // Opciones para la categoría padre
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Obtener la información de la categoría a editar (incluye padre_id)
  const fetchCategoria = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://felusan.com/apis/obtenerCategoriaPorId.php?id=${id}`);
      const data = await response.json();
      if (data.success) {
        const categoria = data.data;
        setNombre(categoria.nombre);
        setEsMostrada(categoria.es_mostrada);
        setPadreId(categoria.padre_id); // Puede ser null
      } else {
        setError(data.message || "No se pudo obtener la categoría.");
      }
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Obtener la lista de categorías principales para el select de padre  
  // Se usa el mismo API que devuelve categorías principales (donde padre_id es NULL)
  const fetchParentOptions = async () => {
    try {
      const response = await fetch("http://felusan.com/apis/obtener_categorias.php");
      const data = await response.json();
      if (data.success) {
        // data.data es un array de categorías principales.
        // Excluir la categoría que se está editando, para evitar asignarla a sí misma.
        const options = data.data.filter(cat => cat.id !== Number(id));
        setParentOptions(options);
      }
    } catch (err) {
      console.error("Error al obtener opciones de padres: " + err.message);
    }
  };
  
  useEffect(() => {
    fetchCategoria();
    fetchParentOptions();
  }, [id]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('nombre', nombre);
      formData.append('es_mostrada', esMostrada ? 1 : 0);
      // Si no se selecciona padre, se envía cadena vacía para asignar NULL
      formData.append('padre_id', padreId ? padreId : '');
      
      const response = await fetch('http://felusan.com/apis/actualizarCategoria.php', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        navigate('/admin/categorias');
      } else {
        setError(result.message || "Error al actualizar la categoría.");
      }
    } catch (err) {
      setError("Error: " + err.message);
    }
  };
  
  if (loading) {
    return <div className="container mt-4">Cargando...</div>;
  }
  
  return (
    <div className="container mt-4 editar-categoria">
      <h2>Editar Categoría</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input 
            type="text" 
            id="nombre" 
            className="form-control" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="padre_id">Categoría Padre:</label>
          <select 
            id="padre_id" 
            className="form-select" 
            value={padreId || ''} 
            onChange={(e) => setPadreId(e.target.value ? e.target.value : null)}
          >
            <option value="">Sin padre (Categoría Principal)</option>
            {parentOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group mt-3">
          <label htmlFor="esMostrada" className="form-check-label">Mostrada:</label>
          <input 
            type="checkbox" 
            id="esMostrada" 
            className="form-check-input ms-2" 
            checked={esMostrada} 
            onChange={(e) => setEsMostrada(e.target.checked)} 
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Actualizar Categoría
        </button>
        <Link to="/admin/categorias" className="btn btn-secondary mt-3 ms-2">
          Cancelar
        </Link>
      </form>
    </div>
  );
};

export default EditarCategoria;
