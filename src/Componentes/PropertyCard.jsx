import React from 'react';
import { Link as LinkRouter } from 'react-router-dom';
import CarouselCard from './CarouselCard'; 
import { FaCar, FaPaw, FaSwimmer, FaDumbbell, FaRegSun, FaBuilding } from 'react-icons/fa';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import '../Css/Card.css';

function PropertyCard({ property }) {
  const truncateDescription = (text, length = 100) => {
    if (text.length > length) {
      return text.substring(0, length) + '...';
    }
    return text;
  };

  const getCurrencySymbol = (currency) => {
    return currency === 'ARS' ? '$' : 'USD';
  };

  return (
    <div className="card">
      <h6><LocationOnIcon />{property.ubicacion}</h6>
      <CarouselCard images={property.fotos} /> 
      <div>
        <h4 className="price">
          {getCurrencySymbol(property.moneda)} {property.precio}
        </h4>
        <div className="property-summary">
          {property.caracteristicas?.cochera === true && (
            <div className="extra-feature">
              <FaCar /> <span>Cochera</span>
            </div>
          )}
          {property.caracteristicas?.aceptaMascotas && (
            <div className="extra-feature">
              <FaPaw /> <span>Acepta Mascotas</span>
            </div>
          )}
          {property.caracteristicas?.pileta && (
            <div className="extra-feature">
              <FaSwimmer /> <span>Pileta</span>
            </div>
          )}
          {property.caracteristicas?.gimnasio && (
            <div className="extra-feature">
              <FaDumbbell /> <span>Gimnasio</span>
            </div>
          )}
          {property.caracteristicas?.laundry && (
            <div className="extra-feature">
              <FaRegSun /> <span>Laundry</span>
            </div>
          )}
          {property.caracteristicas?.ascensor && (
            <div className="extra-feature">
              <FaBuilding /> <span>Ascensor</span>
            </div>
          )}
        </div>
        <p className="property-description">
          <strong>Descripción:</strong> {truncateDescription(property.descripcion, 100)}
        </p>
      </div>
      <div className="ContainerDetails">
        <LinkRouter to={'/Pages/PropertyDetails/' + property._id}>
          <div className="buttonCard">VER MÁS</div>
        </LinkRouter>
      </div>
    </div>
  );
}

export default PropertyCard;