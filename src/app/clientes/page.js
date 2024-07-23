"use client";

import { useState, useEffect } from 'react';

const ClientesPage = () => {
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login'; // Redirige si no hay token
        return;
      }

      try {
        const response = await fetch('/api/clientes', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setClientes(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchClientes();
  }, []);

  return (
    <div>
      <h1>Clientes</h1>
      {error && <p>Error: {error}</p>}
      <ul>
        {clientes.length > 0 ? (
          clientes.map(cliente => (
            <li key={cliente._id}>
              {cliente.dNombre} - {cliente.dDocumento}
            </li>
          ))
        ) : (
          <li>No hay clientes disponibles</li>
        )}
      </ul>
    </div>
  );
};

export default ClientesPage;

