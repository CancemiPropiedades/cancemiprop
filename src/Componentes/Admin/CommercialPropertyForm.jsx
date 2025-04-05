import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Stepper, Step, StepLabel, TextField, Typography, MenuItem, Select, FormControl, InputLabel, FormControlLabel, Checkbox, FormGroup, Modal } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const CommercialPropertyForm = ({ onPropertyAdded }) => {
    const steps = ["Datos Principales", "Características", "Cargar Imágenes", "Descripción"];
    const [activeStep, setActiveStep] = useState(0);
    const [selectedImages, setSelectedImages] = useState([]);
    const [errors, setErrors] = useState({});
    const [propertyTypes, setPropertyTypes] = useState([]);
    console.log(errors);
    console.log(setErrors);

    const [propertyData, setPropertyData] = useState({
        ubicacion: "",
        precio: "",
        estado: "",
        ciudad: "",
        moneda: "USD",
        descripcion: "",
        tipoPropiedad: "",
        metrosCuadrados: 0,
        caracteristicas: {
            metrosCuadrados: 0,
            ambientes: 0,
            banos: 0,
            dormitorios: 0,
            cochera: false,
            mascotas: false,
            pileta: false,
            parrilla: false,
            gimnasio: false,
            laundry: false,
            ascensor: false,
            agua: false,
            cloaca: false,
            gas: false,
            internet: false,
            electricidad: false,
            pavimento: false,
            telefono: false,
            cable: false,
            solarium: false,
            sum: false,
            luminoso: false,
            potable: false,
            seguridad: false,
            alumbrado: false,
          }
          
    });

    const caracteristicasLista = [
        "agua", "cloaca", "gas", "internet", "electricidad",
        "pavimento", "telefono", "cable", "gimnasio", "parrilla",
        "solarium", "sum", "pileta", "luminoso", "potable",
        "laundry", "seguridad", "alumbrado", "cochera", "mascotas",
        "ascensor"
      ];
      
    const [cities, setCities] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [modalMessage, setModalMessage] = useState([]);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const cityResponse = await axios.get("http://localhost:4001/api/cities");
                setCities(cityResponse.data);
            } catch (error) {
                console.error("Error al cargar ciudades:", error);
            }
        };
        fetchCities();

        const fetchPropertyTypes = async () => {

            try {
                const response = await axios.get("http://localhost:4001/api/types-propiedad");
                setPropertyTypes(response.data);
            } catch (error) {
                console.error("Error al cargar los tipos de propiedad:", error);
            }
        };
        fetchPropertyTypes();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'metrosCuadrados') {
            setPropertyData((prevData) => ({
                ...prevData,
                caracteristicas: {
                    ...prevData.caracteristicas,
                    metrosCuadrados: Number(value), // Actualización correcta
                },
            }));
        } else {
            setPropertyData((prevData) => ({
                ...prevData,
                [name]: name === "precio" ? value.replace(/\./g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".") : value,
            }));
        }
    };

    const handleCaracteristicasChange = (e) => {
        const { name, type, value, checked } = e.target;
        setPropertyData((prevData) => ({
            ...prevData,
            caracteristicas: {
                ...prevData.caracteristicas,
                [name]: type === "checkbox" ? checked : Number(value),
            },
        }));
    };

    const handleFileChange = (event) => {
        const files = event.target.files;
        setSelectedImages((prevImages) => [...prevImages, ...Array.from(files)]);
    };

    const handleImageRemove = (index) => {
        setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        const formData = new FormData();
    
        const finalPropertyData = {
          ...propertyData,
          tipoPropiedad: propertyData.tipoPropiedad,
        };
      
        formData.append("caracteristicas", JSON.stringify(finalPropertyData.caracteristicas));
        formData.append("ubicacion", propertyData.ubicacion);
        formData.append("precio", finalPropertyData.precio);
        formData.append("tipoPropiedad", finalPropertyData.tipoPropiedad);
        formData.append("estado", finalPropertyData.estado);
        formData.append("descripcion", finalPropertyData.descripcion);
        formData.append("moneda", finalPropertyData.moneda);
        formData.append("ciudad", finalPropertyData.ciudad);
        formData.append("categoria", "residencial");
      
        selectedImages.forEach((file) => {
          formData.append("fotos", file);
        });
      
        try {
          await axios.post("http://localhost:4001/api/propiedades", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
      
          setModalMessage("Propiedad agregada con éxito");
          setOpenModal(true);
          onPropertyAdded();
        } catch (error) {
          console.error("Error al agregar la propiedad:", error.response?.data || error);
          setModalMessage("Hubo un error al agregar la propiedad. Intente nuevamente.");
          setOpenModal(true);
        }
      };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <Box sx={{ width: "100%" }}>
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
                    <TextField name="ubicacion" label="Ubicación" value={propertyData.ubicacion} onChange={handleChange} required fullWidth margin="normal" />
                    <TextField type="number" name="precio" label="Precio" value={propertyData.precio} onChange={handleChange} fullWidth margin="normal" />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="tipo-propiedad-label">Tipo de Propiedad</InputLabel>
                        <Select labelId="tipo-propiedad-label" name="tipoPropiedad" value={propertyData.tipoPropiedad} onChange={handleChange}>
                            {propertyTypes.map((type) => (
                                <MenuItem key={type._id} value={type._id}>{type.nombre}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="estado-label">Estado De la Propiedad</InputLabel>
                        <Select labelId="estado-label" name="estado" value={propertyData.estado} onChange={handleChange}>
                            <MenuItem value="Venta">Venta</MenuItem>
                            <MenuItem value="Alquiler">Alquiler</MenuItem>
                            <MenuItem value="Emprendimiento">Emprendimiento</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="ciudad-label">Ciudad</InputLabel>
                        <Select labelId="ciudad-label" name="ciudad" value={propertyData.ciudad} onChange={handleChange}>
                            {cities.map((city) => (
                                <MenuItem key={city._id} value={city._id}>
                                    {city.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="moneda-label">Moneda</InputLabel>
                        <Select labelId="moneda-label" name="moneda" value={propertyData.moneda} onChange={handleChange}>
                            <MenuItem value="USD">USD</MenuItem>
                            <MenuItem value="ARS">Pesos Argentinos</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        type="number"
                        name="metrosCuadrados"
                        label="Metros Cuadrados"
                        value={propertyData.caracteristicas.metrosCuadrados}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        error={!!errors.metrosCuadrados}
                        helperText={errors.metrosCuadrados}
                    />
                </Box>
            ) : activeStep === 1 ? (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6">Características</Typography>
                    <FormGroup>
                        {caracteristicasLista.map((caracteristica) => (
                            <FormControlLabel
                            key={caracteristica}
                            control={
                              <Checkbox
                                checked={propertyData.caracteristicas[caracteristica] || false}
                                onChange={handleCaracteristicasChange}
                                name={caracteristica}
                              />
                            }
                            label={caracteristica.charAt(0).toUpperCase() + caracteristica.slice(1).replace(/([A-Z])/g, " $1")}
                          />                          
                        ))}
                    </FormGroup>
                </Box>
            ) : activeStep === 2 ? (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6">Cargar Imágenes</Typography>
                    <input type="file" multiple onChange={handleFileChange} />
                    <ul>{selectedImages.map((foto, index) => (<li key={index}>{foto.name} <DeleteIcon onClick={() => handleImageRemove(index)} /></li>))}</ul>
                </Box>
            ) : (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6">Descripción</Typography>
                    <TextField name="descripcion" label="Descripción" value={propertyData.descripcion} onChange={handleChange} fullWidth margin="normal" />
                </Box>
            )}

            <Button disabled={activeStep === 0} onClick={() => setActiveStep((prev) => prev - 1)}>Atrás</Button>
            <Button onClick={() => activeStep === steps.length - 1 ? handleSubmit() : setActiveStep((prev) => prev + 1)}>
                {activeStep === steps.length - 1 ? "Enviar" : "Siguiente"}
            </Button>
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4, }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {modalMessage}
                    </Typography>
                    <Button onClick={handleCloseModal}>Cerrar</Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default CommercialPropertyForm;