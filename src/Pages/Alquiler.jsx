import React, {  useState } from 'react';
import PropertyFilters from '../Componentes/PropertyFilters';
import PropertyList from '../Componentes/PropertyList'; // Aquí muestras las propiedades

const Alquiler = () => {
    const [filteredProperties, setFilteredProperties] = useState([]);
    
    const handleFilterChange = (filters) => {
        // Lógica para filtrar propiedades
        setFilteredProperties(filters);
    };

    return (
        <div>
            <h1>Buscar Alquileres</h1>
            <PropertyFilters onFilterChange={handleFilterChange} />
            <PropertyList tipo="Alquiler" filteredProperties={filteredProperties} />
        </div>
    );
};

export default Alquiler;
