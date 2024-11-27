import React, { useState, useEffect } from 'react';
import { Checkbox, FormControlLabel, Button, TextField, Typography } from '@mui/material';

const EditProperty = ({ property, onSave, onClose }) => {
  const [propertyData, setPropertyData] = useState({
    titulo: '',
    ubicacion: '',
    precio: 0,
    ciudad: '',
    estado: '',
    descripcion: '',
    moneda: '',
    caracteristicas: {
      ambientes: 0,
      banos: 0,
      dormitorios: 0,
      cochera: false,
      aceptaMascotas: false,
      pileta: false,
      parrilla: false,
      gimnasio: false,
      laundry: false,
      ascensor: false,
    },
    fotos: [],
  });

  useEffect(() => {
    if (property) {
      setPropertyData(property);
    }
  }, [property]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPropertyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCaracteristicasChange = (e) => {
    const { name, checked } = e.target;
    setPropertyData((prevData) => ({
      ...prevData,
      caracteristicas: {
        ...prevData.caracteristicas,
        [name]: checked,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(propertyData); // Enviar datos actualizados al componente padre
  };

  return (
    <form className='formEdit' onSubmit={handleSubmit}>
      <Typography variant="h6">Editar Propiedad</Typography>
      <TextField
        label="Título"
        name="titulo"
        value={propertyData.titulo}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Ubicación"
        name="ubicacion"
        value={propertyData.ubicacion}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Precio"
        name="precio"
        type="number"
        value={propertyData.precio}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Ciudad"
        name="ciudad"
        value={propertyData.ciudad}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Estado"
        name="estado"
        value={propertyData.estado}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Descripción"
        name="descripcion"
        value={propertyData.descripcion}
        onChange={handleInputChange}
        multiline
        rows={4}
        fullWidth
        margin="normal"
        required
      />
      <Typography variant="subtitle1">Características</Typography>
      {[
        { label: 'Cochera', name: 'cochera' },
        { label: 'Acepta Mascotas', name: 'aceptaMascotas' },
        { label: 'Pileta', name: 'pileta' },
        { label: 'Parrilla', name: 'parrilla' },
        { label: 'Gimnasio', name: 'gimnasio' },
        { label: 'Laundry', name: 'laundry' },
        { label: 'Ascensor', name: 'ascensor' },
      ].map((feature) => (
        <FormControlLabel
          key={feature.name}
          control={
            <Checkbox
              checked={propertyData.caracteristicas[feature.name]}
              onChange={handleCaracteristicasChange}
              name={feature.name}
            />
          }
          label={feature.label}
        />
      ))}
      <div style={{ marginTop: '20px' }}>
        <Button type="submit" variant="contained" color="primary">
          Guardar Cambios
        </Button>
        <Button
          type="button"
          variant="outlined"
          color="secondary"
          onClick={onClose}
          style={{ marginLeft: '10px' }}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default EditProperty;