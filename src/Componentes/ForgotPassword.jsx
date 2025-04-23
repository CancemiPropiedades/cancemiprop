import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://cancemi-inmobiliaria-backend-admin.vercel.app/api/usuarios/forgot-password', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            console.error(error);
            setMessage('Error al procesar la solicitud.');
        }
    };

    return (
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography component="h1" variant="h5">
                ¿Olvidaste tu contraseña?
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Correo Electrónico"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Enviar Solicitud
                </Button>
                {message && <Typography color="textSecondary">{message}</Typography>}
            </Box>
        </Box>
    );
};

export default ForgotPassword;