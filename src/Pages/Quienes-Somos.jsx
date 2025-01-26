import React from 'react';
import { Box, Typography, Icon } from '@mui/material';
import { FaHome } from 'react-icons/fa'; 
import '../Css/Quienessomos.css'

const QuienesSomos = () => {
    return (
        <div className='contenedor-inf'>
            <Box sx={{ padding: 4, maxWidth: 800, boxShadow: 3, borderRadius: 2, backgroundColor: '#f9f9f9' }}>
            <Typography variant="h4" align="center" gutterBottom>
                <Icon component={FaHome} sx={{ fontSize: 40, color: '#1976d2' }} />
                QUIÉNES SOMOS
            </Typography>
            <Typography variant="body1" align="center" sx={{ marginBottom: 3 }}>
                Cancemi Propiedades es una empresa familiar con más de 20 años de experiencia en el mercado inmobiliario.
                Nos dedicamos exclusivamente a ayudarte a comprar, vender o alquilar tu propiedad, brindándote asesoramiento con calidad, experiencia y profesionalismo.
            </Typography>
        </Box>
        </div>
    );
};

export default QuienesSomos;