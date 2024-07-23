"use client";

import { useState, useEffect } from 'react';

const ClientesPage = () => {
  // Estado para almacenar la lista de clientes
  const [clientes, setClientes] = useState([]);
  // Estado para manejar los errores
  const [error, setError] = useState(null);
  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState({
    dDocumento: '',
    dNombre: '',
    dDireccion: '',
    dTelefono: '',
    dCorreo: ''
  });
  // Estado para manejar el cliente que se está editando
  const [editingCliente, setEditingCliente] = useState(null);

  // Hook useEffect para obtener la lista de clientes al montar el componente
  useEffect(() => {
    const fetchClientes = async () => {
      // Obtener el token del almacenamiento local
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login'; // Redirige si no hay token
        return;
      }

      try {
        // Realizar la solicitud GET para obtener la lista de clientes
        const response = await fetch('/api/clientes', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Enviar el token en los encabezados
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Convertir la respuesta a JSON y actualizar el estado de clientes
        const data = await response.json();
        setClientes(data);
      } catch (error) {
        setError(error.message); // Manejar errores
      }
    };

    fetchClientes();
  }, []);

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Manejar la creación de un nuevo cliente
  const handleCreateCliente = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login'; // Redirige si no hay token
      return;
    }

    try {
      // Realizar la solicitud POST para crear un nuevo cliente
      const response = await fetch('/api/clientes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Enviar datos en formato JSON
          'Authorization': `Bearer ${token}`, // Enviar el token en los encabezados
        },
        body: JSON.stringify(formData) // Enviar los datos del formulario
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Obtener el nuevo cliente creado y actualizar la lista de clientes
      const newCliente = await response.json();
      setClientes([...clientes, newCliente]);
      // Limpiar el formulario después de la creación
      setFormData({
        dDocumento: '',
        dNombre: '',
        dDireccion: '',
        dTelefono: '',
        dCorreo: ''
      });
    } catch (error) {
      setError(error.message); // Manejar errores
    }
  };

  // Manejar la actualización de un cliente existente
  const handleUpdateCliente = async () => {
    if (!editingCliente) return; // Verificar si hay un cliente siendo editado

    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login'; // Redirige si no hay token
      return;
    }

    try {
      // Realizar la solicitud PUT para actualizar el cliente
      const response = await fetch(`/api/clientes/${editingCliente._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', // Enviar datos en formato JSON
          'Authorization': `Bearer ${token}`, // Enviar el token en los encabezados
        },
        body: JSON.stringify(formData) // Enviar los datos actualizados del formulario
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Obtener el cliente actualizado y actualizar la lista de clientes
      const updatedCliente = await response.json();
      setClientes(clientes.map(cliente => cliente._id === updatedCliente._id ? updatedCliente : cliente));
      // Limpiar el formulario y el estado de edición después de la actualización
      setEditingCliente(null);
      setFormData({
        dDocumento: '',
        dNombre: '',
        dDireccion: '',
        dTelefono: '',
        dCorreo: ''
      });
    } catch (error) {
      setError(error.message); // Manejar errores
    }
  };

  // Manejar la eliminación de un cliente
  const handleDeleteCliente = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login'; // Redirige si no hay token
      return;
    }

    try {
      // Realizar la solicitud DELETE para eliminar el cliente
      const response = await fetch(`/api/clientes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // Enviar el token en los encabezados
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Actualizar la lista de clientes después de la eliminación
      setClientes(clientes.filter(cliente => cliente._id !== id));
    } catch (error) {
      setError(error.message); // Manejar errores
    }
  };

  // Manejar la edición de un cliente
  const handleEditCliente = (cliente) => {
    setFormData(cliente); // Pre-cargar los datos del cliente en el formulario
    setEditingCliente(cliente); // Establecer el cliente en el estado de edición
  };

  return (
    <div>
      <h1>Clientes</h1>
      {error && <p>Error: {error}</p>}
      <ul>
        {clientes.length > 0 ? (
          clientes.map(cliente => (
            <li key={cliente._id}>
              <p><strong>Nombre:</strong> {cliente.dNombre}</p>
              <p><strong>Documento:</strong> {cliente.dDocumento}</p>
              <p><strong>Dirección:</strong> {cliente.dDireccion}</p>
              <p><strong>Teléfono:</strong> {cliente.dTelefono}</p>
              <p><strong>Correo:</strong> {cliente.dCorreo}</p>
              <button onClick={() => handleEditCliente(cliente)}>Editar</button>
              <button onClick={() => handleDeleteCliente(cliente._id)}>Eliminar</button>
            </li>
          ))
        ) : (
          <li>No hay clientes disponibles</li>
        )}
      </ul>

      <h2>{editingCliente ? 'Actualizar Cliente' : 'Agregar Cliente'}</h2>
      <form onSubmit={(e) => { e.preventDefault(); editingCliente ? handleUpdateCliente() : handleCreateCliente(); }}>
        <input
          type="text"
          name="dDocumento"
          placeholder="Documento"
          value={formData.dDocumento}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="dNombre"
          placeholder="Nombre"
          value={formData.dNombre}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="dDireccion"
          placeholder="Dirección"
          value={formData.dDireccion}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="dTelefono"
          placeholder="Teléfono"
          value={formData.dTelefono}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="dCorreo"
          placeholder="Correo"
          value={formData.dCorreo}
          onChange={handleInputChange}
        />
        <button type="submit">{editingCliente ? 'Actualizar Cliente' : 'Agregar Cliente'}</button>
      </form>
    </div>
  );
};

export default ClientesPage;
