import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TypeManager = () => {
  const [typeData, setTypeData] = useState({ name: '' });
  const [types, setTypes] = useState([]);

  const fetchTypes = async () => {
    const response = await axios.get('http://localhost:4000/api/types');
    setTypes(response.data);
  };

  const handleChange = (e) => {
    setTypeData({ ...typeData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:4000/api/types', typeData);
    fetchTypes(); // Actualiza la lista
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
          <li key={type._id}>{type.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default TypeManager;