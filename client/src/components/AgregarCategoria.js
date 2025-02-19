import React, { useState, useEffect } from 'react';

const AgregarCategoria = () => {
  const [nombre, setNombre] = useState('');
  const [esPrincipal, setEsPrincipal] = useState('1'); // "1" = principal, "0" = subcategoría
  const [categoriaPadre, setCategoriaPadre] = useState('');
  const [esMostrada, setEsMostrada] = useState('1'); // Valor "1" = Sí, "0" = No
  const [mainCategories, setMainCategories] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Cargar listado de categorías principales para el select (en caso de subcategoría)
  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const response = await fetch("http://localhost/felusanprod/client/apis/obtener_categorias.php");
        const data = await response.json();
        if (data.success) {
          setMainCategories(data.data);
        } else {
          setError("Error al cargar las categorías.");
        }
      } catch (err) {
        setError("Error: " + err.message);
      }
    };

    fetchMainCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('es_principal', esPrincipal);
      formData.append('es_mostrada', esMostrada);

      // Si es subcategoría, se debe enviar el id de la categoría principal
      if (esPrincipal === "0") {
        if (!categoriaPadre) {
          throw new Error("Debe seleccionar una categoría principal para la subcategoría.");
        }
        formData.append('categoria_padre', categoriaPadre);
      }

      const response = await fetch("http://localhost/felusanprod/client/apis/agregarCategoria.php", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (result.success) {
        setSuccess("Categoría agregada correctamente.");
        setNombre('');
        setEsPrincipal('1');
        setCategoriaPadre('');
        setEsMostrada('1');
      } else {
        setError(result.message || "Error al agregar la categoría.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Agregar Categoría</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Nombre de la categoría */}
            <div className="mb-3">
              <label className="form-label">Nombre de la categoría</label>
              <input
                type="text"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            {/* Selección del tipo de categoría */}
            <div className="mb-3">
              <label className="form-label">Tipo de Categoría</label>
              <select
                className="form-select"
                value={esPrincipal}
                onChange={(e) => setEsPrincipal(e.target.value)}
              >
                <option value="1">Categoría Principal</option>
                <option value="0">Subcategoría</option>
              </select>
            </div>

            {/* Campo para definir si la categoría se mostrará */}
            <div className="mb-3">
              <label className="form-label">¿Mostrar categoría?</label>
              <select
                className="form-select"
                value={esMostrada}
                onChange={(e) => setEsMostrada(e.target.value)}
                required
              >
                <option value="1">Sí</option>
                <option value="0">No</option>
              </select>
            </div>

            {/* Si es subcategoría, mostrar select para elegir la categoría principal */}
            {esPrincipal === "0" && (
              <div className="mb-3">
                <label className="form-label">Seleccione la Categoría Principal</label>
                <select
                  className="form-select"
                  value={categoriaPadre}
                  onChange={(e) => setCategoriaPadre(e.target.value)}
                  required
                >
                  <option value="">Seleccione una categoría</option>
                  {mainCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Agregando..." : "Agregar Categoría"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AgregarCategoria;
