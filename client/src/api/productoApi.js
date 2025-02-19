import axios from 'axios';




//const API_URL = 'http://felusan.com/productos.php'; // URL de la API
const API_URL = 'http://localhost/felusanprod/client/productos.php';


// Función para obtener los productos
export const obtenerProductos = async () => {
  try {
    const response = await axios.get(API_URL);

    const productosData = response.data.map(producto => {
      // Convertir las combinaciones de stock en un array de objetos { color, talle, stock }
      const stockVariantes = producto.stock_variantes
        ? producto.stock_variantes.split(",").map(variant => {
            const [color, talle, stock] = variant.split("-");
            return { color, talle, stock: parseInt(stock, 10) };
          })
        : [];

      return {
        ...producto,
        colores: producto.colores ? producto.colores : [],
        talles: producto.talles ? producto.talles : [],
        stock_variantes: stockVariantes, // Ahora es un array de objetos {color, talle, stock}
      };
    });

    return productosData;
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    throw error;
  }
};


export const eliminarProducto = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    throw error;
  }
};



