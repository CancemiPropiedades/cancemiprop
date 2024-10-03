import React, { useState } from 'react';
import { TextField, Button, Checkbox, FormControlLabel } from '@mui/material';

const PropertyFilters = ({ onFilterChange }) => {
  const [zona, setZona] = useState('');
  const [ambientes, setAmbientes] = useState('');
  const [banos, setBanos] = useState('');
  const [cochera, setCochera] = useState(false);
  const [aceptaMascotas, setAceptaMascotas] = useState(false);
  
  const handleFilterChange = () => {
    onFilterChange({
      zona,
      ambientes: Number(ambientes),
      banos: Number(banos),
      cochera,
      aceptaMascotas,
    });
  };

  return (
    <div>
      <h3>Filtros de Búsqueda</h3>
      <TextField
        label="Zona"
        value={zona}
        onChange={(e) => setZona(e.target.value)}
      />
      <TextField
        label="Ambientes"
        type="number"
        value={ambientes}
        onChange={(e) => setAmbientes(e.target.value)}
      />
      <TextField
        label="Baños"
        type="number"
        value={banos}
        onChange={(e) => setBanos(e.target.value)}
      />
      <FormControlLabel
        control={<Checkbox checked={cochera} onChange={(e) => setCochera(e.target.checked)} />}
        label="Cochera"
      />
      <FormControlLabel
        control={<Checkbox checked={aceptaMascotas} onChange={(e) => setAceptaMascotas(e.target.checked)} />}
        label="Acepta Mascotas"
      />
      <Button onClick={handleFilterChange}>Filtrar</Button>
    </div>
  );
};

export default PropertyFilters;