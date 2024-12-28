import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductForm.css';

const EditProductForm = () => {
  const { id } = useParams(); // Obtiene el ID del producto de la URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    genero: '',
    prenda: '',
    tipo_id: '',
    ofertado: '0',
    precio_oferta: '',
    foto_url: null
  });

  const [productPhotos, setProductPhotos] = useState([]);
  const [variants, setVariants] = useState([]);
  const [colores, setColores] = useState([]);
  const [talles, setTalles] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);


  
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        // Cargar datos del producto
        const productResponse = await fetch(`http://felusan.com/apis/obtener_producto.php?id=${id}`);
       // const productResponse = await fetch(`http://localhost/client/apis/obtener_producto.php?id=${id}`);
        const productData = await productResponse.json();

        if (productData.success) {
          setFormData({
            id: productData.producto.id,
            nombre: productData.producto.nombre,
            precio: productData.producto.precio,
            genero: productData.producto.genero,
            prenda: productData.producto.prenda,
            tipo_id: productData.producto.tipo_id,
            ofertado: productData.producto.ofertado,
            precio_oferta: productData.producto.precio_oferta || ''
          });
         // Inicializar las fotos existentes
         if (productData.fotos && Array.isArray(productData.fotos)) {
          setProductPhotos(productData.fotos.map(foto => ({
            file: null,
            color_id: foto.color_id,
            current_url: foto.foto_url
          })));
        }

        setVariants(productData.variantes || []);
        } else {
          setError('No se pudo cargar el producto');
          navigate('/productos');
        }

        // Cargar datos de colores, talles y tipos
        const [coloresData, tallesData, tiposData] = await Promise.all([
          // fetch('http://localhost/client/apis/colores.php').then(res => res.json()),
          // fetch('http://localhost/client/apis/talles.php').then(res => res.json()),
          // fetch('http://localhost/client/apis/tipos.php').then(res => res.json())

          fetch('http://felusan.com/apis/colores.php').then(res => res.json()),
          fetch('http://felusan.com/apis/talles.php').then(res => res.json()),
          fetch('http://felusan.com/apis/tipos.php').then(res => res.json())
        
          ]);

        setColores(coloresData);
        setTalles(tallesData);
        setTipos(tiposData);

      } catch (err) {
        setError('Error al cargar los datos: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

    // Manejadores para las fotos
    const handlePhotoChange = (index, field, value) => {
      setProductPhotos(prevPhotos => {
        const newPhotos = [...prevPhotos];
        newPhotos[index] = {
          ...newPhotos[index],
          [field]: value
        };
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
  

  const handleVariantChange = (index, field, value) => {
    setVariants(prevVariants => {
      const newVariants = [...prevVariants];
      newVariants[index] = {
        ...newVariants[index],
        [field]: value
      };
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

  const [deletedPhotos, setDeletedPhotos] = useState([]);

const removePhoto = (index) => {
  const photoToRemove = productPhotos[index];
  if (photoToRemove.current_url) {
    setDeletedPhotos((prev) => [...prev, photoToRemove.current_url]);
  }
  setProductPhotos((prev) => prev.filter((_, i) => i !== index));
};
 



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

      // Agregar fotos eliminadas
      data.append('deleted_photos', JSON.stringify(deletedPhotos));


      
      // Agregar fotos
      let validPhotos = 0;
      productPhotos.forEach((photo, index) => {
        if (photo.color_id) {
          if (photo.file) {
            data.append(`foto_${validPhotos}`, photo.file);
          }
          data.append(`foto_color_${validPhotos}`, photo.color_id);
          validPhotos++;
        }
      });
      
      // Agregar el número total de fotos válidas
      data.append('total_fotos', validPhotos);
  
     const response = await fetch('http://felusan.com/apis/actualizar.php', {
      //const response = await fetch('http://localhost/client/apis/actualizar.php', {
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

          <div className="mb-3">
              <label className="form-label">Id del Producto</label>
              <input
                type="number"
                className="form-control"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                required
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

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Prenda</label>
                <select
                  className="form-select"
                  name="prenda"
                  value={formData.prenda}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="remera">Remera</option>
                  <option value="jean">Jean</option>
                  <option value="short">Short</option>
                  <option value="bermuda">Bermuda</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Tipo</label>
                <select
                  className="form-select"
                  name="tipo_id"
                  value={formData.tipo_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar</option>
                  {tipos.map(tipo => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.tipo}
                    </option>
                  ))}
                </select>
              </div>
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

           {/* Sección de fotos */}
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

            {/* Sección de variantes */}
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