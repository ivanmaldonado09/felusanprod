import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductForm.css';

const EditProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estado principal del formulario (ya sin prenda ni tipo_id)
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    precio: '',
    genero: '',
    categoria_id: '',
    ofertado: '0',
    precio_oferta: '',
    foto_url: null
  });

  const [productPhotos, setProductPhotos] = useState([]);
  const [variants, setVariants] = useState([]);
  const [colores, setColores] = useState([]);
  const [talles, setTalles] = useState([]);
  const [categories, setCategories] = useState([]); // Categorías con subcategorías
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  // Estados para el manejo de la selección de categoría principal y subcategoría
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  // Función auxiliar para obtener las subcategorías de una categoría principal
  const getSubcategories = (mainCatId) => {
    const mainCat = categories.find(cat => String(cat.id) === String(mainCatId));
    return mainCat && mainCat.subcategorias ? mainCat.subcategorias : [];
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        // Cargar datos del producto
        //const productResponse = await fetch(`http://felusan.com/apis/obtener_producto.php?id=${id}`);
        const productResponse = await fetch(`http://localhost/felusanprod/client/apis/obtener_producto.php?id=${id}`);
        
        const productData = await productResponse.json();

        if (productData.success) {
          setFormData({
            id: productData.producto.id,
            nombre: productData.producto.nombre,
            precio: productData.producto.precio,
            genero: productData.producto.genero,
            categoria_id: productData.producto.categoria_id,
            ofertado: productData.producto.ofertado,
            precio_oferta: productData.producto.precio_oferta || '',
            foto_url: null
          });

          // Fotos existentes
          if (productData.fotos && Array.isArray(productData.fotos)) {
            setProductPhotos(
              productData.fotos.map(foto => ({
                file: null,
                color_id: foto.color_id,
                current_url: foto.foto_url
              }))
            );
          }
          setVariants(productData.variantes || []);
        } else {
          setError('No se pudo cargar el producto');
          navigate('/productos');
        }

        // Cargar datos de colores, talles y categorías
        // const [coloresData, tallesData, categoriasData] = await Promise.all([
        //   fetch('http://felusan.com/apis/colores.php').then(res => res.json()),
        //   fetch('http://felusan.com/apis/talles.php').then(res => res.json()),
        //   fetch('http://felusan.com/apis/obtener_categorias.php').then(res => res.json())
        // ]);

          const [coloresData, tallesData, categoriasData] = await Promise.all([
          fetch('http://localhost/felusanprod/client/apis/colores.php').then(res => res.json()),
          fetch('http://localhost/felusanprod/client/apis/talles.php').then(res => res.json()),
          fetch('http://localhost/felusanprod/client/apis/obtener_categorias.php').then(res => res.json())
        ]);

        setColores(coloresData.data || coloresData);
        setTalles(tallesData.data || tallesData);
        setCategories(categoriasData.data || []);
      } catch (err) {
        setError('Error al cargar los datos: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id, navigate]);

  // Cuando ya se tienen las categorías y el producto tiene asignada una, se determina
  // si es categoría principal o subcategoría
  useEffect(() => {
    if (categories.length > 0 && formData.categoria_id) {
      let found = false;
      for (const cat of categories) {
        if (cat.subcategorias && cat.subcategorias.find(sub => String(sub.id) === String(formData.categoria_id))) {
          setSelectedMainCategory(cat.id);
          setSelectedSubCategory(formData.categoria_id);
          found = true;
          break;
        }
      }
      if (!found) {
        // Si no se encontró en subcategorías, se asume que es categoría principal
        setSelectedMainCategory(formData.categoria_id);
        setSelectedSubCategory('');
      }
    }
  }, [categories, formData.categoria_id]);

  // Manejo de cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ============================
  // Manejo de Fotos
  // ============================
  const handlePhotoChange = (index, field, value) => {
    setProductPhotos(prevPhotos => {
      const newPhotos = [...prevPhotos];
      newPhotos[index] = { ...newPhotos[index], [field]: value };
      return newPhotos;
    });
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    handlePhotoChange(index, 'file', file);
  };

  const addPhoto = () => {
    setProductPhotos(prev => [...prev, { file: null, color_id: '', current_url: null }]);
  };

  const [deletedPhotos, setDeletedPhotos] = useState([]);

  const removePhoto = (index) => {
    const photoToRemove = productPhotos[index];
    if (photoToRemove.current_url) {
      setDeletedPhotos(prev => [...prev, photoToRemove.current_url]);
    }
    setProductPhotos(prev => prev.filter((_, i) => i !== index));
  };

  // ============================
  // Manejo de Variantes
  // ============================
  const handleVariantChange = (index, field, value) => {
    setVariants(prevVariants => {
      const newVariants = [...prevVariants];
      newVariants[index] = { ...newVariants[index], [field]: value };
      return newVariants;
    });
  };

  const addVariant = () => {
    setVariants(prev => [...prev, { color_id: '', talle_id: '', stock: '' }]);
  };

  const removeVariant = (index) => {
    if (variants.length > 1) {
      setVariants(prev => prev.filter((_, i) => i !== index));
    }
  };

  // ============================
  // Manejo de Categorías
  // ============================
  const handleMainCategoryChange = (e) => {
    const mainCatId = e.target.value;
    setSelectedMainCategory(mainCatId);
    setSelectedSubCategory('');
    // Se asigna por defecto la categoría principal
    setFormData(prev => ({ ...prev, categoria_id: mainCatId }));
  };

  const handleSubCategoryChange = (e) => {
    const subCatId = e.target.value;
    setSelectedSubCategory(subCatId);
    // Se asigna la subcategoría seleccionada
    setFormData(prev => ({ ...prev, categoria_id: subCatId || prev.categoria_id }));
  };

  // ============================
  // Envío del formulario
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = new FormData();
      // Agregar datos básicos del producto
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          data.append(key, formData[key]);
        }
      });

      // Agregar variantes como JSON
      data.append('variants', JSON.stringify(variants));

      // Agregar fotos eliminadas (para eliminarlas en el servidor)
      data.append('deleted_photos', JSON.stringify(deletedPhotos));

      // Agregar fotos nuevas y/o actualizadas
      let validPhotos = 0;
      productPhotos.forEach(photo => {
        if (photo.color_id) {
          if (photo.file) {
            data.append(`foto_${validPhotos}`, photo.file);
          }
          data.append(`foto_color_${validPhotos}`, photo.color_id);
          validPhotos++;
        }
      });
      data.append('total_fotos', validPhotos);

      const response = await fetch('http://localhost/felusanprod/client/apis/actualizar.php', {
        method: 'POST',
        body: data
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('La respuesta del servidor no es JSON válido');
      }

      const result = await response.json();

      if (result.success) {
        setSuccess('Producto actualizado correctamente');
        setTimeout(() => navigate('/productos'), 2000);
      } else {
        throw new Error(result.message || 'Error al actualizar el producto');
      }
    } catch (err) {
      console.error('Error completo:', err);
      setError(err.message || 'Error al enviar los datos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mt-4">Cargando...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Editar Producto</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* ID del producto (solo para visualización) */}
            <div className="mb-3">
              <label className="form-label">ID del Producto</label>
              <input
                type="number"
                className="form-control"
                name="id"
                value={formData.id}
                readOnly
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Nombre del Producto</label>
              <input
                type="text"
                className="form-control"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Precio</label>
                <input
                  type="number"
                  className="form-control"
                  name="precio"
                  value={formData.precio}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Género</label>
                <select
                  className="form-select"
                  name="genero"
                  value={formData.genero}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="X">Unisex</option>
                </select>
              </div>
            </div>

            {/* Selección de Categoría y Subcategoría */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Categoría</label>
                <select
                  className="form-select"
                  value={selectedMainCategory}
                  onChange={handleMainCategoryChange}
                  required
                >
                  <option value="">Seleccionar Categoría</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>
              {selectedMainCategory && getSubcategories(selectedMainCategory).length > 0 && (
                <div className="col-md-6">
                  <label className="form-label">Subcategoría</label>
                  <select
                    className="form-select"
                    value={selectedSubCategory}
                    onChange={handleSubCategoryChange}
                    required
                  >
                    <option value="">Seleccionar Subcategoría</option>
                    {getSubcategories(selectedMainCategory).map(sub => (
                      <option key={sub.id} value={sub.id}>
                        {sub.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">¿Está ofertado?</label>
                <select
                  className="form-select"
                  name="ofertado"
                  value={formData.ofertado}
                  onChange={handleInputChange}
                  required
                >
                  <option value="0">No</option>
                  <option value="1">Sí</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Precio de oferta</label>
                <input
                  type="number"
                  className="form-control"
                  name="precio_oferta"
                  value={formData.precio_oferta}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  disabled={formData.ofertado === '0'}
                />
              </div>
            </div>

            {/* Sección de Fotos */}
            <div className="card mt-4 mb-3">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Fotos del Producto</h5>
                <button 
                  type="button" 
                  className="btn btn-success btn-sm"
                  onClick={addPhoto}
                >
                  + Agregar Foto
                </button>
              </div>
              <div className="card-body">
                {productPhotos.map((photo, index) => (
                  <div key={index} className="border rounded p-3 mb-3">
                    <div className="row">
                      <div className="col-md-3">
                        {photo.current_url && (
                          <img 
                            src={photo.current_url} 
                            alt={`Foto ${index + 1}`} 
                            className="img-thumbnail mb-2" 
                            style={{ maxWidth: '100px' }}
                          />
                        )}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Nueva imagen</label>
                        <input
                          type="file"
                          className="form-control"
                          onChange={(e) => handleFileChange(index, e)}
                          accept="image/*"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Color de la foto</label>
                        <select
                          className="form-select"
                          value={photo.color_id}
                          onChange={(e) => handlePhotoChange(index, 'color_id', e.target.value)}
                          required
                        >
                          <option value="">Seleccionar</option>
                          {colores.map(color => (
                            <option key={color.id} value={color.id}>
                              {color.color}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-1 d-flex align-items-center">
                        {productPhotos.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => removePhoto(index)}
                          >
                            X
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sección de Variantes */}
            <div className="card mt-4 mb-3">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Variantes del Producto</h5>
                <button 
                  type="button" 
                  className="btn btn-success btn-sm"
                  onClick={addVariant}
                >
                  + Agregar Variante
                </button>
              </div>
              <div className="card-body">
                {variants.map((variant, index) => (
                  <div key={index} className="border rounded p-3 mb-3">
                    <div className="row">
                      <div className="col-md-4">
                        <label className="form-label">Color</label>
                        <select
                          className="form-select"
                          value={variant.color_id}
                          onChange={(e) => handleVariantChange(index, 'color_id', e.target.value)}
                          required
                        >
                          <option value="">Seleccionar</option>
                          {colores.map(color => (
                            <option key={color.id} value={color.id}>
                              {color.color}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Talle</label>
                        <select
                          className="form-select"
                          value={variant.talle_id}
                          onChange={(e) => handleVariantChange(index, 'talle_id', e.target.value)}
                          required
                        >
                          <option value="">Seleccionar</option>
                          {talles.map(talle => (
                            <option key={talle.id} value={talle.id}>
                              {talle.talle}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Stock</label>
                        <input
                          type="number"
                          className="form-control"
                          value={variant.stock}
                          onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                          required
                          min="0"
                        />
                      </div>
                      <div className="col-md-1 d-flex align-items-end">
                        {variants.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => removeVariant(index)}
                          >
                            X
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {success && (
              <div className="alert alert-success" role="alert">
                {success}
              </div>
            )}

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary flex-grow-1">
                Actualizar Producto
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate('/admin')}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProductForm;
