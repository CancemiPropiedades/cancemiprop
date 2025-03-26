import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import '../Css/FormularioBusqueda.css';

const FormularioBusqueda = ({ setResultados, setError }) => {
  const [ubicacion, setUbicacion] = useState('');
  const [estado, setEstado] = useState('');
  const [ambientes, setAmbientes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ubicacion) {
      setError('Por favor, selecciona una ubicación.');
      return;
    }
    try {
      const params = {
        ubicacion: encodeURIComponent(ubicacion), // Codificar la ubicación
      };

      if (estado) params.estado = estado;
      if (ambientes) params.ambientes = parseInt(ambientes);

      const response = await axios.get('http://localhost:4001/api/propiedades/buscar', {
        params,
      });

      setResultados(response.data);
      setError('');
    } catch (error) {
      console.error(error);
      setError('Hubo un problema al buscar propiedades.');
    }
  };

  return (
    <div className='Container-Form'>
      <div className="formulario-container">
        <h1>Encuentra tu lugar ideal</h1>
        <h3>Descubre los mejores alojamientos que se adapten a tus necesidades</h3>
        <form onSubmit={handleSubmit} className="formulario-busqueda">
          <div className="input-group">
            <TextField
              label="Ubicación"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              fullWidth
            />
          </div>

          <div className="input-group">
            <FormControl fullWidth>
              <InputLabel id="estado-label">Tipo de Operación</InputLabel>
              <Select
                labelId="estado-label"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                fullWidth
              >
                <MenuItem value="">Selecciona un estado</MenuItem>
                <MenuItem value="Venta">Venta</MenuItem>
                <MenuItem value="Alquiler">Alquiler</MenuItem>
                <MenuItem value="Emprendimiento">Emprendimiento</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="input-group">
            <TextField
              label="Ambientes"
              type="number"
              value={ambientes}
              onChange={(e) => setAmbientes(e.target.value)}
              fullWidth
            />
          </div>

          <Button className='button-home' type="submit" variant="contained" color="primary">Buscar</Button>
        </form>
      </div>
    </div>
  );
};

export default FormularioBusqueda;