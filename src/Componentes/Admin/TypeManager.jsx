import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdDelete } from 'react-icons/md'; // Importar el ícono de eliminación

const TypeManager = () => {
  const [typeData, setTypeData] = useState({ name: '' });
  const [types, setTypes] = useState([]);

  const fetchTypes = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/types');
      setTypes(response.data);
    } catch (error) {
      console.error('Error al cargar los tipos:', error);
    }
  };

  const handleChange = (e) => {
    setTypeData({ ...typeData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/types', typeData);
      fetchTypes(); // Actualiza la lista después de agregar un nuevo tipo
      setTypeData({ name: '' }); // Limpiar el formulario
    } catch (error) {
      console.error('Error al agregar el tipo:', error);
    }
  };

  const handleDeleteType = async (id) => {
    try {
        await axios.delete(`http://localhost:4000/api/types/${id}`);
        setTypes(types.filter((type) => type._id !== id)); // Actualiza el estado eliminando el tipo
    } catch (error) {
        console.error('Error al eliminar el tipo:', error);
    }
};


  useEffect(() => {
    fetchTypes();
  }, []);

  return (
    <div>
      <h2>Gestión de Tipos de Propiedades</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={typeData.name}
          onChange={handleChange}
          placeholder="Nombre del Tipo"
          required
        />
        <button type="submit">Agregar Tipo</button>
      </form>
      <ul>
        {types.map((type) => (
          <li key={type._id}>
            {type.nombre}
            {/* Ícono de eliminación */}
            <MdDelete
              style={{ cursor: 'pointer', marginLeft: '10px' }}
              onClick={() => handleDeleteType(type._id)} // Llamada a la función de eliminación
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TypeManager;