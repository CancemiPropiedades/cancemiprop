import React from 'react';
import { Link as LinkRouter } from 'react-router-dom';
import CarouselCard from './CarouselCard';
import '../Css/Card.css';

function Card({ property }) {
  return (
    <div className="card">
      <h6>{property.ubicacion}</h6> {/* Asumiendo que tienes la ubicación en el campo `ubicacion` */}
      <CarouselCard images={property.images} /> {/* Muestra las imágenes si tienes un campo `images` */}
      <div>
        <h4 className='price'>{property.titulo}</h4>
        <h4 className="price">${property.precio}</h4> {/* Muestra el precio */}
        <div className="iconos">
          {/* Puedes ajustar la lógica para mostrar iconos según las características */}
          <h5>ICONOS</h5>
          <h5>ICONOS</h5>
          <h5>ICONOS</h5>
        </div>
        <h4>{property.descripcion}</h4> {/* Muestra la descripción de la propiedad */}
      </div>
      <div className="ContainerDetails">
        <LinkRouter to={'../Pages/PropertyDetails/' + property._id}>
          <div className="buttonCard">VER MÁS</div>
        </LinkRouter>
      </div>
    </div>
  );
}

export default Card;