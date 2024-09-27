import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const [propiedades, setPropiedades] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('token');  // Elimina el token del almacenamiento
        navigate('/login');  // Redirige al usuario a la página de login
    };

    // Cargar propiedades
    useEffect(() => {
        const fetchPropiedades = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:4000/api/propiedades', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPropiedades(response.data);
            } catch (error) {
                console.error('Error al obtener propiedades:', error);
                setError('No se pudieron obtener las propiedades');
            }
        };

        fetchPropiedades();
    }, []);

    return (
        <div>
            <h1>Propiedades</h1>
            {error && <p>{error}</p>}
            <ul>
                {propiedades.map((propiedad) => (
                    <li key={propiedad._id}>
                        {propiedad.nombre} - {propiedad.tipo}
                    </li>
                ))}
            </ul>
            <button onClick={handleLogout}>Cerrar Sesión</button> {/* Botón de Cerrar Sesión */}
        </div>
    );
};

export default AdminPage;