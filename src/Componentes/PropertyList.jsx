import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropertyCard from './PropertyCard'; // Importa el componente `Card`
import '../Css/Card.css';

function PropertyList() {
  const [properties, setProperties] = useState([]);  // Aquí almacenaremos las propiedades obtenidas desde la DB
  const [loading, setLoading] = useState(true); // Para mostrar el estado de carga

  // Función para obtener las propiedades desde la base de datos
  async function fetchProperties() {
    try {
      const propiedades = await axios.get('http://localhost:4000/api/propiedades');
      console.log('Propiedades obtenidas:', propiedades.data); // Verificar la respuesta aquí
      setProperties(propiedades.data); 
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener las propiedades', error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProperties(); // Llamamos a la función para obtener los datos cuando el componente se monta
  }, []);

  return (
    <div className="bodyProperties">
      {loading ? (
        <div className="loading">Cargando propiedades...</div>  // Muestra un mensaje de carga
      ) : (
        <div className="Container">
          {properties.length > 0 ? (
            properties.map((property) => (
              <PropertyCard key={property._id} property={property} /> // Usa el componente `Card` para mostrar cada propiedad
            ))
          ) : (
            <p>No hay propiedades disponibles.</p> // Si no hay propiedades disponibles
          )}
        </div>
      )}
    </div>
  );
}

export default PropertyList;