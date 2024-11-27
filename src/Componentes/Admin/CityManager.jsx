import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdDelete } from 'react-icons/md'; // Importar el ícono de eliminación

const CityManager = () => {
    const [cities, setCities] = useState([]);
    const [newCity, setNewCity] = useState('');

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/cities');
                setCities(response.data);
            } catch (error) {
                console.error('Error al cargar las ciudades:', error);
            }
        };

        fetchCities();
    }, []);

    const handleAddCity = async () => {
        if (!newCity) return;
        try {
            const response = await axios.post('http://localhost:4000/api/cities', { name: newCity });
            setCities([...cities, response.data]);
            setNewCity(''); // Limpiar el input
        } catch (error) {
            console.error('Error al agregar la ciudad:', error);
        }
    };

    const handleDeleteCity = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/api/cities/${id}`);
            setCities(cities.filter(city => city._id !== id)); // Remover ciudad eliminada
        } catch (error) {
            console.error('Error al eliminar la ciudad:', error);
        }
    };

    return (
        <div>
            <h2>Gestionar Ciudades</h2>
            <input
                type="text"
                value={newCity}
                onChange={e => setNewCity(e.target.value)}
                placeholder="Nueva Ciudad"
            />
            <button onClick={handleAddCity}>Agregar Ciudad</button>

            <ul>
                {cities.map(city => (
                    <li key={city._id}>
                        {city.name}
                        {/* Ícono de eliminación */}
                        <MdDelete
                            style={{ cursor: 'pointer', marginLeft: '10px' }}
                            onClick={() => handleDeleteCity(city._id)}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CityManager;