import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useLocation } from 'react-router-dom';
import '../Css/Formcontacto.css';

const FormContacto = () => {
    const location = useLocation();
    const property = location.state?.property;
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        email: '',
        consulta: property
            ? `Estoy interesado/a en la propiedad: \nTítulo: ${property.titulo}\nUbicación: ${property.ubicacion}\nPrecio: ${property.precio} ${property.moneda}`
            : '',
    });
    const [openModal, setOpenModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        if (property) {
            setFormData((prevData) => ({
                ...prevData,
                consulta: `Estoy interesado/a en la propiedad: \nTítulo: ${property.titulo}\nUbicación: ${property.ubicacion}\nPrecio: ${property.precio} ${property.moneda}`,
            }));
        }
    }, [property]);

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
                setModalMessage('¡Tu consulta fue enviada! Pronto nos pondremos en contacto.');
                setOpenModal(true);
                setFormData({ nombre: '', apellido: '', telefono: '', email: '', consulta: '' });
            } else {
                setModalMessage('Hubo un error al enviar tu consulta. Por favor, inténtalo de nuevo.');
                setOpenModal(true);
            }
        } catch (error) {
            console.error(error);
            setModalMessage('Error al enviar tu consulta.');
            setOpenModal(true);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ maxWidth: 500, mx: 'auto', p: 3, boxShadow: 3, borderRadius: 2 }}
        >
            <Typography variant="h5" gutterBottom>
                Como Podemos Ayudarte
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
                label="Dejanos tu Consulta"
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

            {/* Modal de confirmación */}
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Mensaje</DialogTitle>
                <DialogContent>
                    <Typography>{modalMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default FormContacto;