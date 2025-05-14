import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import {
    Box,
    Button,
    TextField,
    Typography,
    IconButton,
    Paper,
    Snackbar,
    Alert,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const TypeManager = () => {
    const [newPropertyTypeData, setNewPropertyTypeData] = useState({ nombre: '' });
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [loading, setLoading] = useState(true);
    const [deleteConfirmation, setDeleteConfirmation] = useState({ open: false, id: null });

    const fetchPropertyTypes = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://cancemi-inmobiliaria-backend-admin.vercel.app/api/types-propiedad');
            setPropertyTypes(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al cargar los tipos de propiedad:', error);
            setSnackbar({ open: true, message: 'Error al cargar los tipos de propiedad.', severity: 'error' });
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setNewPropertyTypeData({ ...newPropertyTypeData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://cancemi-inmobiliaria-backend-admin.vercel.app/api/types-propiedad', newPropertyTypeData);
            setPropertyTypes([...propertyTypes, response.data]);
            setNewPropertyTypeData({ nombre: '' });
            setSnackbar({ open: true, message: 'Tipo de propiedad agregado exitosamente.', severity: 'success' });
        } catch (error) {
            console.error('Error al agregar el tipo de propiedad:', error);
            setSnackbar({ open: true, message: 'Error al agregar el tipo de propiedad.', severity: 'error' });
        }
    };

    const handleDeletePropertyType = (id) => {
        setDeleteConfirmation({ open: true, id });
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`https://cancemi-inmobiliaria-backend-admin.vercel.app/api/types-propiedad/${deleteConfirmation.id}`);
            setPropertyTypes(propertyTypes.filter((tipo) => tipo._id !== deleteConfirmation.id));
            setSnackbar({ open: true, message: 'Tipo de propiedad eliminado exitosamente.', severity: 'success' });
        } catch (error) {
            console.error('Error al eliminar el tipo de propiedad:', error);
            setSnackbar({ open: true, message: 'Error al eliminar el tipo de propiedad.', severity: 'error' });
        } finally {
            setDeleteConfirmation({ open: false, id: null });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    useEffect(() => {
        fetchPropertyTypes();
    }, []);

    const columns = [
        { field: 'nombre', headerName: 'Nombre del Tipo de Propiedad', flex: 1 },
        {
            field: 'actions',
            headerName: 'Acciones',
            flex: 0.5,
            renderCell: (params) => (
                <IconButton color="error" onClick={() => handleDeletePropertyType(params.row._id)}>
                    <DeleteIcon />
                </IconButton>
            ),
        },
    ];

    return (
        <Box sx={{ padding: 4, maxWidth: 800, margin: '0 auto', boxShadow: 3, borderRadius: 2, backgroundColor: '#f9f9f9' }}>
            <Typography variant="h6" mb={3}>
                Gestión de Tipos de Propiedades
            </Typography>
            <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
                <form onSubmit={handleSubmit}>
                    <Box display="flex" gap={2} alignItems="center">
                        <TextField
                            label="Nombre del Tipo de Propiedad"
                            name="nombre"
                            value={newPropertyTypeData.nombre}
                            onChange={handleChange}
                            variant="outlined"
                            fullWidth
                            required
                        />
                        <Button type="submit" variant="contained" color="primary" sx={{backgroundColor: '#27337f', padding: '15px 16px'}}>
                            Agregar
                        </Button>
                    </Box>
                </form>
            </Paper>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height={400}>
                    <CircularProgress />
                </Box>
            ) : (
                <Paper elevation={3} sx={{ height: 400 }}>
                    <DataGrid
                        rows={propertyTypes.map((tipo) => ({ ...tipo, id: tipo._id }))}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        disableSelectionOnClick
                    />
                </Paper>
            )}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
            <Dialog open={deleteConfirmation.open} onClose={() => setDeleteConfirmation({ open: false, id: null })}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de que quieres eliminar este tipo de propiedad?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmation({ open: false, id: null })} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={confirmDelete} color="error">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TypeManager;