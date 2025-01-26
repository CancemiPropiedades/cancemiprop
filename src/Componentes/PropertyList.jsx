import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropertyCard from './PropertyCard'; 
import FormularioBusqueda from './FormularioBusqueda'; 
import '../Css/Card.css';

function PropertyList() {
  const [properties, setProperties] = useState([]);  
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState('');  

  async function fetchProperties() {
    try {
      const propiedades = await axios.get('http://localhost:4000/api/propiedades');
      const availableProperties = propiedades.data.filter(property => property.disponible !== false);
      setProperties(availableProperties); 
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener las propiedades', error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProperties(); 
  }, []);

  return (
    <div className="bodyProperties">
      <FormularioBusqueda setResultados={setProperties} setError={setError} />
      {error && <p className="error-message">{error}</p>} 
      {loading ? (
        <div className="loading">Cargando propiedades...</div> 
      ) : (
        <div className="Container">
          {properties.length > 0 ? (
            properties.map((property) => (
              <PropertyCard key={property._id} property={property} /> 
            ))
          ) : (
            <p>No se encontraron propiedades disponibles.</p> 
          )}
        </div>
      )}
    </div>
  );
}

export default PropertyList;