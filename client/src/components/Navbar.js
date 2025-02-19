import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from './CartContext';
import './Navbar.css';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [menuActivo, setMenuActivo] = useState(false);
  const [submenuActivo, setSubmenuActivo] = useState(null);
  const [categories, setCategories] = useState([]);

  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener las categorías desde la API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost/felusanprod/client/apis/obtener_categorias.php');
        if (response.data.success) {
          setCategories(response.data.data);
        } else {
          console.error("Error en la respuesta de la API:", response.data);
        }
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };
    fetchCategories();
  }, []);

  // Filtrar solo las categorías principales que se deben mostrar (es_mostrada true)
  const mainCategories = categories.filter(categoria => categoria.es_mostrada);

  const manejarCambioBusqueda = (e) => {
    const nuevoTermino = e.target.value;
    setSearchTerm(nuevoTermino);
    if (location.pathname === '/productos' || location.pathname === '/') {
      if (nuevoTermino) {
        navigate(`/productos?search=${nuevoTermino}`);
      } else {
        navigate("/productos");
      }
    }
  };

  const manejarFiltroGenero = (genero) => {
    navigate(`/productos?genero=${genero}`);
  };

  const toggleMenu = () => {
    setMenuActivo(!menuActivo);
  };

  const manejarSubmenu = (menu) => {
    setSubmenuActivo(submenuActivo === menu ? null : menu);
  };

  return (
    <div className="navbar">
      <div className="navbar-top">
        <a href="/" className="navbar-title">FELUSAN</a>
        
        <div className="search-cart-container">
          <div className="search">
            <input
              type="text"
              placeholder="Buscar"
              value={searchTerm}
              onChange={manejarCambioBusqueda}
            />
          </div>

          <div className="navbar-icons">
            <div className="cart" onClick={() => navigate('/carrito')} style={{ cursor: 'pointer' }}>
              <i className="fas fa-shopping-cart"></i>
              {cartCount > 0 && <span className="cart-dot"></span>}
            </div>
          </div>
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>

      <div className={`navbar-bottom ${menuActivo ? 'active' : ''}`}>
        <button onClick={() => navigate(`/`)}>Inicio</button>
        <button onClick={() => manejarFiltroGenero('M')}>HOMBRE</button>
        <button onClick={() => manejarFiltroGenero('F')}>MUJER</button>

        {mainCategories.map(mainCat => {
          // Filtrar las subcategorías que también tengan es_mostrada true
          const subCategoriasMostradas = mainCat.subcategorias
            ? mainCat.subcategorias.filter(sub => sub.es_mostrada)
            : [];

          return (
            <div
              key={mainCat.id}
              className="dropdown"
              onMouseEnter={() => manejarSubmenu(mainCat.id)}
              onMouseLeave={() => manejarSubmenu(null)}
            >
              <button onClick={() => navigate(`/productos?categoria=${mainCat.id}`)}>
                {mainCat.nombre}
              </button>
              {submenuActivo === mainCat.id && subCategoriasMostradas.length > 0 && (
                <div className="dropdown-menu">
                  {subCategoriasMostradas.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => navigate(`/productos?categoria=${mainCat.id}&subcategoria=${sub.id}`)}
                    >
                      {sub.nombre}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Navbar;
