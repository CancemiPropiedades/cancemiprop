import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null); // Estado para las coordenadas de la propiedad

  // Función para obtener las coordenadas de una dirección
  const fetchCoordinates = async (ubicacion) => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
          address: ubicacion,
          key: apiKey,
        },
      });
  
      
      // Comprobar si hay resultados
      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry.location;
        return { lat, lng };
      } else {
        console.error('No se encontraron resultados para la dirección:', ubicacion);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener las coordenadas:', error);
      return null;
    }
  };
  
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/propiedades/${id}`);
        setProperty(response.data);

        // Obtener las coordenadas de la dirección de la propiedad
        const coords = await fetchCoordinates(response.data.ubicacion);
        console.log('Dirección utilizada para geocodificación:', response.data.ubicacion);        
        setLocation(coords); // Establecer las coordenadas en el estado
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar los detalles de la propiedad:', error);
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  if (loading) {
    return <div>Cargando detalles...</div>;
  }

  if (!property) {
    return <div>Propiedad no encontrada</div>;
  }

  const containerStyle = {
    width: '100%',
    height: '400px',
  };

  return (
    <div>
      <h1>{property.titulo}</h1>
      <p>Ubicación: {property.ubicacion}</p>
      <p>Precio: ${property.precio}</p>
      <p>Descripción: {property.descripcion}</p>

      {location ? (
  <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
    <GoogleMap mapContainerStyle={containerStyle} center={location} zoom={15}>
      <Marker
        position={location}
        onClick={() => {
          window.open(`https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`);
        }}
      />
    </GoogleMap>
  </LoadScript>
) : (
  <p>No se pudo cargar el mapa para la dirección proporcionada.</p>
)}
    </div>
  );
};

export default PropertyDetails;