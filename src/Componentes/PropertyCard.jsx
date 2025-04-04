import React from 'react';
import { Link as LinkRouter } from 'react-router-dom';
import '../Css/Card.css';
import CarouselCard from './CarouselCard';
import { FaHome, FaRulerCombined } from 'react-icons/fa';

function PropertyCard({ property, tiposPropiedad }) {
  const getCurrencySymbol = (currency) => {
    return currency === 'ARS' ? '$' : 'USD';
  };

  const tipoPropiedadObj = tiposPropiedad.find(tipo => tipo._id === property.tipoPropiedad);

  const tipoPropiedadNombre = tiposPropiedad
    ? tiposPropiedad.find(tipo => tipo._id === property.tipoPropiedad)?.nombre || 'Tipo no especificado'
    : 'Cargando tipo de propiedad...';

  return (
    <li className="property-card">
      <div className="prop-img">
        <CarouselCard images={property.fotos} />
        <div className="prop-data">
          <FaRulerCombined /> {property.caracteristicas?.metrosCuadrados} m²
        </div>
        {property.caracteristicas?.ambientes && (
          <div className="prop-data2">
            <FaHome /> {property.caracteristicas.ambientes}
          </div>
        )}
      </div>
      <div className="card-details">
        {tipoPropiedadNombre} en {property.estado} en {property.ubicacion}
      </div>
      <div className="prop-desc-dir">{property.direccion}</div>
      <div className="prop-valor-nro">
        {getCurrencySymbol(property.moneda)} {property.precio}
      </div>
      <div className="details-button">
        <LinkRouter to={`/Pages/PropertyDetails/${property._id}`} className="ver-ficha-box">
          <div className="prop-img-bg animated fadeIn">
            <div className="ver-ficha-box animated fadeInUp">VER DETALLES</div>
          </div>
        </LinkRouter>
      </div>
    </li >
  );
}

export default PropertyCard;