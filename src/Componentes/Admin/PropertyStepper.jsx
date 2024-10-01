import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Stepper, Step, StepLabel, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const steps = ['Datos Principales', 'Características', 'Cargar Imágenes', 'Descripción'];

const PropertyStepper = ({ onPropertyAdded }) => {
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
    });

    const [newPhoto, setNewPhoto] = useState('');
    const [cities, setCities] = useState([]);
    console.log(cities)
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/cities');
                setCities(response.data);
            } catch (error) {
                console.error('Error al cargar las ciudades:', error);
            }
        };

        fetchCities();
    }, []);

    const handleChange = (e) => {
        setPropertyData({
            ...propertyData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCaracteristicasChange = (e) => {
        setPropertyData({
            ...propertyData,
            caracteristicas: {
                ...propertyData.caracteristicas,
                [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
            },
        });
    };

    const handleNewPhotoChange = (e) => {
        setNewPhoto(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6">Datos Principales</Typography>
                        <TextField name="titulo" label="Título" value={propertyData.titulo} onChange={handleChange} required fullWidth margin="normal" />
                        <TextField name="ubicacion" label="Ubicación" value={propertyData.ubicacion} onChange={handleChange} required fullWidth margin="normal" />
                        <TextField type="number" name="precio" label="Precio" value={propertyData.precio} onChange={handleChange} required fullWidth margin="normal" />
                        <TextField name="tipo" label="Tipo" value={propertyData.tipo} onChange={handleChange} required fullWidth margin="normal" />
                    </Box>
                );
            case 1:
                return (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6">Características</Typography>
                        <TextField type="number" name="ambientes" label="Ambientes" value={propertyData.caracteristicas.ambientes} onChange={handleCaracteristicasChange} fullWidth margin="normal" />
                        <TextField type="number" name="banos" label="Baños" value={propertyData.caracteristicas.banos} onChange={handleCaracteristicasChange} fullWidth margin="normal" />
                        <div>
                            <label>
                                <input type="checkbox" name="cochera" checked={propertyData.caracteristicas.cochera} onChange={handleCaracteristicasChange} />
                                Cochera
                            </label>
                        </div>
                        <div>
                            <label>
                                <input type="checkbox" name="aceptaMascotas" checked={propertyData.caracteristicas.aceptaMascotas} onChange={handleCaracteristicasChange} />
                                Acepta Mascotas
                            </label>
                        </div>
                    </Box>
                );
            case 2:
                return (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6">Cargar Imágenes</Typography>
                        <input type="text" value={newPhoto} onChange={handleNewPhotoChange} placeholder="URL de la foto" />
                        <Button onClick={addPhoto}>Agregar Foto</Button>
                        <ul>
                            {propertyData.fotos.map((foto, index) => (
                                <li key={index}>
                                    {foto}
                                    <DeleteIcon onClick={() => setPropertyData(prevData => ({
                                        ...prevData,
                                        fotos: prevData.fotos.filter((_, i) => i !== index)
                                    }))} />
                                </li>
                            ))}
                        </ul>
                    </Box>
                );
            case 3:
                return (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6">Descripción</Typography>
                        <TextField name="descripcion" label="Descripción" value={propertyData.descripcion} onChange={handleChange} required fullWidth margin="normal" />
                    </Box>
                );
            default:
                return 'Paso desconocido';
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
            {activeStep === steps.length ? (
                <div>
                    <Typography>Todos los pasos completados - estás terminado</Typography>
                    <Button onClick={handleSubmit}>Enviar Propiedad</Button>
                    <Button onClick={handleBack}>Volver</Button>
                </div>
            ) : (
                <div>
                    {renderStepContent(activeStep)}
                    <Button disabled={activeStep === 0} onClick={handleBack}>Atrás</Button>
                    <Button onClick={handleNext}>
                        {activeStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
                    </Button>
                </div>
            )}
        </Box>
    );
};

export default PropertyStepper;