import React, { useState } from 'react';
import axios from 'axios';

const PropertySearch = ({ tipo }) => {
    const [ciudad, setCiudad] = useState('');
    const [tipoPropiedad, setTipoPropiedad] = useState('');
    const [estado, setEstado] = useState('Alquiler'); // Valor por defecto

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/properties', {
                params: { ciudad, tipo: tipoPropiedad, estado }
                
            });
            console.log(response)
            // Manejar los resultados de la búsqueda (puede redirigir o actualizar el estado)
        } catch (error) {
            console.error('Error al buscar propiedades:', error);
        }
    };

    return (
        <div>
            <select value={ciudad} onChange={(e) => setCiudad(e.target.value)}>
                <option value="">Seleccione Ciudad</option>
                {/* Opciones dinámicas de ciudad */}
            </select>
            <select value={tipoPropiedad} onChange={(e) => setTipoPropiedad(e.target.value)}>
                <option value="">Tipo de Propiedad</option>
                {/* Opciones dinámicas de tipo */}
            </select>
            <div>
                <label>
                    <input
                        type="radio"
                        value="Alquiler"
                        checked={estado === 'Alquiler'}
                        onChange={() => setEstado('Alquiler')}
                    />
                    Alquiler
                </label>
                <label>
                    <input
                        type="radio"
                        value="Venta"
                        checked={estado === 'Venta'}
                        onChange={() => setEstado('Venta')}
                    />
                    Venta
                </label>
            </div>
            <button onClick={handleSearch}>Buscar</button>
        </div>
    );
};

export default PropertySearch;
