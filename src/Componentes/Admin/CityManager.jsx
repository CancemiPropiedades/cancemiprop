import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CityManager = () => {
  const [cityData, setCityData] = useState({ name: '' });
  const [cities, setCities] = useState([]);

  const fetchCities = async () => {
    const response = await axios.get('http://localhost:4000/api/cities');
    setCities(response.data);
  };

  const handleChange = (e) => {
    setCityData({ ...cityData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:4000/api/cities', cityData);
    fetchCities(); // Actualiza la lista
  };

  useEffect(() => {
    fetchCities();
  }, []);

  return (
    <div>
      <h2>Gestión de Ciudades</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={cityData.name}
          onChange={handleChange}
          placeholder="Nombre de la Ciudad"
          required
        />
        <button type="submit">Agregar Ciudad</button>
      </form>
      <ul>
        {cities.map((city) => (
          <li key={city._id}>{city.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CityManager;