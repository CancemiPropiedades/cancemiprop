import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Stepper, Step, StepLabel, TextField, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const PropertyStepper = ({ onPropertyAdded }) => {
    const steps = ['Datos Principales', 'Características', 'Cargar Imágenes', 'Descripción'];

    const [activeStep, setActiveStep] = useState(0);
    const [propertyData, setPropertyData] = useState({
        titulo: '',
        ubicacion: '',
        precio: '',
        tipo: '',
        ciudad: '',
        estado: 'Alquiler',
        descripcion: '',
        fotos: [],
        caracteristicas: {
            ambientes: 0,
            banos: 0,
            cochera: false,
            aceptaMascotas: false,
        },
        moneda: 'USD',
    });

    const [newPhoto, setNewPhoto] = useState('');
    const [cities, setCities] = useState([]);
    const [types, setTypes] = useState([]);

    useEffect(() => {
        const fetchCitiesAndTypes = async () => {
            try {
                const cityResponse = await axios.get('http://localhost:4000/api/cities');
                const typeResponse = await axios.get('http://localhost:4000/api/types');
                setCities(cityResponse.data);
                setTypes(typeResponse.data);
            } catch (error) {
                console.error('Error al cargar ciudades y tipos:', error);
            }
        };

        fetchCitiesAndTypes();
    }, []);

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

    const addPhoto = () => {
        if (newPhoto) {
            setPropertyData((prevData) => ({
                ...prevData,
                fotos: [...prevData.fotos, newPhoto],
            }));
            setNewPhoto('');
        }
    };

    const handleSubmit = async () => {
        try {
            await axios.post('http://localhost:4000/api/propiedades', propertyData);
            alert('Propiedad agregada con éxito');
            onPropertyAdded(); // Llama a la función para actualizar la lista de propiedades
        } catch (error) {
            console.error('Error al agregar la propiedad:', error);
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            {activeStep === 0 ? (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6">Datos Principales</Typography>
                    <TextField name="titulo" label="Título" value={propertyData.titulo} onChange={handleChange} required fullWidth margin="normal" />
                    <TextField name="ubicacion" label="Ubicación" value={propertyData.ubicacion} onChange={handleChange} required fullWidth margin="normal" />
                    <TextField type="number" name="precio" label="Precio" value={propertyData.precio} onChange={handleChange} required fullWidth margin="normal" />

                    {/* Selector de Tipo */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="tipo-label">Tipo</InputLabel>
                        <Select
                            labelId="tipo-label"
                            name="tipo"
                            value={propertyData.tipo}
                            onChange={handleChange}
                        >
                            <MenuItem value=""><em>Seleccione un tipo</em></MenuItem>
                            {types.map((type) => (
                                <MenuItem key={type._id} value={type._id}>{type.nombre}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Selector de Ciudad */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="ciudad-label">Ciudad</InputLabel>
                        <Select
                            labelId="ciudad-label"
                            name="ciudad"
                            value={propertyData.ciudad}
                            onChange={handleChange}
                        >
                            <MenuItem value=""><em>Seleccione una ciudad</em></MenuItem>
                            {cities.map((city) => (
                                <MenuItem key={city._id} value={city._id}>{city.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Selector de Moneda */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="moneda-label">Moneda</InputLabel>
                        <Select
                            labelId="moneda-label"
                            name="moneda"
                            value={propertyData.moneda}
                            onChange={handleChange}
                        >
                            <MenuItem value="USD">USD</MenuItem>
                            <MenuItem value="ARS">Pesos Argentinos</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            ) : activeStep === 1 ? (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6">Características</Typography>
                    <TextField 
                        type="number" 
                        name="ambientes" 
                        label="Ambientes" 
                        value={propertyData.caracteristicas.ambientes} 
                        onChange={handleCaracteristicasChange} 
                        fullWidth 
                        margin="normal" 
                    />
                    <TextField 
                        type="number" 
                        name="banos" 
                        label="Baños" 
                        value={propertyData.caracteristicas.banos} 
                        onChange={handleCaracteristicasChange} 
                        fullWidth 
                        margin="normal" 
                    />
                    <div>
                        <label>
                            <input 
                                type="checkbox" 
                                name="cochera" 
                                checked={propertyData.caracteristicas.cochera} 
                                onChange={handleCaracteristicasChange} 
                            />
                            Cochera
                        </label>
                    </div>
                    <div>
                        <label>
                            <input 
                                type="checkbox" 
                                name="aceptaMascotas" 
                                checked={propertyData.caracteristicas.aceptaMascotas} 
                                onChange={handleCaracteristicasChange} 
                            />
                            Acepta Mascotas
                        </label>
                    </div>
                </Box>
            ) : activeStep === 2 ? (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6">Cargar Imágenes</Typography>
                    <input 
                        type="text" 
                        value={newPhoto} 
                        onChange={(e) => setNewPhoto(e.target.value)} 
                        placeholder="URL de la foto" 
                    />
                    <Button onClick={addPhoto}>Agregar Foto</Button>
                    <ul>
                        {propertyData.fotos.map((foto, index) => (
                            <li key={index}>
                                {foto}
                                <DeleteIcon onClick={() => setPropertyData((prevData) => ({
                                    ...prevData,
                                    fotos: prevData.fotos.filter((_, i) => i !== index),
                                }))} />
                            </li>
                        ))}
                    </ul>
                </Box>
            ) : (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6">Descripción</Typography>
                    <TextField name="descripcion" label="Descripción" value={propertyData.descripcion} onChange={handleChange} required fullWidth margin="normal" />
                </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button disabled={activeStep === 0} onClick={() => setActiveStep((prev) => prev - 1)}>Atrás</Button>
                <Button onClick={() => {
                    if (activeStep === steps.length - 1) {
                        handleSubmit(); // Llamar a `handleSubmit` sin pasarle `event`
                    } else {
                        setActiveStep((prev) => prev + 1);
                    }
                }}>
                    {activeStep === steps.length - 1 ? 'Enviar' : 'Siguiente'}
                </Button>
            </Box>
        </Box>
    );
};

export default PropertyStepper;