import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    console.log(navigate)

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/usuarios/login', { email, password });
            console.log('Login exitoso:', response.data);

            // Almacenar el token en localStorage
            localStorage.setItem('token', response.data.token);

            const storedToken = localStorage.getItem('token');
            console.log("Token almacenado:", storedToken);

            console.log("Redirigiendo al panel de administración...");

            // Redirigir manualmente con window.location.href
            setTimeout(() => {
                console.log("Intentando redirigir...");
                window.location.href = '/admin'; // Cambio a window.location.href
            }, 500); // Esperar 500 ms antes de redirigir para asegurar que el token se almacene correctamente
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setError('Error al iniciar sesión. Verifica tus credenciales.');
        }
    };

    return (
        <div>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
};

export default LoginPage;