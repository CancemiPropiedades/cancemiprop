import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://cancemi-inmobiliaria-backend-admin.vercel.app/api/usuarios/reset-password', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password, token }),
            });
            const data = await response.json();
            setMessage(data.message);
            if (response.ok) {
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        } catch (error) {
            console.error(error);
            setMessage('Error al restablecer la contraseña.');
        }
    };

    return (
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography component="h1" variant="h5">
                Restablecer Contraseña
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="password"
                    label="Nueva Contraseña"
                    name="password"
                    type="password"
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Restablecer Contraseña
                </Button>
                {message && <Typography color="textSecondary">{message}</Typography>}
            </Box>
        </Box>
    );
};

export default ResetPassword;