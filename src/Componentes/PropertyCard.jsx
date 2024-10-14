import React from 'react';
import { Link as LinkRouter } from 'react-router-dom';
import CarouselCard from './CarouselCard'; // Asegúrate de que esto sea correcto
import '../Css/Card.css';

function PropertyCard({ property }) {
  return (
    <div className="card">
      <h6>{property.ubicacion}</h6>
      <CarouselCard images={property.images} />
      <div>
        <h4 className="price">{property.titulo}</h4>
        <h4 className="price">${property.precio}</h4>
        <div className="iconos">
          {property.caracteristicas.cochera && <span>🚗</span>}
          {property.caracteristicas.aceptaMascotas && <span>🐶</span>}
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