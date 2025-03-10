import React from 'react';
import { Link as LinkRouter } from 'react-router-dom';
import '../Css/Card.css';

function PropertyCard({ property }) {
  const getCurrencySymbol = (currency) => {
    return currency === 'ARS' ? '$' : 'USD';
  };

  // Obtener la primera imagen de la base de datos (si existe)
  const firstImage = property.fotos && property.fotos.length > 0 ? property.fotos[0] : null;

  return (
    <li className="property-card">

      <div className="prop-img" style={{ height: '276px' }}>
        {/* Mostrar solo la primera imagen */}
        {firstImage ? (
          <img src={`http://localhost:4000/${firstImage}`} alt="Property" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div>No hay imágenes disponibles</div>
        )}
        <LinkRouter to={`/Pages/PropertyDetails/${property._id}`}>
          <div className="prop-img-bg animated fadeIn">
            <div className="ver-ficha-box animated fadeInUp">VER DETALLES</div>
          </div>
        </LinkRouter>
      </div>
      {/* Descripción */}
      <div className="prop-desc">
        <div className="prop-desc-tipo-ub">{property.tipo} {property.estado} en {property.ubicacion}</div>
        <div className="prop-desc-dir">{property.direccion}</div>
      </div>

      {/* Precio */}
      <div className="prop-valor-nro">
        <div>{getCurrencySymbol(property.moneda)} {property.precio}</div>
      </div>

    </li >
  );
}

export default PropertyCard;