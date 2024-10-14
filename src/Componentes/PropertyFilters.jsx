import React, { useState } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const PropertyFilters = ({ onFilterChange }) => {
  const [zona, setZona] = useState('');
  const [ambientes, setAmbientes] = useState('');
  const [banos, setBanos] = useState('');
  const [dormitorios, setDormitorios] = useState('');
  const [cochera, setCochera] = useState(false);
  const [aceptaMascotas, setAceptaMascotas] = useState(false);
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [moneda, setMoneda] = useState('USD'); // Default value for currency
  const [pileta, setPileta] = useState(false);
  const [parrilla, setParrilla] = useState(false);
  const [gimnasio, setGimnasio] = useState(false);
  const [laundry, setLaundry] = useState(false);
  const [ascensor, setAscensor] = useState(false);

  const handleFilterChange = () => {
    onFilterChange({
      zona,
      ambientes: Number(ambientes),
      banos: Number(banos),
      dormitorios: Number(dormitorios),
      cochera,
      aceptaMascotas,
      precioMin: precioMin ? Number(precioMin) : null,
      precioMax: precioMax ? Number(precioMax) : null,
      moneda,
      pileta,
      parrilla,
      gimnasio,
      laundry,
      ascensor
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <h3>Encontrá tu Propiedad</h3>
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
        label="Dormitorios"
        type="number"
        value={dormitorios}
        onChange={(e) => setDormitorios(e.target.value)}
      />
      <TextField
        label="Baños"
        type="number"
        value={banos}
        onChange={(e) => setBanos(e.target.value)}
      />
    <h3>Precio</h3>
      <TextField
        label="Precio Mínimo"
        type="number"
        value={precioMin}
        onChange={(e) => setPrecioMin(e.target.value)}
      />
      <TextField
        label="Precio Máximo"
        type="number"
        value={precioMax}
        onChange={(e) => setPrecioMax(e.target.value)}
      />

      {/* Select for Currency */}
      <FormControl fullWidth>
        <InputLabel id="moneda-label">Moneda</InputLabel>
        <Select
          labelId="moneda-label"
          value={moneda}
          onChange={(e) => setMoneda(e.target.value)}
        >
          <MenuItem value="USD">USD</MenuItem>
          <MenuItem value="ARS">Pesos Argentinos</MenuItem>
        </Select>
      </FormControl>

      {/* Amenities */}
      <h3>Comodidades</h3>
      <FormControlLabel
        control={<Checkbox checked={cochera} onChange={(e) => setCochera(e.target.checked)} />}
        label="Cochera"
      />
      <FormControlLabel
        control={<Checkbox checked={aceptaMascotas} onChange={(e) => setAceptaMascotas(e.target.checked)} />}
        label="Acepta Mascotas"
      />
      <FormControlLabel
        control={<Checkbox checked={pileta} onChange={(e) => setPileta(e.target.checked)} />}
        label="Pileta"
      />
      <FormControlLabel
        control={<Checkbox checked={parrilla} onChange={(e) => setParrilla(e.target.checked)} />}
        label="Parrilla"
      />
      <FormControlLabel
        control={<Checkbox checked={gimnasio} onChange={(e) => setGimnasio(e.target.checked)} />}
        label="Gimnasio"
      />
      <FormControlLabel
        control={<Checkbox checked={laundry} onChange={(e) => setLaundry(e.target.checked)} />}
        label="Laundry"
      />
      <FormControlLabel
        control={<Checkbox checked={ascensor} onChange={(e) => setAscensor(e.target.checked)} />}
        label="Ascensor"
      />

      <Button onClick={handleFilterChange} variant="contained" color="primary">Filtrar</Button>
    </div>
  );
};

export default PropertyFilters;