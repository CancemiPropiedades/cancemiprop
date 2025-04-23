import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropertyCard from './PropertyCard';
import '../Css/Card.css';

function PropertyList({ properties }) {
  const [tiposPropiedad, setTiposPropiedad] = useState(null);
  const [loadingTipos, setLoadingTipos] = useState(true);
  const [error, setError] = useState('');

  async function fetchTiposPropiedad() {
    try {
      const tipos = await axios.get('https://cancemi-inmobiliaria-backend-admin.vercel.app/api/types-propiedad');
      setTiposPropiedad(tipos.data);
    } catch (error) {
      console.error('Error al obtener los tipos de propiedad', error);
      setError('Error al obtener tipos de propiedad');
    } finally {
      setLoadingTipos(false);
    }
  }

  useEffect(() => {
    fetchTiposPropiedad();
  }, []);

  if (loadingTipos) return <div className="loading">Cargando tipos de propiedad...</div>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="bodyProperties">
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