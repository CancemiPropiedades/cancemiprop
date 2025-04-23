import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Box, Button, Stepper, Step, StepLabel, Typography, MenuItem, Select, FormControl, InputLabel, TextField, FormControlLabel, Checkbox, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const EditProperty = ({ property, onPropertyUpdated, onClose, handleToggleAvailability }) => {
  const { id } = useParams();
  const propertyId = id || property._id;
  console.log('ID de propiedad:', propertyId)

  const steps = ['Datos Principales', 'Características', 'Cargar Imágenes', 'Descripción'];
  const [activeStep, setActiveStep] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);
  const [propertyData, setPropertyData] = useState({
    titulo: '',
    ubicacion: '',
    precio: '',
    tipo: '',
    ciudad: '', // Iniciar como cadena vacía
    estado: '', // Cambié esta línea para que coincida con el estado que estás utilizando
    descripcion: '',
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
    moneda: 'USD',
  });

  const [cities, setCities] = useState([]);
  const [types, setTypes] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cityResponse, typeResponse, propertyResponse] = await Promise.all([
          axios.get('https://cancemi-inmobiliaria-backend-admin.vercel.app/api/cities'),
          axios.get('https://cancemi-inmobiliaria-backend-admin.vercel.app/api/types'),
          propertyId ? axios.get(`https://cancemi-inmobiliaria-backend-admin.vercel.app/api/propiedades/${propertyId}`) : Promise.resolve({ data: {} }),
        ]);
        
        // Verifica la respuesta para ver si "estado" está presente
        console.log('Respuesta de la propiedad:', propertyResponse.data);
  
        setCities(cityResponse.data);
        setTypes(typeResponse.data);
  
        if (propertyId) {
          setPropertyData((prevData) => ({
            ...prevData,
            ...propertyResponse.data,
            estado: propertyResponse.data.estado || 'Venta', // Asegura que haya un valor por defecto
            ciudad: propertyResponse.data.ciudad || cityResponse.data[0]?._id || '',
          }));
          setSelectedImages(propertyResponse.data.fotos || []);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
  
    fetchData();
  }, [propertyId]);  

  useEffect(() => {
    return () => {
      selectedImages.forEach((image) => {
        if (image instanceof File) {
          URL.revokeObjectURL(URL.createObjectURL(image));
        }
      });
    };
  }, [selectedImages]);

  const validateStep = () => {
    if (activeStep === 0) {
      return propertyData.titulo && propertyData.ubicacion && propertyData.precio && propertyData.estado && propertyData.ciudad;
    }
    if (activeStep === 1) {
      return propertyData.caracteristicas.ambientes >= 0 && propertyData.caracteristicas.banos >= 0 && propertyData.caracteristicas.dormitorios >= 0;
    }
    if (activeStep === 2) {
      return selectedImages.length > 0;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prev) => prev + 1);
    } else {
      setSnackbar({
        open: true,
        message: 'Por favor, completa todos los campos obligatorios.',
        severity: 'error',
      });
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleChange = (e) => {
    setPropertyData({
      ...propertyData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCaracteristicasChange = (e) => {
    const { name, type, value, checked } = e.target;
    setPropertyData((prevData) => ({
      ...prevData,
      caracteristicas: {
        ...prevData.caracteristicas,
        [name]: type === 'checkbox' ? checked : value,
      },
    }));
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter((file) => file.type.startsWith('image/') && file.size <= 2 * 1024 * 1024);
    if (validFiles.length !== files.length) {
      setSnackbar({
        open: true,
        message: 'Algunas imágenes no son válidas (tipo incorrecto o demasiado grandes).',
        severity: 'error',
      });
    }
    setSelectedImages((prevImages) => [...prevImages, ...validFiles]);
  };

  const handleImageRemove = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!propertyId) {
      setSnackbar({
        open: true,
        message: 'ID de propiedad no válido',
        severity: 'error',
      });
      return;
    }
  
    // Verifica si estado tiene un valor válido antes de enviar
    if (!propertyData.estado) {
      setSnackbar({
        open: true,
        message: 'El estado de la propiedad es obligatorio',
        severity: 'error',
      });
      return;
    }
  
    const formData = new FormData();
    Object.keys(propertyData).forEach((key) => {
      if (key !== 'caracteristicas') {
        formData.append(key, propertyData[key]);
      }
    });
    formData.append('caracteristicas', JSON.stringify(propertyData.caracteristicas));
    selectedImages.forEach((file) => {
      formData.append('fotos', file);
    });
  
    console.log('Datos enviados:', Object.fromEntries(formData.entries()));
  
    try {
      await axios.put(`https://cancemi-inmobiliaria-backend-admin.vercel.app/api/propiedades/${propertyId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSnackbar({
        open: true,
        message: 'Propiedad actualizada con éxito',
        severity: 'success',
      });
      onPropertyUpdated();
    } catch (error) {
      console.error('Error al actualizar la propiedad:', error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: 'Error al actualizar la propiedad',
        severity: 'error',
      });
    }
  };  
  
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6">Datos Principales</Typography>
            <TextField name="titulo" label="Título" value={propertyData.titulo} onChange={handleChange} fullWidth margin="normal" />
            <TextField name="ubicacion" label="Ubicación" value={propertyData.ubicacion} onChange={handleChange} fullWidth margin="normal" />
            <TextField type="number" name="precio" label="Precio" value={propertyData.precio} onChange={handleChange} fullWidth margin="normal" />
            <FormControl fullWidth margin="normal">
              <InputLabel id="estado-label">Estado</InputLabel>
              <Select labelId="estado-label" name="estado" value={propertyData.estado} onChange={handleChange}>
                <MenuItem value="Venta">Venta</MenuItem>
                <MenuItem value="Alquiler">Alquiler</MenuItem>
                <MenuItem value="Emprendimiento">Emprendimiento</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="ciudad-label">Ciudad</InputLabel>
              <Select labelId="ciudad-label" name="ciudad" value={propertyData.ciudad || ''} onChange={handleChange}>
                {cities.map((city) => (
                  <MenuItem key={city._id} value={city._id}>{city.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6">Características</Typography>
            <TextField type="number" name="ambientes" label="Ambientes" value={propertyData.caracteristicas.ambientes} onChange={handleCaracteristicasChange} fullWidth margin="normal" />
            <TextField type="number" name="banos" label="Baños" value={propertyData.caracteristicas.banos} onChange={handleCaracteristicasChange} fullWidth margin="normal" />
            <TextField type="number" name="dormitorios" label="Dormitorios" value={propertyData.caracteristicas.dormitorios} onChange={handleCaracteristicasChange} fullWidth margin="normal" />
            {['cochera', 'aceptaMascotas', 'pileta', 'parrilla', 'gimnasio', 'laundry', 'ascensor'].map((caracteristica) => (
              <FormControlLabel
                key={caracteristica}
                control={
                  <Checkbox
                    checked={propertyData.caracteristicas[caracteristica]}
                    onChange={handleCaracteristicasChange}
                    name={caracteristica}
                  />
                }
                label={caracteristica.charAt(0).toUpperCase() + caracteristica.slice(1)}
              />
            ))}
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6">Cargar Imágenes</Typography>
            <input type="file" multiple accept="image/*" onChange={handleFileChange} />
            <div>
              {selectedImages.map((image, index) => {
                const imageUrl = image instanceof File ? URL.createObjectURL(image) : image;

                return (
                  <Box key={index} display="inline-block" margin={1}>
                    <img src={imageUrl} alt={`Imagen ${index}`} width={100} height={100} />
                    <Button onClick={() => handleImageRemove(index)}>
                      <DeleteIcon />
                    </Button>
                  </Box>
                );
              })}
            </div>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">Descripción</Typography>
            <TextField
              name="descripcion"
              label="Descripción"
              value={propertyData.descripcion}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              margin="normal"
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 3 }}>
        {renderStepContent()}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button variant="contained" onClick={handleBack} disabled={activeStep === 0}>
          Anterior
        </Button>
        <Button variant="contained" onClick={handleNext} disabled={activeStep === steps.length - 1}>
          Siguiente
        </Button>
      </Box>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        {activeStep === steps.length - 1 && (
          <Button variant="contained" onClick={handleSubmit}>Guardar Cambios</Button>
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditProperty;