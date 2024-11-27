import React from 'react';
import WhatsAppIcon from '@mui/icons-material/WhatsApp'; 
import { Fab } from '@mui/material';

const WhatsAppButton = () => {
    const whatsappNumber = "+5491164476465";

    const handleWhatsAppClick = () => {
        window.open(`https://wa.me/${whatsappNumber}`, '_blank');
    };

    return (
        <Fab
            color="success"
            aria-label="whatsapp"
            onClick={handleWhatsAppClick}
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 1000,
            }}
        >
            <WhatsAppIcon />
        </Fab>
    );
};

export default WhatsAppButton;