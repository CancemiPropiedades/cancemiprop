import React, {  useState } from 'react';
import PropertyFilters from '../Componentes/PropertyFilters';
import PropertyList from '../Componentes/PropertyList';

const Venta = () => {
    const [filteredProperties, setFilteredProperties] = useState([]);
    
    const handleFilterChange = (filters) => {
        setFilteredProperties(filters);
    };

    return (
        <div>
            <h1>Buscar Ventas</h1>
            <PropertyFilters onFilterChange={handleFilterChange} />
            <PropertyList tipo="Venta" filteredProperties={filteredProperties} />
        </div>
    );
};

export default Venta;