import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropertyCard from './PropertyCard';
import PropertyFilters from './PropertyFilters';
import '../Css/PropertySearchPage.css';

const PropertySearchPage = ({ filterType }) => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tiposPropiedad, setTiposPropiedad] = useState([]); // Nuevo estado para tipos de propiedad

  // Obtener propiedades
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('https://cancemi-inmobiliaria-backend-admin.vercel.app/api/propiedades');
        const availableProperties = response.data.filter(property => property.disponible !== false);
        setProperties(availableProperties);
        setFilteredProperties(availableProperties);
      } catch (error) {
        console.error('Error al obtener las propiedades:', error);
      }
    };

    const fetchTiposPropiedad = async () => {
      try {
        const response = await axios.get('https://cancemi-inmobiliaria-backend-admin.vercel.app/api/types-propiedad');
        setTiposPropiedad(response.data);
      } catch (error) {
        console.error('Error al obtener los tipos de propiedad:', error);
      }
    };

    Promise.all([fetchProperties(), fetchTiposPropiedad()])
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, []);

  // Filtrar por tipo (alquiler, venta, etc.)
  useEffect(() => {
    if (filterType) {
      const filtered = properties.filter(property => property.estado.toLowerCase() === filterType.toLowerCase());
      setFilteredProperties(filtered);
    }
  }, [filterType, properties]);

  const handleFilterChange = (filters) => {
    let updatedProperties = properties.filter(property => property.estado.toLowerCase() === filterType.toLowerCase());
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
      {loading ? (
        <div className="loading">Cargando propiedades...</div>
      ) : (
        <>
          <div className="filters-container">
            <PropertyFilters onFilterChange={handleFilterChange} />
          </div>
          <div className="properties-container">
            {filteredProperties.length > 0 ? (
              filteredProperties.map(property => (
                <PropertyCard key={property._id} property={property} tiposPropiedad={tiposPropiedad} />
              ))
            ) : (
              <p>No se encontraron propiedades</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PropertySearchPage;