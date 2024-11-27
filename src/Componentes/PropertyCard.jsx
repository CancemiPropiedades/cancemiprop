import React from 'react';
import { Link as LinkRouter } from 'react-router-dom';
import CarouselCard from './CarouselCard'; // Asegúrate de que esto sea correcto
import { FaCar, FaPaw, FaSwimmer, FaDumbbell } from 'react-icons/fa';
import '../Css/Card.css';

function PropertyCard({ property }) {
  return (
    <div className="card">
      <h6>{property.ubicacion}</h6>
      <CarouselCard images={property.fotos} /> {/* Asegúrate de que 'fotos' es el nombre correcto del campo de imágenes */}
      <div>
        <h4 className="price">{property.titulo}</h4>
        <h4 className="price">${property.precio}</h4>
        <div className="property-summary">
          <div className="property-summary">
            {/* Uso del encadenamiento opcional para evitar errores al acceder a propiedades de 'caracteristicas' */}
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