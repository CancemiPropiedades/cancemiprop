import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';

const FormContacto = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        email: '',
        consulta: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/api/email/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('¡Tu consulta fue enviada! Pronto nos pondremos en contacto.');
                setFormData({ nombre: '', apellido: '', telefono: '', email: '', consulta: '' });
            } else {
                alert('Hubo un error al enviar tu consulta. Por favor, inténtalo de nuevo.');
            }
        } catch (error) {
            console.error(error);
            alert('Error al enviar tu consulta.');
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ maxWidth: 500, mx: 'auto', p: 3, boxShadow: 3, borderRadius: 2 }}
        >
            <Typography variant="h5" gutterBottom>
                Consulta
            </Typography>
            <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                margin="normal"
            />
            <TextField
                fullWidth
                label="Apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
                margin="normal"
            />
            <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
                margin="normal"
            />
            <TextField
                fullWidth
                label="Correo Electrónico"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                required
                margin="normal"
            />
            <TextField
                fullWidth
                label="Consulta"
                name="consulta"
                value={formData.consulta}
                onChange={handleChange}
                required
                margin="normal"
                multiline
                rows={4}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
                Enviar Consulta
            </Button>
        </Box>
    );
};

export default FormContacto;