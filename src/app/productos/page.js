"use client";

import { useState, useEffect } from 'react';

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [newProduct, setNewProduct] = useState({
    proCodigo: '',
    proDescripcion: '',
    proValor: '',
    proCantidad: '',
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login'; // Redirige si no hay token
        return;
      }

      try {
        const response = await fetch('/api/productos', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setProductos(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProductos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editingProduct) {
      setEditingProduct(prevState => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setNewProduct(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleAddProduct = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login'; // Redirige si no hay token
      return;
    }

    try {
      const response = await fetch('/api/productos/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setProductos(prev => [...prev, data.product]);
      setNewProduct({
        proCodigo: '',
        proDescripcion: '',
        proValor: '',
        proCantidad: '',
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditProduct = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login'; // Redirige si no hay token
      return;
    }

    try {
      const response = await fetch(`/api/productos/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editingProduct),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedProduct = await response.json();
      setProductos(prev => prev.map(p => (p._id === updatedProduct._id ? updatedProduct : p)));
      setEditingProduct(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login'; // Redirige si no hay token
      return;
    }

    try {
      const response = await fetch(`/api/productos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setProductos(prev => prev.filter(p => p._id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Productos</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <h2>{editingProduct ? 'Editar Producto' : 'Agregar Producto'}</h2>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          name="proCodigo"
          placeholder="Código"
          value={editingProduct ? editingProduct.proCodigo : newProduct.proCodigo}
          onChange={handleChange}
          style={{ margin: '5px', padding: '5px' }}
        />
        <input
          type="text"
          name="proDescripcion"
          placeholder="Descripción"
          value={editingProduct ? editingProduct.proDescripcion : newProduct.proDescripcion}
          onChange={handleChange}
          style={{ margin: '5px', padding: '5px' }}
        />
        <input
          type="number"
          name="proValor"
          placeholder="Valor"
          value={editingProduct ? editingProduct.proValor : newProduct.proValor}
          onChange={handleChange}
          style={{ margin: '5px', padding: '5px' }}
        />
        <input
          type="number"
          name="proCantidad"
          placeholder="Cantidad"
          value={editingProduct ? editingProduct.proCantidad : newProduct.proCantidad}
          onChange={handleChange}
          style={{ margin: '5px', padding: '5px' }}
        />
        {editingProduct ? (
          <button
            onClick={handleEditProduct}
            style={{ margin: '5px', padding: '10px', backgroundColor: 'blue', color: 'white' }}
          >
            Actualizar Producto
          </button>
        ) : (
          <button
            onClick={handleAddProduct}
            style={{ margin: '5px', padding: '10px', backgroundColor: 'green', color: 'white' }}
          >
            Agregar Producto
          </button>
        )}
      </div>

      <h2>Lista de Productos</h2>
      <ul style={{ listStyleType: 'none', padding: '0' }}>
        {productos.length > 0 ? (
          productos.map(producto => (
            producto && producto._id ? (
              <li key={producto._id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
                <strong>Código:</strong> {producto.proCodigo || 'N/A'}<br />
                <strong>Descripción:</strong> {producto.proDescripcion || 'N/A'}<br />
                <strong>Valor:</strong> {producto.proValor || 'N/A'}<br />
                <strong>Cantidad:</strong> {producto.proCantidad || 'N/A'}<br />
                <button
                  onClick={() => setEditingProduct(producto)}
                  style={{ margin: '5px', padding: '5px', backgroundColor: 'blue', color: 'white' }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteProduct(producto._id)}
                  style={{ margin: '5px', padding: '5px', backgroundColor: 'red', color: 'white' }}
                >
                  Eliminar
                </button>
              </li>
            ) : (
              <li key="no-product" style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
                Producto inválido
              </li>
            )
          ))
        ) : (
          <li>No hay productos disponibles</li>
        )}
      </ul>
    </div>
  );
};

export default ProductosPage;



