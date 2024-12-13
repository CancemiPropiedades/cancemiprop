import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, IconButton, Snackbar, Alert, Modal, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditProperty from './EditProperty';

const PropertyManager = () => {
    const [properties, setProperties] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/propiedades', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProperties(response.data);
            } catch (error) {
                console.error('Error al cargar las propiedades:', error);
            }
        };

        fetchProperties();
    }, [token]);

    const handleEdit = (property) => {
        setSelectedProperty(property);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProperty(null);
    };

    const handleSaveChanges = async (updatedProperty) => {
        try {
            await axios.put(`http://localhost:4000/api/propiedades/${selectedProperty._id}`, updatedProperty, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProperties(properties.map(prop => (prop._id === updatedProperty._id ? updatedProperty : prop)));
            setSnackbar({ open: true, message: 'Propiedad actualizada exitosamente.', severity: 'success' });
            closeModal();
        } catch (error) {
            console.error('Error al guardar los cambios:', error);
            setSnackbar({ open: true, message: 'Error al actualizar la propiedad.', severity: 'error' });
        }
    };

    const handleDisable = async (id, isHabilitada) => {
        try {
            await axios.put(`http://localhost:4000/api/propiedades/${id}`, { habilitada: !isHabilitada }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProperties(properties.map(property =>
                property._id === id ? { ...property, habilitada: !isHabilitada } : property
            ));
            setSnackbar({ open: true, message: `Propiedad ${isHabilitada ? 'deshabilitada' : 'habilitada'}.`, severity: 'success' });
        } catch (error) {
            console.error('Error al deshabilitar/habilitar la propiedad:', error);
            setSnackbar({ open: true, message: 'Error al actualizar la propiedad.', severity: 'error' });
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/api/propiedades/${id}`);
            setProperties(properties.filter(property => property._id !== id));
            setSnackbar({ open: true, message: 'Propiedad eliminada exitosamente.', severity: 'success' });
        } catch (error) {
            console.error('Error al eliminar la propiedad:', error);
            setSnackbar({ open: true, message: 'Error al eliminar la propiedad.', severity: 'error' });
        }
    };

    const handleSnackbarClose = () => {
        setSnackbar({ open: false, message: '', severity: '' });
    };

    const columns = [
        { field: 'titulo', headerName: 'Título', flex: 1 },
        {
            field: 'habilitada',
            headerName: 'Estado',
            flex: 0.5,
            renderCell: (params) => (
                params.value ? 'Habilitada' : 'Deshabilitada'
            )
        },
        {
            field: 'actions',
            headerName: 'Acciones',
            flex: 0.7,
            renderCell: (params) => (
                <Box>
                    <IconButton color="primary" onClick={() => handleEdit(params.row)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        color={params.row.habilitada ? 'default' : 'warning'}
                        onClick={() => handleDisable(params.row._id, params.row.habilitada)}
                    >
                        {params.row.habilitada ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(params.row._id)}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            )
        }
    ];

    return (
        <Box sx={{ padding: 4, maxWidth: 800, margin: '0 auto', boxShadow: 3, borderRadius: 2, backgroundColor: '#f9f9f9' }}>
            <Typography variant="h4" align="center" gutterBottom>
                Gestionar Propiedades
            </Typography>
            <DataGrid
                rows={properties.map(property => ({ ...property, id: property._id }))}
                columns={columns}
                autoHeight
                pageSize={5}
                disableSelectionOnClick
            />
            <Modal
                open={isModalOpen}
                onClose={closeModal}
                aria-labelledby="edit-property-title"
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Box sx={{ width: 500, padding: 4, backgroundColor: 'white', borderRadius: 2, boxShadow: 24 }}>
                    {selectedProperty && (
                        <EditProperty property={selectedProperty} onSave={handleSaveChanges} onClose={closeModal} />
                    )}
                </Box>
            </Modal>
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

export default PropertyManager;