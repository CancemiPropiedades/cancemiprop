import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, Stepper, Step, StepLabel, TextField, Typography, MenuItem, Select, FormControl, InputLabel, FormControlLabel, Checkbox, FormGroup, Modal } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ResidentialPropertyForm = ({ onPropertyAdded }) => {
  const steps = ["Datos Principales", "Características", "Cargar Imágenes", "Descripción"];
  const [activeStep, setActiveStep] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);
  const [errors, setErrors] = useState({});
  console.log(setErrors);
  
  const [propertyData, setPropertyData] = useState({
    ubicacion: "",
    precio: "",
    tipo: "",
    ciudad: "",
    estado: "",
    descripcion: "",
    moneda: "USD",
    ambientes: 0,
    banos: 0,
    dormitorios: 0,
    caracteristicas: {
      AguaCorriente: false,
      Cloaca: false,
      GasNatural: false,
      Internet: false,
      Electricidad: false,
      Pavimento: false,
      Teléfono: false,
      Cable: false,
      Gimnasio: false,
      Parrilla: false,
      Solarium: false,
      SUM: false,
      Pileta: false,
      Luminoso: false,
      AguaPotable: false,
      Laundry: false,
      Seguridad24hs: false,
      AlumbradoPublico: false,
      metrosCuadrados: 0,
    },
  });
  const caracteristicasLista = [
    "AguaCorriente", "Cloaca", "GasNatural", "Internet", "Electricidad",
    "Pavimento", "Teléfono", "Cable", "Gimnasio", "Parrilla", "Solarium",
    "SUM", "Pileta", "Luminoso", "AguaPotable", "Laundry", "Seguridad24hs", "AlumbradoPublico"
  ];

  // const validateForm = () => {
  //   let tempErrors = {};
  //   if (!propertyData.ubicacion) tempErrors.ubicacion = "Este campo es obligatorio";
  //   if (!propertyData.precio) tempErrors.precio = "Este campo es obligatorio";
  //   if (!propertyData.estado) tempErrors.estado = "Este campo es obligatorio";
  //   if (!propertyData.ciudad) tempErrors.ciudad = "Este campo es obligatorio";
  //   if (!propertyData.metrosCuadrados) tempErrors.metrosCuadrados = "Este campo es obligatorio";
  //   setErrors(tempErrors);
  //   return Object.keys(tempErrors).length === 0;
  // };

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
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "metrosCuadrados" || name === "ambientes" || name === "banos" || name === "dormitorios") {
        setPropertyData((prevData) => ({
            ...prevData,
            caracteristicas: {
                ...prevData.caracteristicas,
                [name]: Number(value),
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
        [name]: type === 'checkbox' ? checked : Number(value),
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
    const cleanedPrice = propertyData.precio.replace(/\./g, "");

    console.log("FormData:", formData);
    for (var pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
    }
    
    const finalPropertyData = {
      ...propertyData,
      precio: cleanedPrice,
      caracteristicas: JSON.stringify(propertyData.caracteristicas),
  };

  console.log('Tipo de caracteristicas a enviar:', typeof finalPropertyData.caracteristicas);

    Object.keys(finalPropertyData).forEach((key) => {
      if (key !== "caracteristicas") {
        formData.append(key, finalPropertyData[key]);
      }
    });

    formData.append("caracteristicas", finalPropertyData.caracteristicas);
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
                <MenuItem key={city._id} value={city._id}>{city.name}</MenuItem>
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
        </Box>
      ) : activeStep === 1 ? (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Características</Typography>
          <TextField type="number" name="ambientes" label="Ambientes" value={propertyData.caracteristicas.ambientes} onChange={handleCaracteristicasChange} fullWidth margin="normal" />
          <TextField type="number" name="banos" label="Baños" value={propertyData.caracteristicas.banos} onChange={handleChange} fullWidth margin="normal" />
          <TextField type="number" name="dormitorios" label="dormitorios" value={propertyData.caracteristicas.dormitorios} onChange={handleChange} fullWidth margin="normal" />
          <TextField type="number" name="metrosCuadrados" label="Metros Cuadrados" value={propertyData.caracteristicas.metrosCuadrados} onChange={handleChange} fullWidth margin="normal" error={!!errors.metrosCuadrados} helperText={errors.metrosCuadrados} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">Características</Typography>
            <FormGroup>
              {caracteristicasLista.map((caracteristica) => (
                <FormControlLabel key={caracteristica} control={<Checkbox checked={propertyData.caracteristicas[caracteristica] || false} onChange={handleCaracteristicasChange} name={caracteristica} />} label={caracteristica.replace(/([A-Z])/g, " $1").trim()} />
              ))}
            </FormGroup>
          </Box>
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
      <Button onClick={() => activeStep === steps.length - 1 ? handleSubmit() : setActiveStep((prev) => prev + 1)}>{activeStep === steps.length - 1 ? "Enviar" : "Siguiente"}</Button>
    
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

export default ResidentialPropertyForm;