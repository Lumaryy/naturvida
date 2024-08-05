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
    <div style={styles.container}>
      <h1 style={styles.title}>Productos</h1>
      {error && <p style={styles.error}>Error: {error}</p>}

      <h2 style={styles.subTitle}>{editingProduct ? 'Editar Producto' : 'Agregar Producto'}</h2>
      <div style={styles.form}>
        <input
          type="text"
          name="proCodigo"
          placeholder="Código"
          value={editingProduct ? editingProduct.proCodigo : newProduct.proCodigo}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="text"
          name="proDescripcion"
          placeholder="Descripción"
          value={editingProduct ? editingProduct.proDescripcion : newProduct.proDescripcion}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="number"
          name="proValor"
          placeholder="Valor"
          value={editingProduct ? editingProduct.proValor : newProduct.proValor}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="number"
          name="proCantidad"
          placeholder="Cantidad"
          value={editingProduct ? editingProduct.proCantidad : newProduct.proCantidad}
          onChange={handleChange}
          style={styles.input}
        />
        {editingProduct ? (
          <button
            onClick={handleEditProduct}
            style={{ ...styles.button, backgroundColor: 'blue' }}
          >
            Actualizar Producto
          </button>
        ) : (
          <button
            onClick={handleAddProduct}
            style={{ ...styles.button, backgroundColor: 'green' }}
          >
            Agregar Producto
          </button>
        )}
      </div>

      <h2 style={styles.subTitle}>Lista de Productos</h2>
      <ul style={styles.list}>
        {productos.length > 0 ? (
          productos.map(producto => (
            producto && producto._id ? (
              <li key={producto._id} style={styles.card}>
                <strong>Código:</strong> {producto.proCodigo || 'N/A'}<br />
                <strong>Descripción:</strong> {producto.proDescripcion || 'N/A'}<br />
                <strong>Valor:</strong> {producto.proValor || 'N/A'}<br />
                <strong>Cantidad:</strong> {producto.proCantidad || 'N/A'}<br />
                <button
                  onClick={() => setEditingProduct(producto)}
                  style={{ ...styles.button, backgroundColor: 'blue' }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteProduct(producto._id)}
                  style={{ ...styles.button, backgroundColor: 'red' }}
                >
                  Eliminar
                </button>
              </li>
            ) : (
              <li key="no-product" style={styles.card}>
                Producto inválido
              </li>
            )
          ))
        ) : (
          <li style={styles.card}>No hay productos disponibles</li>
        )}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '2em',
    marginBottom: '20px',
    color: '#333',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
  subTitle: {
    fontSize: '1.5em',
    marginBottom: '10px',
    color: '#333',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1em',
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '1em',
    cursor: 'pointer',
    marginTop: '10px',
  },
  list: {
    listStyleType: 'none',
    padding: '0',
  },
  card: {
    backgroundColor: '#fff',
    padding: '15px',
    marginBottom: '15px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease',
  },
  cardHover: {
    transform: 'scale(1.05)',
  },
};

export default ProductosPage;
