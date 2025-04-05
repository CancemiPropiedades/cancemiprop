import React, { useState } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, MenuItem, Select, InputLabel, FormControl, Grid, Paper, Box, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/system';

const FilterAccordion = styled(Accordion)(({ theme }) => ({
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '10px',
  marginBottom: '1rem',
  '& .MuiAccordionSummary-root': {
    backgroundColor: '#F5F5F5',
    borderRadius: '10px',
    padding: '1rem',
  },
  '& .MuiAccordionDetails-root': {
    padding: '1rem',
  },
  '& .MuiAccordionSummary-expandIcon': {
    color: '#27337f',
  },
}));

const PropertyFilters = ({ onFilterChange }) => {
  const [zona, setZona] = useState('');
  const [ambientes, setAmbientes] = useState('');
  const [dormitorios, setDormitorios] = useState('');
  const [superficieCubierta, setSuperficieCubierta] = useState('');
  const [superficieTotal, setSuperficieTotal] = useState('');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [moneda, setMoneda] = useState('USD');
  const [caracteristicas, setCaracteristicas] = useState({
  aguaCorriente: false,
  cloaca: false,
  gasNatural: false,
  internet: false,
  electricidad: false,
  pavimento: false,
  telefono: false,
  cable: false,
  gimnasio: false,
  parrilla: false,
  solarium: false,
  sum: false,
  pileta: false,
  luminoso: false,
  aguaPotable: false,
  laundry: false,
  seguridad24hs: false,
  alumbradoPublico: false,
});


  const handleFilterChange = () => {
    onFilterChange({
      zona,
      ambientes: Number(ambientes),
      dormitorios: Number(dormitorios),
      superficieCubierta: Number(superficieCubierta),
      superficieTotal: Number(superficieTotal),
      precioMin: precioMin ? Number(precioMin) : null,
      precioMax: precioMax ? Number(precioMax) : null,
      moneda,
      caracteristicas
    });
  };

  return (
    <Paper elevation={5} sx={{ padding: 3, borderRadius: 3, backgroundColor: '#FFFFFF', boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.1)' }}>
      <Typography variant="h6" align="center" sx={{ marginBottom: 3, color: '#27337f' }}>Filtra tu Propiedad</Typography>
      
      <Grid container spacing={2}>
        {/* Filtro de Precio */}
        <Grid item xs={12}>
          <FilterAccordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="precio-content" id="precio-header">
              <Typography sx={{ fontWeight: 'bold', color: '#27337f' }}>Precios</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Desde"
                    type="number"
                    value={precioMin}
                    onChange={(e) => setPrecioMin(e.target.value)}
                    sx={{ backgroundColor: '#F9F9F9', borderRadius: 2, '& .MuiInputBase-root': { padding: '10px' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Hasta"
                    type="number"
                    value={precioMax}
                    onChange={(e) => setPrecioMax(e.target.value)}
                    sx={{ backgroundColor: '#F9F9F9', borderRadius: 2, '& .MuiInputBase-root': { padding: '10px' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="moneda-label">Moneda</InputLabel>
                    <Select
                      labelId="moneda-label"
                      value={moneda}
                      onChange={(e) => setMoneda(e.target.value)}
                      sx={{ backgroundColor: '#F9F9F9', borderRadius: 2 }}
                    >
                      <MenuItem value="USD">USD</MenuItem>
                      <MenuItem value="ARS">Pesos Argentinos</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </AccordionDetails>
          </FilterAccordion>
        </Grid>

        {/* Filtro de Ubicación */}
        <Grid item xs={12}>
          <FilterAccordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="ubicacion-content" id="ubicacion-header">
              <Typography sx={{ fontWeight: 'bold', color: '#27337f' }}>Ubicación</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                fullWidth
                label="Zona"
                value={zona}
                onChange={(e) => setZona(e.target.value)}
                sx={{ backgroundColor: '#F9F9F9', borderRadius: 2, '& .MuiInputBase-root': { padding: '10px' } }}
              />
            </AccordionDetails>
          </FilterAccordion>
        </Grid>

        {/* Filtro de Ambientes */}
        <Grid item xs={12}>
          <FilterAccordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="ambientes-content" id="ambientes-header">
              <Typography sx={{ fontWeight: 'bold', color: '#27337f' }}>Cantidad de Ambientes</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                fullWidth
                label="Ambientes"
                type="number"
                value={ambientes}
                onChange={(e) => setAmbientes(e.target.value)}
                sx={{ backgroundColor: '#F9F9F9', borderRadius: 2, '& .MuiInputBase-root': { padding: '10px' } }}
              />
            </AccordionDetails>
          </FilterAccordion>
        </Grid>

        {/* Filtro de Características */}
        <Grid item xs={12}>
          <FilterAccordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="caracteristicas-content" id="caracteristicas-header">
              <Typography sx={{ fontWeight: 'bold', color: '#27337f' }}>Características</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'grid', gap: 2 }}>
                {Object.entries(caracteristicas).map(([key, value]) => (
                  <FormControlLabel
                  key={key}
                  control={<Checkbox checked={value} onChange={(e) => setCaracteristicas({ ...caracteristicas, [key]: e.target.checked })} />}
                  label={key
                    .replace(/([A-Z])/g, ' $1')       // separa palabras con espacio
                    .replace(/^./, (str) => str.toUpperCase())} // mayúscula inicial
                />
                
                ))}
              </Box>
            </AccordionDetails>
          </FilterAccordion>
        </Grid>

        <Grid item xs={12}>
          <FilterAccordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="dormitorios-content" id="dormitorios-header">
              <Typography sx={{ fontWeight: 'bold', color: '#27337f' }}>Dormitorios</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                fullWidth
                label="Dormitorios"
                type="number"
                value={dormitorios}
                onChange={(e) => setDormitorios(e.target.value)}
                sx={{ backgroundColor: '#F9F9F9', borderRadius: 2, '& .MuiInputBase-root': { padding: '10px' } }}
              />
            </AccordionDetails>
          </FilterAccordion>
        </Grid>

        {/* Botón para aplicar filtros */}
        <Grid item xs={12}>
          <Button 
            fullWidth 
            variant="contained" 
            onClick={handleFilterChange} 
            sx={{ backgroundColor: '#27337f', color: 'white', padding: 2, borderRadius: 3, '&:hover': { backgroundColor: '#1f2a58' } }}
          >
            Aplicar Filtros
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PropertyFilters;