import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { useLocation } from 'react-router-dom';
import '../Css/Formcontacto.css';

const FormContacto = () => {
    const location = useLocation();
    const property = location.state?.property;

    const [formDataContacto, setFormDataContacto] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        email: '',
        consulta: property
            ? `Estoy interesado/a en la propiedad: \nTítulo: ${property.titulo}\nUbicación: ${property.ubicacion}\nPrecio: ${property.precio} ${property.moneda}`
            : '',
    });

    const [formDataTasacion, setFormDataTasacion] = useState({
        nombre: '',
        telefono: '',
        email: '',
        descripcion: '',
    });

    const [openModal, setOpenModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [formType, setFormType] = useState('');
    console.log(openModal);
    console.log(formType);
    
    
    useEffect(() => {
        if (property) {
            setFormDataContacto((prevData) => ({
                ...prevData,
                consulta: `Estoy interesado/a en la propiedad: \nUbicación: ${property.ubicacion}\nPrecio: ${property.precio} ${property.moneda}`,
            }));
        }
    }, [property]);

    const handleChangeContacto = (e) => {
        const { name, value } = e.target;
        setFormDataContacto({ ...formDataContacto, [name]: value });
    };

    const handleChangeTasacion = (e) => {
        const { name, value } = e.target;
        setFormDataTasacion({ ...formDataTasacion, [name]: value });
    };

    const handleSubmit = async (e, formType) => {
        e.preventDefault();

        let formData = formType === 'contacto' ? formDataContacto : formDataTasacion;

        try {
            const response = await fetch('http://localhost:4001/api/email/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, formType }), // Incluye el tipo de formulario
            });

            if (response.ok) {
                setModalMessage(
                    formType === 'contacto'
                        ? '¡Tu consulta de contacto fue enviada! Pronto nos pondremos en contacto.'
                        : '¡Tu solicitud de tasación fue enviada! Pronto nos pondremos en contacto.'
                );
                setFormType(formType);
                setOpenModal(true);
                formType === 'contacto'
                    ? setFormDataContacto({ nombre: '', apellido: '', telefono: '', email: '', consulta: '' })
                    : setFormDataTasacion({ nombre: '', telefono: '', email: '', descripcion: '' });
            } else {
                setModalMessage(
                    formType === 'contacto'
                        ? 'Hubo un error al enviar tu consulta de contacto. Por favor, inténtalo de nuevo.'
                        : 'Hubo un error al enviar tu solicitud de tasación. Por favor, inténtalo de nuevo.'
                );
                setFormType(formType);
                setOpenModal(true);
            }
        } catch (error) {
            console.error(error);
            setModalMessage(
                formType === 'contacto'
                    ? 'Error al enviar tu consulta de contacto.'
                    : 'Error al enviar tu solicitud de tasación.'
            );
            setFormType(formType);
            setOpenModal(true);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    console.log(handleCloseModal);
    
    return (
        <div id="contacto-forms">
            {/* Formulario de Contacto */}
            <div id="contacto-box" className="contacto-forms-box">
                <div className="contacto-forms-titulo">
                    <img src="https://static.tokkobroker.com/tfw/img/mail.44660016f743.svg" alt="Contacto" />
                    <br />
                    Contacto
                </div>
                {modalMessage && (
                    <div className="form-box">
                        Gracias por su consulta. Será contactado a la brevedad.
                    </div>
                )}
                <div className="form-box" id="fields_contact">
                    <TextField
                        fullWidth
                        label="Nombre"
                        name="nombre"
                        value={formDataContacto.nombre}
                        onChange={handleChangeContacto}
                        required
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Apellido"
                        name="apellido"
                        value={formDataContacto.apellido}
                        onChange={handleChangeContacto}
                        required
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Teléfono"
                        name="telefono"
                        value={formDataContacto.telefono}
                        onChange={handleChangeContacto}
                        required
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Correo Electrónico"
                        name="email"
                        value={formDataContacto.email}
                        onChange={handleChangeContacto}
                        type="email"
                        required
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Dejanos tu Consulta"
                        name="consulta"
                        value={formDataContacto.consulta}
                        onChange={handleChangeContacto}
                        required
                        margin="normal"
                        multiline
                        rows={4}
                    />
                    <Button
                        style={{ backgroundColor: '#27337f' }}
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={(e) => handleSubmit(e, 'contacto')}
                    >
                        Enviar Consulta
                    </Button>
                </div>
            </div>

            {/* Formulario de Tasaciones */}
            <div id="tasar-box" className="contacto-forms-box">
                <div className="contacto-forms-titulo">
                    <img src="https://static.tokkobroker.com/tfw/img/supcub2.a4947f6983bb.svg" alt="Tasaciones" />
                    <br />
                    Tasaciones
                </div>
                {modalMessage && (
                    <div className="form-box">
                        Gracias por su consulta. Será contactado a la brevedad.
                    </div>
                )}
                <div className="form-box" id="fields_cot">
                    <TextField
                        fullWidth
                        label="Nombre"
                        name="nombre"
                        value={formDataTasacion.nombre}
                        onChange={handleChangeTasacion}
                        required
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Apellido"
                        name="apellido"
                        value={formDataTasacion.apellido}
                        onChange={handleChangeContacto}
                        required
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Teléfono"
                        name="telefono"
                        value={formDataTasacion.telefono}
                        onChange={handleChangeTasacion}
                        required
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Correo Electrónico"
                        name="email"
                        value={formDataTasacion.email}
                        onChange={handleChangeTasacion}
                        type="email"
                        required
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Descripción de la Propiedad"
                        name="descripcion"
                        value={formDataTasacion.descripcion}
                        onChange={handleChangeTasacion}
                        required
                        margin="normal"
                        multiline
                        rows={4}
                    />
                    <Button
                        style={{ backgroundColor: '#27337f' }}
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={(e) => handleSubmit(e, 'tasacion')}
                    >
                        Enviar Solicitud de Tasación
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FormContacto;