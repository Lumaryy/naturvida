// app/vendedores/page.js
import { useState, useEffect } from 'react';

const VendedoresPage = () => {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendedores = async () => {
      try {
        const response = await fetch('/api/vendedores');
        const data = await response.json();
        setVendedores(data);
      } catch (error) {
        console.error('Error fetching vendedores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendedores();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Vendedores</h1>
      <ul>
        {vendedores.map(vendedor => (
          <li key={vendedor._id}>
            <p>Usuario: {vendedor.venUsuario}</p>
            <p>Contraseña: {vendedor.venContrasena}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VendedoresPage;
