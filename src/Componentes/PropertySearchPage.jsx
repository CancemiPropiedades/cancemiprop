import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropertyCard from './PropertyCard';
import PropertyFilters from './PropertyFilters';
import '../Css/PropertySearchPage.css';

const PropertySearchPage = ({ filterType }) => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/propiedades');
        setProperties(response.data);
        setFilteredProperties(response.data); // Mostrar todas inicialmente
      } catch (error) {
        console.error('Error al obtener las propiedades:', error);
      }
    };

    fetchProperties();
  }, []);

  // Filtro inicial por estado (Venta, Alquiler, Emprendimiento)
  useEffect(() => {
    if (filterType) {
      const filtered = properties.filter(property => property.estado === filterType);
      setFilteredProperties(filtered);
    }
  }, [filterType, properties]);

  // Función que maneja filtros adicionales (ubicación, precio, etc.)
  const handleFilterChange = (filters) => {
    let updatedProperties = properties.filter(property => property.estado === filterType); // Asegurar el estado inicial

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
    if (filters.precioMin) {
      updatedProperties = updatedProperties.filter(property => property.precio >= filters.precioMin);
    }
    if (filters.precioMax) {
      updatedProperties = updatedProperties.filter(property => property.precio <= filters.precioMax);
    }
    if (filters.moneda) {
      updatedProperties = updatedProperties.filter(property => property.moneda === filters.moneda);
    }
    if (filters.cochera) {
      updatedProperties = updatedProperties.filter(property => property.caracteristicas.cochera);
    }

    setFilteredProperties(updatedProperties);
  };

  return (
    <div className="property-search-container">
      <div className="filters-container">
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