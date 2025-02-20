import React, { useState, useEffect } from "react";
import { obtenerProductos } from "../api/productoApi";
import ProductoCard from "./ProductoCard";
import { useLocation } from "react-router-dom";
import "./Productos.css";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [filtros, setFiltros] = useState({
    talle: [],
    genero: "",
    precio: { min: 0, max: Infinity },
    categoria: "",
    subcategoria: ""
  });
  const [filtroActivo, setFiltroActivo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [error, setError] = useState(null);
  const [limiteProductos, setLimiteProductos] = useState(9);

  const location = useLocation();

  // Cargar productos desde la API
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const productosData = await obtenerProductos();
        setProductos(productosData);
      } catch (err) {
        setError("Hubo un problema al cargar los productos.");
      }
    };
    cargarProductos();
  }, []);

  // Leer los parámetros de la URL para búsqueda y filtros
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const searchQuery = query.get("search") || "";
    const categoriaQuery = query.get("categoria") || "";
    const subcategoriaQuery = query.get("subcategoria") || "";
    const generoQuery = query.get("genero") || "";
    const talleQuery = query.get("talle") ? query.get("talle").split(",") : [];
    const minPrecio = query.get("minPrecio") || 0;
    const maxPrecio = query.get("maxPrecio") || Infinity;

    setFiltros({
      genero: generoQuery,
      talle: talleQuery,
      precio: { min: Number(minPrecio), max: Number(maxPrecio) },
      categoria: categoriaQuery,
      subcategoria: subcategoriaQuery,
    });
    setSearchTerm(searchQuery);
  }, [location.search]);

  // Filtrar productos según los filtros aplicados y stock de variantes
  useEffect(() => {
    const filtrarProductos = () => {
      return productos.filter((producto) => {
        // Verificar que al menos una variante tenga stock usando stock_variantes
        const tieneStock =
          producto.stock_variantes &&
          producto.stock_variantes.some((variant) => variant.stock > 0);
        if (!tieneStock) return false;

        // Búsqueda en nombre y descripción
        const cumpleBusqueda =
          producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase());

        // Filtrar por categoría: se compara con producto.categoria_id
        const cumpleCategoria =
          !filtros.categoria ||
          Number(producto.categoria_id) === Number(filtros.categoria);

        // Filtrar por subcategoría: se compara con producto.subcategoria_id
        const cumpleSubcategoria =
          !filtros.subcategoria ||
          Number(producto.subcategoria_id) === Number(filtros.subcategoria);

        const cumpleTalle =
          filtros.talle.length === 0 ||
          filtros.talle.some((talle) => producto.talles && producto.talles.includes(talle));

        const cumpleGenero =
          !filtros.genero ||
          producto.genero === filtros.genero ||
          producto.genero === "X";

        const cumplePrecio =
          producto.precio >= filtros.precio.min &&
          producto.precio <= filtros.precio.max;

        return (
          cumpleBusqueda &&
          cumpleCategoria &&
          cumpleSubcategoria &&
          cumpleTalle &&
          cumpleGenero &&
          cumplePrecio
        );
      });
    };
    setProductosFiltrados(filtrarProductos());
  }, [productos, filtros, searchTerm]);

  // Manejar el evento de scroll para cargar más productos
  const manejarScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      setLimiteProductos((prevLimite) => prevLimite + 6);
    }
  };

  // Agregar el listener de scroll al montar el componente
  useEffect(() => {
    window.addEventListener("scroll", manejarScroll);
    return () => {
      window.removeEventListener("scroll", manejarScroll);
    };
  }, []);

  // Manejar cambio de filtros
  const manejarCambioFiltro = (filtro, valor) => {
    setFiltros((prevFiltros) => {
      if (filtro === "talle") {
        const tallesActualizados = prevFiltros.talle.includes(valor)
          ? prevFiltros.talle.filter((t) => t !== valor)
          : [...prevFiltros.talle, valor];
        return { ...prevFiltros, talle: tallesActualizados };
      } else if (filtro === "genero") {
        return { ...prevFiltros, genero: prevFiltros.genero === valor ? "" : valor };
      } else if (filtro === "precio") {
        const nuevoPrecio = { ...prevFiltros.precio, ...valor };
        return { ...prevFiltros, precio: nuevoPrecio };
      }
      return prevFiltros;
    });
  };

  // Alternar el estado de los filtros desplegables
  const alternarFiltroActivo = (filtro) => {
    setFiltroActivo((prev) => (prev === filtro ? null : filtro));
  };

  return (
    <div className="container">
      {error && <p>{error}</p>}

      {/* Filtros */}
      <div className="filtros">
        <div className={`filtro ${filtroActivo === "talle" ? "filtro-activo" : ""}`}>
          <button onClick={() => alternarFiltroActivo("talle")}>
            Talles <span>{filtroActivo === "talle" ? "-" : "+"}</span>
          </button>
          <div className="filtro-opciones">
            {["S", "M", "L", "XL", "XXL", "XXXL"].map((talle) => (
              <label key={talle}>
                <input
                  type="checkbox"
                  checked={filtros.talle.includes(talle)}
                  onChange={() => manejarCambioFiltro("talle", talle)}
                />
                {talle}
              </label>
            ))}
          </div>
        </div>

        <div className={`filtro ${filtroActivo === "genero" ? "filtro-activo" : ""}`}>
          <button onClick={() => alternarFiltroActivo("genero")}>
            Género <span>{filtroActivo === "genero" ? "-" : "+"}</span>
          </button>
          <div className="filtro-opciones">
            {["M", "F", "X"].map((genero) => (
              <label key={genero}>
                <input
                  type="checkbox"
                  checked={filtros.genero === genero}
                  onChange={() => manejarCambioFiltro("genero", genero)}
                />
                {genero === "M" ? "Hombre" : genero === "F" ? "Mujer" : "Unisex"}
              </label>
            ))}
          </div>
        </div>

        <div className={`filtro ${filtroActivo === "precio" ? "filtro-activo" : ""}`}>
          <button onClick={() => alternarFiltroActivo("precio")}>
            Precio <span>{filtroActivo === "precio" ? "-" : "+"}</span>
          </button>
          <div className="filtro-opciones">
            <label>
              Desde:
              <input
                type="number"
                className="form__field"
                value={filtros.precio.min === 0 ? "" : filtros.precio.min}
                onChange={(e) =>
                  manejarCambioFiltro("precio", { min: Number(e.target.value) || 0 })
                }
              />
            </label>
            <label>
              Hasta:
              <input
                type="number"
                className="form__field"
                value={filtros.precio.max === Infinity ? "" : filtros.precio.max}
                onChange={(e) =>
                  manejarCambioFiltro("precio", { max: Number(e.target.value) || Infinity })
                }
              />
            </label>
          </div>
        </div>
      </div>

      {/* Galería de productos */}
      <div className="productos-grid">
        {productosFiltrados.slice(0, limiteProductos).length > 0 ? (
          productosFiltrados.slice(0, limiteProductos).map((producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))
        ) : (
          <p>No se encontraron productos.</p>
        )}
      </div>
    </div>
  );
};

export default Productos;
