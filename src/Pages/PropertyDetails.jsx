import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Para obtener el ID de la propiedad
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const PropertyDetails = () => {
  const { id } = useParams(); // Obtener el ID de la propiedad de la URL
  const [property, setProperty] = useState(null); // Almacenar los detalles de la propiedad
  const [loading, setLoading] = useState(true);

  // Cargar los detalles de la propiedad cuando el componente se monta
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/propiedades/${id}`);
        setProperty(response.data);
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

  // Ubicación obtenida de los detalles de la propiedad (latitud y longitud)
  const location = {
    lat: property.latitud,
    lng: property.longitud,
  };

  return (
    <div>
      <h1>{property.titulo}</h1>
      <p>Ubicación: {property.ubicacion}</p>
      <p>Precio: ${property.precio}</p>
      <p>Descripción: {property.descripcion}</p>

      {/* Mapa de Google con la ubicación de la propiedad */}
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
  <GoogleMap
    mapContainerStyle={containerStyle}
    center={location}
    zoom={15}
  >
    <Marker
      position={location}
      onClick={() => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`);
      }}
    />
  </GoogleMap>
</LoadScript>
    </div>
  );
};

export default PropertyDetails;