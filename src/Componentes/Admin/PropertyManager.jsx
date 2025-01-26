import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, IconButton, Snackbar, Alert, Modal, Typography, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditProperty from './EditProperty';
import '../../Css/Admin.css'

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
    };

    const handleToggleAvailability = async (propertyId, currentStatus) => {
        try {
          const newStatus = !currentStatus; // Cambiar entre true y false
      
          // Asegúrate de que 'token' esté disponible
          const response = await axios.put(
            `http://localhost:4000/api/propiedades/${propertyId}/disponibilidad`,  // Asegúrate de que la URL esté correcta
            { disponible: newStatus },
            {
              headers: { Authorization: `Bearer ${token}` } // Asegúrate de enviar el token si es necesario
            }
          );
      
          if (response.status === 200) {
            // Actualizar el estado local con la nueva disponibilidad
            setProperties(prevProperties =>
              prevProperties.map(property =>
                property._id === propertyId ? { ...property, disponible: newStatus } : property
              )
            );
            console.log('Disponibilidad de la propiedad cambiada:', response.data);
          } else {
            console.error('Error al cambiar disponibilidad, status:', response.status);
          }
        } catch (error) {
          console.error('Error al cambiar disponibilidad:', error);
        }
      };      

      const handleSaveChanges = async (updatedProperty) => {
        console.log(updatedProperty); // Verifica qué contiene updatedProperty
    
        if (!selectedProperty || !selectedProperty._id) {
            setSnackbar({ open: true, message: 'Error: propiedad no seleccionada correctamente.', severity: 'error' });
            return;
        }
        
        try {
            await axios.put(`http://localhost:4000/api/propiedades/${selectedProperty._id}`, { ...updatedProperty, propertyStatus: updatedProperty.estado }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProperties(properties.map(prop =>
                prop._id === selectedProperty._id ? { ...updatedProperty, propertyStatus: updatedProperty.estado } : prop
            ));
            setSnackbar({ open: true, message: 'Propiedad actualizada exitosamente.', severity: 'success' });
            closeModal();
        } catch (error) {
            console.error('Error al actualizar la propiedad:', error.response ? error.response.data : error.message);
            setSnackbar({ open: true, message: 'Error al actualizar la propiedad.', severity: 'error' });
        }
    };    

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/api/propiedades/${id}`);
            setProperties(properties.filter(property => property._id !== id));
            setSnackbar({ open: true, message: 'Propiedad eliminada exitosamente.', severity: 'success' });
        } catch (error) {
            setSnackbar({ open: true, message: 'Error al eliminar la propiedad.', severity: 'error' });
        }
    };

    const handleMarkAvailability = async (id, isDisponible) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setSnackbar({ open: true, message: 'Token no encontrado. Por favor, inicia sesión.', severity: 'error' });
            return; // Si no hay token, no se puede continuar con la solicitud
        }
    
        try {
            await axios.patch(
                `http://localhost:4000/api/propiedades/no-disponible/${id}`,
                null,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setProperties(properties.map(property =>
                property._id === id ? { ...property, disponible: !isDisponible } : property
            ));
            setSnackbar({
                open: true,
                message: `Propiedad marcada como ${!isDisponible ? 'disponible' : 'no disponible'}.`,
                severity: 'success',
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error al actualizar disponibilidad.',
                severity: 'error',
            });
        }
    };    

    const columns = [
        { field: 'titulo', minWidth: 90, headerName: 'Título', flex: 0.2 },
        {
            field: 'actions',
            headerName: 'Acciones',
            flex: 0.2,
            minWidth: 110,
            renderCell: (params) => (
                <Box>
                    <IconButton color="primary" onClick={() => handleEdit(params.row)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(params.row._id)}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },
        {
            field: 'disponible',
            headerName: 'Disponibilidad',
            flex: 0.2,
            width: 140,
            renderCell: (params) => (
              <Button
                variant="outlined"
                color={params.value ? 'success' : 'error'}
                onClick={() => handleToggleAvailability(params.id, params.value)}
              >
                {params.value ? 'Disponible' : 'No Disponible'}
              </Button>
            ),
          },
    ];

    return (
        <Box sx={{ padding: 4, maxWidth: 800, margin: '0 auto', boxShadow: 3, borderRadius: 2, backgroundColor: '#f9f9f9' }}>
            <Typography variant="h4" align="center" gutterBottom>
                Gestionar Propiedades
            </Typography>
            <DataGrid
                rows={properties.filter(property => property && property._id).map(property => ({ ...property, id: property._id }))}
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
                <Box sx={{ width: 600, padding: 4, backgroundColor: 'white', borderRadius: 2, boxShadow: 24 }}>
                    {selectedProperty && (
                        <EditProperty
                        property={selectedProperty}
                        onPropertyUpdated={handleSaveChanges}
                        onClose={closeModal}
                        handleToggleAvailability={handleToggleAvailability}
                      />
                       )}
                </Box>
            </Modal>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ open: false, message: '', severity: '' })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbar({ open: false, message: '', severity: '' })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PropertyManager;