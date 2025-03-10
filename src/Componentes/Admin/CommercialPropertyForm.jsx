import { useState } from "react";
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const CommercialPropertyForm = ({ cities, onPropertyAdded }) => {
    const [propertyData, setPropertyData] = useState({
        ubicacion: "",
        precio: "",
        estado: "",
        ciudad: "",
        moneda: "USD",
        descripcion: "",
        metrosCuadrados: "", // Agregamos la propiedad metrosCuadrados
        caracteristicas: {
            cochera: false,
            aceptaMascotas: false,
            pileta: false,
            gimnasio: false,
            laundry: false,
            ascensor: false,
        },
    });

    const [selectedImages, setSelectedImages] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPropertyData({ ...propertyData, [name]: value });
    };

    const handleCaracteristicasChange = (e) => {
        const { name, checked } = e.target;
        setPropertyData({
            ...propertyData,
            caracteristicas: { ...propertyData.caracteristicas, [name]: checked },
        });
    };

    const handleFileChange = (e) => {
        setSelectedImages([...selectedImages, ...e.target.files]);
    };

    const handleImageRemove = (index) => {
        setSelectedImages(selectedImages.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!propertyData.ubicacion || !propertyData.precio || !propertyData.estado || !propertyData.ciudad) {
            setModalMessage("Por favor, complete todos los campos obligatorios.");
            setOpenModal(true);
            return;
        }

        if (selectedImages.length === 0) {
            setModalMessage("Debe subir al menos una imagen.");
            setOpenModal(true);
            return;
        }

        const formData = new FormData();
        const cleanedPrice = propertyData.precio.replace(/\./g, "");
        const finalPropertyData = { ...propertyData, precio: cleanedPrice };

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
            const response = await axios.post("http://localhost:4000/api/propiedades", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 200) {
                setModalMessage("Propiedad agregada con éxito.");
            } else {
                setModalMessage("Hubo un problema al agregar la propiedad.");
            }

            setOpenModal(true);
            onPropertyAdded();
        } catch (error) {
            console.error("Error al agregar la propiedad:", error);
            setModalMessage(error.response?.data?.error || "Error desconocido del servidor.");
            setOpenModal(true);
        }
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Typography variant="h6">Formulario Propiedad Comercial</Typography>
            <TextField name="ubicacion" label="Ubicación" value={propertyData.ubicacion} onChange={handleChange} required fullWidth margin="normal" />
            <TextField type="number" name="precio" label="Precio" value={propertyData.precio} onChange={handleChange} required fullWidth margin="normal" />
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
                    {cities && Array.isArray(cities) && cities.length > 0 ? (
                        cities.map((city) => (
                            <MenuItem key={city._id} value={city._id}>
                                {city.name}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem value="">No hay ciudades disponibles</MenuItem>
                    )}
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
                name="metrosCuadrados"
                label="Metros Cuadrados"
                value={propertyData.metrosCuadrados}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
                type="number" // Para asegurarse de que solo se ingresen números
            />

            <div>
                {Object.keys(propertyData.caracteristicas).map((key) => (
                    <FormControlLabel key={key} control={<Checkbox checked={propertyData.caracteristicas[key]} onChange={handleCaracteristicasChange} name={key} />} label={key} />
                ))}
            </div>

            <input type="file" multiple onChange={handleFileChange} />
            <ul>
                {selectedImages.map((foto, index) => (
                    <li key={index}>{foto.name} <DeleteIcon onClick={() => handleImageRemove(index)} /></li>
                ))}
            </ul>

            <TextField name="descripcion" label="Descripción" value={propertyData.descripcion} onChange={handleChange} required fullWidth margin="normal" />
            <Button onClick={handleSubmit} color="primary">Enviar</Button>

            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle>Mensaje</DialogTitle>
                <DialogContent>
                    <Typography>{modalMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)} color="primary">Cerrar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CommercialPropertyForm;