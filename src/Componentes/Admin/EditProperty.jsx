import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EditProperty = () => {
  const { id } = useParams(); // Obtenemos el ID de la propiedad a editar
  const [propertyData, setPropertyData] = useState({
    titulo: '',
    ubicacion: '',
    precio: '',
    descripcion: '',
    habilitada: true,
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/propiedades/${id}`);
        setPropertyData(response.data);
      } catch (error) {
        console.error('Error al cargar la propiedad:', error);
      }
    };

    fetchProperty();
  }, [id]);

  const handleChange = (e) => {
    setPropertyData({
      ...propertyData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4000/api/propiedades/${id}`, propertyData);
      alert('Propiedad actualizada con éxito');
    } catch (error) {
      console.error('Error al actualizar la propiedad:', error);
    }
  };

  return (
    <div>
      <h1>Editar Propiedad</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="titulo"
          value={propertyData.titulo}
          onChange={handleChange}
          placeholder="Título"
          required
        />
        <input
          type="text"
          name="ubicacion"
          value={propertyData.ubicacion}
          onChange={handleChange}
          placeholder="Ubicación"
          required
        />
        <input
          type="number"
          name="precio"
          value={propertyData.precio}
          onChange={handleChange}
          placeholder="Precio"
          required
        />
        <textarea
          name="descripcion"
          value={propertyData.descripcion}
          onChange={handleChange}
          placeholder="Descripción"
          required
        />
        <button type="submit">Actualizar Propiedad</button>
      </form>
    </div>
  );
};

export default EditProperty;