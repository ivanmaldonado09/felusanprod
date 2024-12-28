import axios from 'axios';



// URL de la API
//const API_URL = 'http://localhost/client/locall.php';
 const API_URL = 'http://felusan.com/locall.php';


// Función para obtener la contraseña
export const obtenerContrasena = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.contrasena;  // Devuelve solo la contraseña
  } catch (error) {
    console.error('Error al obtener la contraseña:', error);
    throw error;
  }
};
