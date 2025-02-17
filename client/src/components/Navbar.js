import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from './CartContext';
import './Navbar.css';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [menuActivo, setMenuActivo] = useState(false);
  const [submenuActivo, setSubmenuActivo] = useState(null); // Nuevo estado para manejar submenús
  const { cartCount } = useContext(CartContext); // Usar el contexto
  
  const navigate = useNavigate();
  const location = useLocation();


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

        <div
          className="dropdown"
          onMouseEnter={() => manejarSubmenu('remeras')}
          onMouseLeave={() => manejarSubmenu(null)}
        >
          <button onClick={() => navigate(`/productos?prenda=remera`)}>Remeras</button>
          {submenuActivo === 'remeras' && (
            <div className="dropdown-menu">
              <button onClick={() => navigate(`/productos?tipo=regular-Remera`)}>Regular</button>
              <button onClick={() => navigate(`/productos?tipo=oversize-Remera`)}>Oversize</button>
              <button onClick={() => navigate(`/productos?tipo=musculosa-Remera`)}>Musculosa</button>
              <button onClick={() => navigate(`/productos?tipo=boxyfit-Remera`)}>Boxy Fit</button>
            </div>
          )}
        </div>

        <div
          className="dropdown"
          onMouseEnter={() => manejarSubmenu('jeans')}
          onMouseLeave={() => manejarSubmenu(null)}
        >
          <button onClick={() => navigate(`/productos?prenda=jean`)}>Jeans</button>
          {submenuActivo === 'jeans' && (
            <div className="dropdown-menu">
              <button onClick={() => navigate(`/productos?tipo=cargo-Jean`)}>Cargo</button>
              <button onClick={() => navigate(`/productos?tipo=mom-Jean`)}>Mom</button>
            </div>
          )}
        </div>

        <div
          className="dropdown"
          onMouseEnter={() => manejarSubmenu('shorts')}
          onMouseLeave={() => manejarSubmenu(null)}
        >
          <button onClick={() => navigate(`/productos?prenda=short`)}>Shorts</button>
          {submenuActivo === 'shorts' && (
            <div className="dropdown-menu">
              <button onClick={() => navigate(`/productos?tipo=algodon-Short`)}>Algodón</button>
              <button onClick={() => navigate(`/productos?tipo=jean-Short`)}>Jean</button>
              <button onClick={() => navigate(`/productos?tipo=sastrero-Short`)}>Sastrero</button>
            </div>
          )}
        </div>

        <div
          className="dropdown"
          onMouseEnter={() => manejarSubmenu('bermudas')}
          onMouseLeave={() => manejarSubmenu(null)}
        >
          <button onClick={() => navigate(`/productos?prenda=bermuda`)}>Bermudas</button>
          {submenuActivo === 'bermudas' && (
            <div className="dropdown-menu">
              <button onClick={() => navigate(`/productos?tipo=algodon-Bermuda`)}>Algodón</button>
              <button onClick={() => navigate(`/productos?tipo=jean-Bermuda`)}>Jean</button>
            </div>
          )}
        </div>



        <div
          className="dropdown"
          onMouseEnter={() => manejarSubmenu('bodys')}
          onMouseLeave={() => manejarSubmenu(null)}
        >
          <button onClick={() => navigate(`/productos?prenda=body`)}>Bodys</button>
          {submenuActivo === 'bodys' && (
            <div className="dropdown-menu">
              <button onClick={() => navigate(`/productos?tipo=morley-Body`)}>Morley</button>
              <button onClick={() => navigate(`/productos?tipo=microfibra-Body`)}>Microfibra</button>
            </div>
          )}
        </div>


        <div
          className="dropdown"
          onMouseEnter={() => manejarSubmenu('accesorios')}
          onMouseLeave={() => manejarSubmenu(null)}
        >
          <button onClick={() => navigate(`/productos?prenda=accesorio`)}>Accesorios</button>
          {submenuActivo === 'accesorios' && (
            <div className="dropdown-menu">
              <button onClick={() => navigate(`/productos?tipo=gorras-Accesorio`)}>Gorras</button>
            </div>
          )}
        </div>



        <div
          className="dropdown"
          onMouseEnter={() => manejarSubmenu('superiores')}
          onMouseLeave={() => manejarSubmenu(null)}
        >
          <button onClick={() => navigate(`/productos?prenda=superior`)}>Prendas superiores</button>
          {submenuActivo === 'superiores' && (
            <div className="dropdown-menu">
              <button onClick={() => navigate(`/productos?tipo=bando-Superior`)}>Bando</button>
              <button onClick={() => navigate(`/productos?tipo=strapless-Superior`)}>Strapelss</button>
              <button onClick={() => navigate(`/productos?tipo=top-Superior`)}>Top</button>
              <button onClick={() => navigate(`/productos?tipo=corset-Superior`)}>Corset</button>

            </div>
          )}
        </div>


      </div>
    </div>
  );
};

export default Navbar;
