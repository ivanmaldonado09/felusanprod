import React, { useState, useEffect } from 'react';
import './ProductForm.css';

const ProductForm = () => {
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

  // Nuevo estado para manejar múltiples variantes
  const [variants, setVariants] = useState([
    { color_id: '', talle_id: '', stock: '' }
  ]);


    // Nuevo estado para manejar múltiples fotos
    const [productPhotos, setProductPhotos] = useState([
      { file: null, color_id: '' }
    ]);
  
    const [colores, setColores] = useState([]);
    const [talles, setTalles] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

  
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


    const addPhoto = () => {
      setProductPhotos(prev => [...prev, { file: null, color_id: '' }]);
    };
  
    // Función para eliminar foto
    const removePhoto = (index) => {
      if (productPhotos.length > 1) {
        setProductPhotos(prev => prev.filter((_, i) => i !== index));
      }
    };





  useEffect(() => {
    const fetchData = async () => {
      try {
       const coloresResponse = await fetch('http://felusan.com/apis/colores.php');
        const tallesResponse = await fetch('http://felusan.com/apis/talles.php');
         const tiposResponse = await fetch('http://felusan.com/apis/tipos.php');
        
        const coloresData = await coloresResponse.json();
        const tallesData = await tallesResponse.json();
        const tiposData = await tiposResponse.json();
        
        setColores(coloresData);
        setTalles(tallesData);
        setTipos(tiposData);
      } catch (err) {
        setError('Error al cargar los datos: ' + err.message);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Nuevo manejador para los cambios en las variantes
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

  // Función para agregar nueva variante
  const addVariant = () => {
    setVariants(prev => [...prev, { color_id: '', talle_id: '', stock: '' }]);
  };

  // Función para eliminar variante
  const removeVariant = (index) => {
    if (variants.length > 1) {
      setVariants(prev => prev.filter((_, i) => i !== index));
    }
  };



  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    handlePhotoChange(index, 'file', file);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const data = new FormData();
    
    // Agregar datos del producto principal
    Object.keys(formData).forEach(key => {
      if (key === 'foto_url' && formData[key]) {
        data.append('foto_url', formData[key]);
      } else {
        data.append(key, formData[key]);
      }
    });

    // Agregar variantes como JSON
    data.append('variants', JSON.stringify(variants));

    productPhotos.forEach((photo, index) => {
      if (photo.file && photo.color_id) {
        data.append(`foto_${index}`, photo.file);
        data.append(`foto_color_${index}`, photo.color_id);
      }
    });


    //agrego el nro total d efotos
    data.append('total_fotos', productPhotos.length);



    try {
      const response = await fetch('http://felusan.com/apis/agregar.php', {
        method: 'POST',
        body: data
      });

      const responseText = await response.text();
      const result = JSON.parse(responseText);

      if (result.success) {
        setSuccess('Producto agregado correctamente');
        setFormData({
          nombre: '',
          precio: '',
          genero: '',
          prenda: '',
          tipo_id: '',
          ofertado: '0',
          precio_oferta: '',
          foto_url: null
        });
        setVariants([{ color_id: '', talle_id: '', stock: '' }]);
      } else {
        setError(result.message || 'Error al agregar el producto');
      }
    } catch (err) {
      setError('Error al enviar los datos: ' + err.message);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Agregar Nuevo Producto</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Campos existentes del producto */}
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
                <div className="col-md-6">
                  <label className="form-label">Imagen</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => handleFileChange(index, e)}
                    accept="image/*"
                    required
                  />
                </div>
                <div className="col-md-5">
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
                <div className="col-md-1 d-flex align-items-end">
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

            <button type="submit" className="btn btn-primary w-100">
              Agregar Producto
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;