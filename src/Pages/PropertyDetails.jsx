import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import CarouselDetails from '../Componentes/CarouselDetails';
import { FaCar, FaPaw, FaSwimmer, FaDumbbell, FaRegSun, FaBuilding } from 'react-icons/fa';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton'; 
import { useNavigate } from 'react-router-dom';
import '../Css/PropertyDetails.css';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const navigate = useNavigate();

  const fetchCoordinates = async (ubicacion) => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
          address: ubicacion,
          key: apiKey,
        },
      });
  
      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const result = response.data.results[0];
        const { lat, lng } = result.geometry.location;
        const formatted_address = result.formatted_address;
        return { lat, lng, formatted_address };
      } else {
        console.warn(`No se encontraron resultados para la dirección: ${ubicacion}`);
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
        const propertyData = response.data;

        setProperty(propertyData);

        const coords = await fetchCoordinates(propertyData.ubicacion);
        setLocation(coords);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar los detalles de la propiedad:', error);
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  if (loading) {
    return (
      <div>
        <Skeleton variant="rectangular" width="100%" height={400} />
        <Skeleton variant="text" width="60%" height={40} style={{ margin: '20px 0' }} />
        <Skeleton variant="text" width="80%" height={30} />
      </div>
    );
  }

  if (!property) {
    return <div>Propiedad no encontrada</div>;
  }

  const containerStyle = {
    width: '80%',
    height: '400px',
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center',   
    margin: '20px auto', 
  };
  

  const parentStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  };
  

  return (
    <div className="property-details">
      <CarouselDetails images={property.fotos} />
      <div className="property-info">
        <h1>{property.titulo}</h1>
        <p><strong>Ubicación: </strong> {property.ubicacion || 'Dirección no disponible'}</p>
        <p><strong>Dirección completa: </strong> {location?.formatted_address || 'Dirección no encontrada'}</p>
        <p><strong>Precio: </strong> ${property.precio} {property.moneda}</p>
        <p><strong>Descripción: </strong> {property.descripcion}</p>
        <p><strong>Ciudad:</strong> {property.ciudad?.name || 'Ciudad no disponible'}</p>
        <p><strong>Ambientes:</strong> {property.caracteristicas?.ambientes || 'No disponible'}</p>
        <p><strong>Baños:</strong> {property.caracteristicas?.banos || 'No disponible'}</p>
        <p><strong>Dormitorios:</strong> {property.caracteristicas?.dormitorios || 'No disponible'}</p>

        {property.caracteristicas?.cochera === true && (
          <div className="extra-feature">
            <FaCar /> <span>Cochera</span>
          </div>
        )}
        {property.caracteristicas.aceptaMascotas && (
          <div className="extra-feature">
            <FaPaw /> <span>Acepta Mascotas</span>
          </div>
        )}
        {property.caracteristicas.pileta && (
          <div className="extra-feature">
            <FaSwimmer /> <span>Pileta</span>
          </div>
        )}
        {property.caracteristicas.gimnasio && (
          <div className="extra-feature">
            <FaDumbbell /> <span>Gimnasio</span>
          </div>
        )}
        {property.caracteristicas.laundry && (
          <div className="extra-feature">
            <FaRegSun /> <span>Laundry</span>
          </div>
        )}
        {property.caracteristicas.ascensor && (
          <div className="extra-feature">
            <FaBuilding /> <span>Ascensor</span>
          </div>
        )}
      </div>
      <Button
        variant="contained"
        color="success"
        startIcon={<WhatsAppIcon />}
        onClick={() => {
          const message = encodeURIComponent(
            `Hola, acabo de ver esta propiedad y quisiera más información: \n\n` +
            `Título: ${property.titulo}\n` +
            `Ubicación: ${property.ubicacion}\n` +
            `Precio: ${property.precio} ${property.moneda}\n` +
            `Estado: ${property.estado}\n` +
            `¡Gracias!`
          );
          const whatsappNumber = "+5491164476465";
          window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
        }}
      >
        Pedir Información
      </Button>
      <Button
        variant="contained"
        color="primary"
        style={{ marginLeft: '10px' }}
        onClick={() => navigate('/contacto', { state: { property } })}
    >
        Quiero que me contacten
    </Button>
      {location ? (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
          <GoogleMap mapContainerStyle={containerStyle} center={location} zoom={15}>
            <Marker position={location} />
          </GoogleMap>
        </LoadScript>
      ) : (
        <p>Ubicación no disponible para mostrar en el mapa.</p>
      )}
    </div>
  );
};

export default PropertyDetails;