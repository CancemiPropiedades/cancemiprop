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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function PropertyTypeManager({ propertyTypes }) {
  const [propertyTypeData, setPropertyTypeData] = useState({ nombre: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchPropertyTypes = async () => {
    try {
      const response = await axios.get('https://cancemi-inmobiliaria-backend-admin.vercel.app/api/propertyTypes');
      // No necesitas setPropertyTypes aquí, ya que estás usando la prop
      // setPropertyTypes(response.data);
    } catch (error) {
      console.error('Error al cargar los tipos de propiedades:', error);
      setSnackbar({ open: true, message: 'Error al cargar los tipos de propiedades.', severity: 'error' });
    }
  };

  const handleChange = (e) => {
    setPropertyTypeData({ ...propertyTypeData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://cancemi-inmobiliaria-backend-admin.vercel.app/api/propertyTypes', propertyTypeData);
      // Actualiza la prop propertyTypes en el componente padre, no aquí
      // setPropertyTypes([...propertyTypes, response.data]);
      setPropertyTypeData({ nombre: '' });
      setSnackbar({ open: true, message: 'Tipo de propiedad agregado exitosamente.', severity: 'success' });
    } catch (error) {
      console.error('Error al agregar el tipo de propiedad:', error);
      setSnackbar({ open: true, message: 'Error al agregar el tipo de propiedad.', severity: 'error' });
    }
  };

  const handleDeletePropertyType = async (id) => {
    try {
      await axios.delete(`https://cancemi-inmobiliaria-backend-admin.vercel.app/api/propertyTypes/${id}`);
      // Actualiza la prop propertyTypes en el componente padre, no aquí
      // setPropertyTypes(propertyTypes.filter((type) => type._id !== id));
      setSnackbar({ open: true, message: 'Tipo de propiedad eliminado exitosamente.', severity: 'success' });
    } catch (error) {
      console.error('Error al eliminar el tipo de propiedad:', error);
      setSnackbar({ open: true, message: 'Error al eliminar el tipo de propiedad.', severity: 'error' });
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

  if (!Array.isArray(propertyTypes)) {
    return <p>Cargando tipos de propiedad...</p>;
  }

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
              value={propertyTypeData.nombre}
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
      <Paper elevation={3} sx={{ height: 400 }}>
        <DataGrid
          rows={propertyTypes.map((type) => ({ ...type, id: type._id }))}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PropertyTypeManager;