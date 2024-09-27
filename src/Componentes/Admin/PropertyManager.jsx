import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PropertyManager = ({ onPropertyAdded }) => {
  const [propertyData, setPropertyData] = useState({
    titulo: '',
    ubicacion: '', // Dirección completa
    precio: '',
    tipo: '',
    ciudad: '',
    estado: 'Alquiler',
    descripcion: '',
    fotos: [],
    caracteristicas: {
      ambientes: 0,
      banos: 0,
      cochera: false,
      aceptaMascotas: false,
    },
    latitud: '', // Para guardar latitud
    longitud: '', // Para guardar longitud
  });

  const [newPhoto, setNewPhoto] = useState(''); // Para la nueva URL de foto
  const [cities, setCities] = useState([]);
  const [newCity, setNewCity] = useState('');

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/cities');
        setCities(response.data);
      } catch (error) {
        console.error('Error al cargar las ciudades:', error);
      }
    };

    fetchCities();
  }, []);

  const handleChange = (e) => {
    setPropertyData({
      ...propertyData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCaracteristicasChange = (e) => {
    setPropertyData({
      ...propertyData,
      caracteristicas: {
        ...propertyData.caracteristicas,
        [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
      },
    });
  };

  const handleNewPhotoChange = (e) => {
    setNewPhoto(e.target.value);
  };

  const addPhoto = () => {
    if (newPhoto) {
      setPropertyData((prevData) => ({
        ...prevData,
        fotos: [...prevData.fotos, newPhoto],
      }));
      setNewPhoto('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let cityId = propertyData.ciudad;

    // Si hay una nueva ciudad que agregar
    if (newCity) {
      try {
        const response = await axios.post('http://localhost:4000/api/cities', { name: newCity });
        cityId = response.data._id;
      } catch (error) {
        console.error('Error al agregar la nueva ciudad:', error);
        return;
      }
    }

    try {
      // Obtener las coordenadas a partir de la dirección (ubicación) usando Google Maps Geocoding API
      const geocodeResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
          address: propertyData.ubicacion,
          key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        },
      });

      const location = geocodeResponse.data.results[0].geometry.location;

      // Enviar la propiedad con las coordenadas
      const response = await axios.post('http://localhost:4000/api/propiedades', {
        ...propertyData,
        ciudad: cityId,
        latitud: location.lat,  // Guardar latitud obtenida
        longitud: location.lng, // Guardar longitud obtenida
      });

      console.log('Propiedad agregada:', response.data);
      onPropertyAdded(response.data);
      setPropertyData({
        titulo: '',
        ubicacion: '',
        precio: '',
        tipo: '',
        ciudad: '',
        estado: 'Alquiler',
        descripcion: '',
        fotos: [],
        caracteristicas: {
          ambientes: 0,
          banos: 0,
          cochera: false,
          aceptaMascotas: false,
        },
        latitud: '',
        longitud: '',
      });
      setNewCity('');
    } catch (error) {
      console.error('Error al agregar la propiedad:', error);
    }
  };

  return (
    <div>
      <h2>Agregar Propiedad</h2>
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
          placeholder="Dirección completa"
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
        <div>
          <input
            type="text"
            value={newPhoto}
            onChange={handleNewPhotoChange}
            placeholder="URL de la foto"
          />
          <button type="button" onClick={addPhoto}>Agregar Foto</button>
        </div>
        <ul>
          {propertyData.fotos.map((foto, index) => (
            <li key={index}>{foto}</li>
          ))}
        </ul>
        <div>
          <label>Ambientes</label>
          <input
            type="number"
            name="ambientes"
            value={propertyData.caracteristicas.ambientes}
            onChange={handleCaracteristicasChange}
          />
        </div>
        <div>
          <label>Baños</label>
          <input
            type="number"
            name="banos"
            value={propertyData.caracteristicas.banos}
            onChange={handleCaracteristicasChange}
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="cochera"
              checked={propertyData.caracteristicas.cochera}
              onChange={handleCaracteristicasChange}
            />
            Cochera
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="aceptaMascotas"
              checked={propertyData.caracteristicas.aceptaMascotas}
              onChange={handleCaracteristicasChange}
            />
            Acepta Mascotas
          </label>
        </div>
        <select
          name="ciudad"
          value={propertyData.ciudad}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona una ciudad</option>
          {cities.map((city) => (
            <option key={city._id} value={city._id}>{city.name}</option>
          ))}
        </select>
        <select
          name="estado"
          value={propertyData.estado}
          onChange={handleChange}
        >
          <option value="Alquiler">Alquiler</option>
          <option value="Venta">Venta</option>
        </select>
        <button type="submit">Agregar Propiedad</button>
      </form>
    </div>
  );
};

export default PropertyManager;