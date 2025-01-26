import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdDelete } from 'react-icons/md';
import { Box, Button, TextField, List, ListItem, ListItemText, IconButton, Snackbar, Alert, Typography } from '@mui/material';

const CityManager = () => {
    const [cities, setCities] = useState([]);
    const [newCity, setNewCity] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/cities');
                setCities(response.data);
            } catch (error) {
                console.error('Error al cargar los barrios:', error);
            }
        };

        fetchCities();
    }, []);

    const handleAddCity = async () => {
        if (!newCity.trim()) {
            setSnackbar({ open: true, message: 'El nombre del barrio no puede estar vacío.', severity: 'warning' });
            return;
        }
        try {
            const response = await axios.post('http://localhost:4000/api/cities', { name: newCity });
            setCities([...cities, response.data]);
            setNewCity(''); // Limpiar el input
            setSnackbar({ open: true, message: 'Barrio agregada exitosamente.', severity: 'success' });
        } catch (error) {
            console.error('Error al agregar la barrio:', error);
            setSnackbar({ open: true, message: 'Error al agregar el barrio.', severity: 'error' });
        }
    };

    const handleDeleteCity = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/api/cities/${id}`);
            setCities(cities.filter(city => city._id !== id)); 
            setSnackbar({ open: true, message: 'Barrio eliminado exitosamente.', severity: 'success' });
        } catch (error) {
            console.error('Error al eliminar el barrio:', error);
            setSnackbar({ open: true, message: 'Error al eliminar el barrio.', severity: 'error' });
        }
    };

    const handleSnackbarClose = () => {
        setSnackbar({ open: false, message: '', severity: '' });
    };

    return (
        <Box sx={{ padding: 4, maxWidth: 800, margin: '0 auto', boxShadow: 3, borderRadius: 2, backgroundColor: '#f9f9f9' }}>
            <Typography variant="h4" align="center" gutterBottom>
                Gestionar Barrios
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
                <TextField
                    label="Nuevo Barrio"
                    variant="outlined"
                    fullWidth
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleAddCity}>
                    Agregar
                </Button>
            </Box>
            <List sx={{ backgroundColor: '#fff', borderRadius: 1, boxShadow: 1 }}>
                {cities.map(city => (
                    <ListItem
                        key={city._id}
                        secondaryAction={
                            <IconButton edge="end" color="error" onClick={() => handleDeleteCity(city._id)}>
                                <MdDelete />
                            </IconButton>
                        }
                    >
                        <ListItemText primary={city.name} />
                    </ListItem>
                ))}
            </List>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CityManager;