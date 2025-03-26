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
      <div className="prop-img" style={{ height: '276px' }}>
        <CarouselCard images={property.fotos} />
      </div>

      <div className="prop-desc">
        <div className="prop-desc-tipo-ub">
          {property.tipo} {property.estado} en {property.ubicacion}
        </div>
        <div className="prop-desc-dir">{property.direccion}</div>
      </div>

      <div className="prop-valor-nro">
        <div>
          {getCurrencySymbol(property.moneda)} {property.precio}
        </div>
        <div className="card-details">
        {tipoPropiedadNombre} en {property.estado} en {property.ubicacion}
      </div>
        <div className="property-features">
          {property.caracteristicas?.ambientes && (
            <div className="feature">
              <FaHome /> {property.caracteristicas.ambientes}
            </div>
          )}
          <div className="feature">
            <FaRulerCombined /> {property.caracteristicas?.metrosCuadrados} m²
          </div>
        </div>
      </div>

      <div className="details-button">
        <LinkRouter to={`/Pages/PropertyDetails/${property._id}`}>
          <div className="prop-img-bg animated fadeIn">
            <div className="ver-ficha-box animated fadeInUp">VER DETALLES</div>
          </div>
        </LinkRouter>
      </div>
    </li>
  );
}

export default PropertyCard;