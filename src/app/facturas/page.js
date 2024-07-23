// app/facturas/page.js
import { useState, useEffect } from 'react';

const FacturasPage = () => {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const response = await fetch('/api/facturas');
        const data = await response.json();
        setFacturas(data);
      } catch (error) {
        console.error('Error fetching facturas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacturas();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Facturas</h1>
      <ul>
        {facturas.map(factura => (
          <li key={factura._id}>
            <p>Numero: {factura.facNumero}</p>
            <p>Fecha: {factura.facFecha}</p>
            <p>Cliente: {factura.facCliente}</p>
            <p>Valor Total: {factura.facValorTotal}</p>
            <p>Vendedor: {factura.facVendedor}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FacturasPage;
