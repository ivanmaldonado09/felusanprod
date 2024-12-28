import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerContrasena } from '../api/adminApi';
import ProductList from './ProductList';

const AdminPanel = () => {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Cargar contrasena desde la API
  const [passData, setPassData] = useState('');
  useEffect(() => {
    const cargarContrasena = async () => {
      try {
        const passData = await obtenerContrasena();
        setPassData(passData);
      } catch (err) {
        setError('Hubo un problema al cargar la contraseña.');
      }
    };
    cargarContrasena();
  }, []);

  // Verificar si ya está autenticado
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated) {
      setIsAuthorized(true);
    }
  }, []);

  const handleLogin = () => {
    const correctPassword = passData;
    if (password === correctPassword) {
      // Guardar en localStorage que el usuario está autenticado
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthorized(true);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const handleLogout = () => {
    // Limpiar la sesión y redirigir
    localStorage.removeItem('isAuthenticated');
    setIsAuthorized(false);
    navigate('/');
  };

  if (isAuthorized) {
    return (
      <div>
        <h1>Panel de Administración</h1>
        <ProductList />
        <button onClick={handleLogout}>Cerrar sesión</button>
        <button onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Acceso al Panel de Administrador</h1>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Ingrese la contraseña"
      />
      <button onClick={handleLogin}>Ingresar</button>
    </div>
  );
};

export default AdminPanel;
