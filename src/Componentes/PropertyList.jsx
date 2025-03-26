import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropertyCard from './PropertyCard';
import FormularioBusqueda from './FormularioBusqueda';
import '../Css/Card.css';

function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [loadingTipos, setLoadingTipos] = useState(true);
  const [error, setError] = useState('');
  const [tiposPropiedad, setTiposPropiedad] = useState(null);

  async function fetchProperties() {
    try {
      const propiedades = await axios.get('http://localhost:4001/api/propiedades');
      const availableProperties = propiedades.data.filter(
        (property) => property.disponible !== false
      );
      setProperties(availableProperties);
    } catch (error) {
      console.error('Error al obtener las propiedades', error);
      setError('Error al obtener propiedades');
    } finally {
      setLoadingProperties(false);
    }
  }

  async function fetchTiposPropiedad() {
    try {
      const tipos = await axios.get('http://localhost:4001/api/types-propiedad');
      setTiposPropiedad(tipos.data);
    } catch (error) {
      console.error('Error al obtener los tipos de propiedad', error);
      setError('Error al obtener tipos de propiedad');
    } finally {
      setLoadingTipos(false);
    }
  }

  useEffect(() => {
    fetchProperties();
    fetchTiposPropiedad();
  }, []);

  if (loadingProperties || loadingTipos) {
    return <div className="loading">Cargando propiedades...</div>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!tiposPropiedad) {
    return <div className="loading">Cargando tipos de propiedad...</div>;
  }

  return (
    <div className="bodyProperties">
      <FormularioBusqueda setResultados={setProperties} setError={setError} />
      <div className="Container">
        {properties.length > 0 ? (
          properties.map((property) => (
            <PropertyCard property={property} tiposPropiedad={tiposPropiedad} key={property._id} />
          ))
        ) : (
          <p>No se encontraron propiedades disponibles.</p>
        )}
      </div>
    </div>
  );
}

export default PropertyList;