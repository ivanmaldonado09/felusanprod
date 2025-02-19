import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';  // Importamos el componente Navbar
import Productos from './components/Productos';
import Cart from './components/Cart';
import Inicio from './components/Inicio';  // Suponiendo que este es el banner
import AdminPanel from './components/AdminPanel';
import EditProductForm from './components/EditProductForm';  // Componente para editar producto
import ProductForm from './components/ProductForm'; 
import './App.css';
import AgregarTalle from './components/AgregarTalle';
import AgregarColor from './components/AgregarColor';
import AgregarCategoria from './components/AgregarCategoria';
import ListaCategorias from './components/ListaCategorias';
import EditarCategoria from './components/EditarCategoria';

const App = () => {
  return (
    <Router>
      {/* Navbar está en la parte superior de todas las páginas */}
      <Navbar />


      <Routes>
        {/* Ruta principal con el banner */}
        <Route path="/" element={<Inicio />} />
        {/* Ruta para el componente Productos */}
        <Route path="/productos" element={<Productos />} />
        {/* Ruta para el carrito */}
        <Route path="/carrito" element={<Cart />} />
        <Route path="/admin" element={<AdminPanel />} />
        {/* Ruta para editar producto, protegida por autorización */}
        <Route path="/admin/editar/:id" element={<EditProductForm />} />
        {/* Ruta para agregar producto, protegida por autorización */}
        <Route path="/admin/agregar" element={<ProductForm />} />

        <Route path="/admin/agregarTalle" element={<AgregarTalle />} />

        <Route path="/admin/agregarColor" element={<AgregarColor />} />

        <Route path="/admin/categorias" element={<ListaCategorias />} />

        <Route path="/admin/agregarCategoria" element={<AgregarCategoria />} />

        <Route path="/admin/editarCategoria/:id" element={<EditarCategoria />} />

      </Routes>
      
    </Router>
  );
};

export default App;
