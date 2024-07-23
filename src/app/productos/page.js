// app/productos/page.js
import { useState, useEffect } from 'react';

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('/api/productos');
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error('Error fetching productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Productos</h1>
      <ul>
        {productos.map(producto => (
          <li key={producto._id}>
            <p>Código: {producto.proCodigo}</p>
            <p>Descripción: {producto.proDescripcion}</p>
            <p>Valor: {producto.proValor}</p>
            <p>Cantidad: {producto.proCantidad}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductosPage;
