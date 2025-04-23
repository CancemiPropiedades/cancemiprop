import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import CarouselDetails from '../Componentes/CarouselDetails';
import { FaCar, FaPaw, FaSwimmer, FaDumbbell, FaRegSun, FaBuilding, FaWifi, FaHotTub, FaFire, FaTv, FaBath, FaBed, FaLightbulb, FaWater, FaSewage, FaGas, FaRoad, FaPhone, FaSatellite } from 'react-icons/fa';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import { GiBarbecue, GiStreetLight } from 'react-icons/gi'; // parrilla, alumbrado
import { FaToilet, FaGasPump } from 'react-icons/fa';
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
        const response = await axios.get(`https://cancemi-inmobiliaria-backend-admin.vercel.app/api/propiedades/${id}`);
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

  console.log('Caracteristicas de la propiedad:', property.caracteristicas);

  return (
    <div className="property-details">
      <CarouselDetails images={property.fotos} />
      <div className="property-info">
        <p className='ubicacion'><strong>Ubicación: </strong> {property.ubicacion || 'Dirección no disponible'}</p>
        <p><strong>Precio: </strong> ${property.precio} {property.moneda}</p>
        <p><strong>Descripción: </strong> {property.descripcion}</p>
        <p><strong>Ciudad:</strong> {property.ciudad?.name || 'Ciudad no disponible'}</p>

        <div className="extra-features-grid">
          {property.caracteristicas.metrosCuadrados && <div className="extra-feature"><FaRegSun /><span>Metros Cuadrados: {property.caracteristicas.metrosCuadrados}</span></div>}
          {property.caracteristicas.ambientes && <div className="extra-feature"><FaBuilding /><span>Ambientes: {property.caracteristicas.ambientes}</span></div>}
          {property.caracteristicas.banos && <div className="extra-feature"><FaBath /><span>Baños: {property.caracteristicas.banos}</span></div>}
          {property.caracteristicas.dormitorios && <div className="extra-feature"><FaBed /><span>Dormitorios: {property.caracteristicas.dormitorios}</span></div>}

          {property.caracteristicas.cochera && <div className="extra-feature"><FaCar /><span>Cochera</span></div>}
          {property.caracteristicas.aceptaMascotas && <div className="extra-feature"><FaPaw /><span>Acepta Mascotas</span></div>}
          {property.caracteristicas.pileta && <div className="extra-feature"><FaSwimmer /><span>Pileta</span></div>}
          {property.caracteristicas.gimnasio && <div className="extra-feature"><FaDumbbell /><span>Gimnasio</span></div>}
          {property.caracteristicas.laundry && <div className="extra-feature"><FaRegSun /><span>Laundry</span></div>}
          {property.caracteristicas.ascensor && <div className="extra-feature"><FaBuilding /><span>Ascensor</span></div>}

          {property.caracteristicas.agua && <div className="extra-feature"><FaWater /><span>Agua</span></div>}
          {property.caracteristicas.cloaca && <div className="extra-feature"><FaToilet /><span>Cloaca</span></div>}
          {property.caracteristicas.gas && <div className="extra-feature"><FaGasPump /><span>Gas</span></div>}
          {property.caracteristicas.internet && <div className="extra-feature"><FaWifi /><span>Internet</span></div>}
          {property.caracteristicas.electricidad && <div className="extra-feature"><FaLightbulb /><span>Electricidad</span></div>}
          {property.caracteristicas.pavimento && <div className="extra-feature"><FaRoad /><span>Pavimento</span></div>}
          {property.caracteristicas.telefono && <div className="extra-feature"><FaPhone /><span>Teléfono</span></div>}
          {property.caracteristicas.cable && <div className="extra-feature"><FaSatellite /><span>Cable</span></div>}
          {property.caracteristicas.solarium && <div className="extra-feature"><FaHotTub /><span>Solarium</span></div>}
          {property.caracteristicas.sum && <div className="extra-feature"><FaFire /><span>SUM</span></div>}
          {property.caracteristicas.luminoso && <div className="extra-feature"><FaTv /><span>Luminoso</span></div>}
          {property.caracteristicas.potable && <div className="extra-feature"><FaBath /><span>Agua Potable</span></div>}
          {property.caracteristicas.seguridad && <div className="extra-feature"><FaBed /><span>Seguridad 24hs</span></div>}
          {property.caracteristicas.parrilla && <div className="extra-feature"><GiBarbecue /><span>Parrilla</span></div>}
          {property.caracteristicas.alumbrado && <div className="extra-feature"><GiStreetLight /><span>Alumbrado</span></div>}
        </div>

        <Button
          variant="contained"
          color="success"
          style={{ marginLeft: '10px', padding: '4px 16px' }}
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
          style={{ marginLeft: '10px', padding: '7px 16px' }}
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
    </div>
  );
};

export default PropertyDetails;