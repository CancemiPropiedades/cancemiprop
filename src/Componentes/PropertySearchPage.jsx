import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropertyCard from './PropertyCard';
import PropertyFilters from './PropertyFilters';
import '../Css/PropertySearchPage.css';

const PropertySearchPage = ({ filterType }) => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);

  const fetchProperties = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/propiedades');
      setProperties(response.data);
      setFilteredProperties(response.data); // Inicialmente muestra todas las propiedades
    } catch (error) {
      console.error('Error al obtener las propiedades:', error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Función que filtra según el tipo de propiedad (venta, alquiler, emprendimiento)
  useEffect(() => {
    let updatedProperties = properties;

    if (filterType === 'venta') {
      updatedProperties = updatedProperties.filter(property => property.estado === 'Venta');
    } else if (filterType === 'alquiler') {
      updatedProperties = updatedProperties.filter(property => property.estado === 'Alquiler');
    } else if (filterType === 'emprendimiento') {
      updatedProperties = updatedProperties.filter(property => property.tipo === 'Emprendimiento');
    }

    setFilteredProperties(updatedProperties);
  }, [filterType, properties]);

  // Función que maneja el filtrado según los filtros adicionales
  const handleFilterChange = (filters) => {
    let updatedProperties = properties;

    if (filters.zona) {
      updatedProperties = updatedProperties.filter(property => 
        property.ubicacion.toLowerCase().includes(filters.zona.toLowerCase())
      );
    }
    if (filters.ambientes) {
      updatedProperties = updatedProperties.filter(property => 
        property.caracteristicas.ambientes === filters.ambientes
      );
    }
    if (filters.dormitorios) {
      updatedProperties = updatedProperties.filter(property => 
        property.caracteristicas.dormitorios === filters.dormitorios
      );
    }
    if (filters.banos) {
      updatedProperties = updatedProperties.filter(property => 
        property.caracteristicas.banos === filters.banos
      );
    }
    if (filters.precioMin !== null) {
      updatedProperties = updatedProperties.filter(property => 
        property.precio >= filters.precioMin
      );
    }
    if (filters.precioMax !== null) {
      updatedProperties = updatedProperties.filter(property => 
        property.precio <= filters.precioMax
      );
    }
    if (filters.moneda) {
      updatedProperties = updatedProperties.filter(property => 
        property.moneda === filters.moneda
      );
    }
    if (filters.cochera) {
      updatedProperties = updatedProperties.filter(property => 
        property.caracteristicas.cochera === true
      );
    }
    if (filters.aceptaMascotas) {
      updatedProperties = updatedProperties.filter(property => 
        property.caracteristicas.aceptaMascotas === true
      );
    }
    if (filters.pileta) {
      updatedProperties = updatedProperties.filter(property => 
        property.caracteristicas.pileta === true
      );
    }
    if (filters.parrilla) {
      updatedProperties = updatedProperties.filter(property => 
        property.caracteristicas.parrilla === true
      );
    }
    if (filters.gimnasio) {
      updatedProperties = updatedProperties.filter(property => 
        property.caracteristicas.gimnasio === true
      );
    }
    if (filters.laundry) {
      updatedProperties = updatedProperties.filter(property => 
        property.caracteristicas.laundry === true
      );
    }
    if (filters.ascensor) {
      updatedProperties = updatedProperties.filter(property => 
        property.caracteristicas.ascensor === true
      );
    }

    setFilteredProperties(updatedProperties);
  };

  return (
    <div className="property-search-container">
      <div className="filters-container">
        {/* Pasamos la función handleFilterChange a PropertyFilters */}
        <PropertyFilters onFilterChange={handleFilterChange} />
      </div>
      <div className="properties-container">
        {filteredProperties.length > 0 ? (
          filteredProperties.map(property => (
            <PropertyCard key={property._id} property={property} />
          ))
        ) : (
          <p>No se encontraron propiedades</p>
        )}
      </div>
    </div>
  );
};

export default PropertySearchPage;