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

const TypeManager = () => {
  const [typeData, setTypeData] = useState({ name: '' });
  const [types, setTypes] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchTypes = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/types');
      setTypes(response.data);
    } catch (error) {
      console.error('Error al cargar los tipos:', error);
      setSnackbar({ open: true, message: 'Error al cargar los tipos.', severity: 'error' });
    }
  };

  const handleChange = (e) => {
    setTypeData({ ...typeData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/types', typeData);
      setTypes([...types, response.data]);
      setTypeData({ name: '' });
      setSnackbar({ open: true, message: 'Tipo agregado exitosamente.', severity: 'success' });
    } catch (error) {
      console.error('Error al agregar el tipo:', error);
      setSnackbar({ open: true, message: 'Error al agregar el tipo.', severity: 'error' });
    }
  };

  const handleDeleteType = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/types/${id}`);
      setTypes(types.filter((type) => type._id !== id));
      setSnackbar({ open: true, message: 'Tipo eliminado exitosamente.', severity: 'success' });
    } catch (error) {
      console.error('Error al eliminar el tipo:', error);
      setSnackbar({ open: true, message: 'Error al eliminar el tipo.', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const columns = [
    { field: 'nombre', headerName: 'Nombre del Tipo', flex: 1 },
    {
      field: 'actions',
      headerName: 'Acciones',
      flex: 0.5,
      renderCell: (params) => (
        <IconButton color="error" onClick={() => handleDeleteType(params.row._id)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>
        Gestión de Tipos de Propiedades
      </Typography>
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" mb={2}>
          Agregar Nuevo Tipo
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              label="Nombre del Tipo"
              name="name"
              value={typeData.name}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              required
            />
            <Button type="submit" variant="contained" color="primary">
              Agregar
            </Button>
          </Box>
        </form>
      </Paper>
      <Paper elevation={3} sx={{ height: 400 }}>
        <DataGrid
          rows={types.map((type) => ({ ...type, id: type._id }))}
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

export default TypeManager;