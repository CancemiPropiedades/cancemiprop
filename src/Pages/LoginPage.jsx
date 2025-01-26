import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, TextField, Button, Alert } from '@mui/material';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/usuarios/login', { email, password });

            localStorage.setItem('token', response.data.token);

            setTimeout(() => {
                window.location.href = '/admin';
            }, 500);
        } catch (error) {
            setError('Error al iniciar sesión. Verifica tus credenciales.');
        }
    };

    return (
        <Grid container sx={{ height: '100vh' }}>
            {/* Left Section */}
            <Grid
                item
                xs={12}
                md={6}
                sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 4,
                }}
            >
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Bienvenido a Cancemi
                </Typography>
                <Typography variant="h6" sx={{ textAlign: 'center', maxWidth: 400 }}>
                    Gestiona tus propiedades y administra tu negocio de manera eficiente con nuestra plataforma.
                </Typography>
            </Grid>

            <Grid
                item
                xs={12}
                md={6}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 4,
                }}
            >
                <Box
                    component="form"
                    onSubmit={handleLogin}
                    sx={{
                        maxWidth: 400,
                        width: '100%',
                        p: 3,
                        boxShadow: 3,
                        borderRadius: 2,
                        backgroundColor: 'background.paper',
                    }}
                >
                    <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                        Iniciar Sesión
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        margin="normal"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Login
                    </Button>
                </Box>
            </Grid>
        </Grid>
    );
};

export default LoginPage;