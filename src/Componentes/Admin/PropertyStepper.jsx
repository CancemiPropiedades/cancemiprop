import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Stepper, Step, StepLabel, TextField, Typography, MenuItem, Select, FormControl, InputLabel, FormControlLabel, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
//import SquareFootIcon from '@mui/icons-material/SquareFoot';
import DeleteIcon from '@mui/icons-material/Delete';
import '../../Css/Admin.css'

const PropertyStepper = ({ onPropertyAdded, propertyId }) => {
    const steps = ['Datos Principales', 'Características', 'Cargar Imágenes', 'Descripción'];
    const [activeStep, setActiveStep] = useState(0);
    const [selectedImages, setSelectedImages] = useState([]);

    const [propertyData, setPropertyData] = useState({
        titulo: '',
        ubicacion: '',
        precio: '',
        tipo: '',
        ciudad: '',
        estado: '',
        descripcion: '',
        caracteristicas: {
            ambientes: 0,
            banos: 0,
            dormitorios: 0,
            cochera: false,
            aceptaMascotas: false,
            pileta: false,
            gimnasio: false,
            laundry: false,
            ascensor: false,
        },
        moneda: 'USD',
    });

    const [cities, setCities] = useState([]);
    const [types, setTypes] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
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
    }, [propertyId]);

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
        const files = event.target.files;
        setSelectedImages(prevImages => [...prevImages, ...Array.from(files)]); // Agregar las nuevas imágenes seleccionadas
    };

    const handleImageRemove = (index) => {
        setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index)); // Eliminar imagen seleccionada
    };

    const formatNumberWithDots = (value) => {
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
    
        setPropertyData((prevData) => ({
            ...prevData,
            [name]: name === "precio" ? formatNumberWithDots(value.replace(/\./g, "")) : value,
        }));
    };
    
    const handleSubmit = async () => {
        const formData = new FormData();
        const cleanedPrice = propertyData.precio.replace(/\./g, "");

        const finalPropertyData = {
            ...propertyData,
            precio: cleanedPrice,
        };

        Object.keys(finalPropertyData).forEach((key) => {
            if (key !== "caracteristicas") {
                formData.append(key, finalPropertyData[key]);
            }
        });

        formData.append("caracteristicas", JSON.stringify(propertyData.caracteristicas));
        selectedImages.forEach((file) => {
            formData.append("fotos", file);
        });

        try {
            await axios.post("http://localhost:4000/api/propiedades", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setModalMessage('Propiedad agregada con éxito');
            setOpenModal(true);
            onPropertyAdded();
        } catch (error) {
            console.error("Error al agregar la propiedad:", error.response.data);
            setModalMessage('Hubo un error al agregar la propiedad. Intente nuevamente.');
            setOpenModal(true);
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
                        <InputLabel id="estado-label">Estado De la Propiedad</InputLabel>
                        <Select
                            labelId="estado-label"
                            name="estado"
                            value={propertyData.estado}
                            onChange={handleChange}
                        >
                            <MenuItem value=""><em>Seleccione un estado</em></MenuItem>
                            <MenuItem value="Venta">Venta</MenuItem>
                            <MenuItem value="Alquiler">Alquiler</MenuItem>
                            <MenuItem value="Emprendimiento">Emprendimiento</MenuItem>
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
                                <MenuItem key={city._id} value={city._id}>
                                    {city.name}
                                </MenuItem>
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
                    <TextField type="number" name="ambientes" label="Ambientes" value={propertyData.caracteristicas.ambientes} onChange={handleCaracteristicasChange} fullWidth margin="normal" />
                    <TextField type="number" name="banos" label="Baños" value={propertyData.caracteristicas.banos} onChange={handleCaracteristicasChange} fullWidth margin="normal" />
                    <TextField type="number" name="dormitorios" label="Dormitorios" value={propertyData.caracteristicas.dormitorios} onChange={handleCaracteristicasChange} fullWidth margin="normal" />
                    <div>
                        <FormControlLabel
                            control={<Checkbox checked={propertyData.caracteristicas.cochera} onChange={handleCaracteristicasChange} name="cochera" />}
                            label="Cochera"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={propertyData.caracteristicas.aceptaMascotas} onChange={handleCaracteristicasChange} name="aceptaMascotas" />}
                            label="Acepta Mascotas"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={propertyData.caracteristicas.pileta} onChange={handleCaracteristicasChange} name="pileta" />}
                            label="Pileta"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={propertyData.caracteristicas.gimnasio} onChange={handleCaracteristicasChange} name="gimnasio" />}
                            label="Gimnasio"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={propertyData.caracteristicas.laundry} onChange={handleCaracteristicasChange} name="laundry" />}
                            label="Laundry"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={propertyData.caracteristicas.ascensor} onChange={handleCaracteristicasChange} name="ascensor" />}
                            label="Ascensor"
                        />
                    </div>
                </Box>
            ) : activeStep === 2 ? (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6">Cargar Imágenes</Typography>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                    />
                    <ul>
                        {selectedImages.map((foto, index) => (
                            <li key={index}>
                                {foto.name} {/* Mostrar nombre del archivo */}
                                <DeleteIcon onClick={() => handleImageRemove(index)} />
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button disabled={activeStep === 0} onClick={() => setActiveStep((prev) => prev - 1)}>Atrás</Button>
                <Button onClick={() => {
                    if (activeStep === steps.length - 1) {
                        handleSubmit();
                    } else {
                        setActiveStep((prev) => prev + 1);
                    }
                }}>
                    {activeStep === steps.length - 1 ? 'Enviar' : 'Siguiente'}
                </Button>
            </Box>
            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle>Resultado</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">{modalMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)} color="primary">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PropertyStepper;
