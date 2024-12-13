import React from 'react';
import { Link as LinkRouter } from 'react-router-dom';
import CarouselCard from './CarouselCard'; 
import { FaCar, FaPaw, FaSwimmer, FaDumbbell } from 'react-icons/fa';
import '../Css/Card.css';

function PropertyCard({ property }) {
  return (
    <div className="card">
      <h6>{property.ubicacion}</h6>
      <CarouselCard images={property.fotos} /> 
      <div>
        <h4 className="price">{property.titulo}</h4>
        <h4 className="price">${property.precio}</h4>
        <div className="property-summary">
          <div className="property-summary">
            {property.caracteristicas?.cochera && <FaCar title="Cochera" />}
            {property.caracteristicas?.aceptaMascotas && <FaPaw title="Acepta Mascotas" />}
            {property.caracteristicas?.pileta && <FaSwimmer title="Pileta" />}
            {property.caracteristicas?.gimnasio && <FaDumbbell title="Gimnasio" />}
          </div>
        </div>
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