import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import Logo from '../Imagenes/LOGO.svg';
import { Link as LinkRouter, useNavigate } from 'react-router-dom';
import '../Css/Navbar.css';
import axios from 'axios';

const drawerWidth = 240;
const navItems = ['ALQUILER', 'VENTA', 'EMPRENDIMIENTO', 'QUIENES-SOMOS', 'CONTACTO'];

function DrawerAppBar({ onFilterChange }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const [selectedPropertyId, setSelectedPropertyId] = useState(null)

  const isAuthenticated = localStorage.getItem('token') !== null;

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleFilterChange = (filterType) => {
    onFilterChange(filterType);
    navigate(`/${filterType}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleSetUnavailable = async () => {
    if (!selectedPropertyId) {
      alert("Por favor selecciona una propiedad primero");
      return;
    }

    try {
      const response = await axios.patch(
        'http://localhost:4000/api/propiedades/no-disponible',
        { id: selectedPropertyId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      alert(response.data.message); // Mostrar mensaje de éxito
    } catch (error) {
      console.error('Error al actualizar propiedad:', error.response || error.message);
      alert(`Hubo un problema al actualizar la propiedad: ${error.response?.data?.message || error.message}`);
    }
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box variant="h6" sx={{ my: 2, backgroundColor: '#27337F' }}>
        <LinkRouter to={"/"}>
          <img src={Logo} alt="Logo" className="logo-img" />
        </LinkRouter>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <LinkRouter to={`/${item}`}>
                <ListItemText primary={item} />
              </LinkRouter>
            </ListItemButton>
          </ListItem>
        ))}
        {isAuthenticated && (
          <>
            <Button
              sx={{ color: '#fff', fontSize: '15px', marginRight: '10px' }}
              onClick={() => navigate('/no-disponible')}
            >
              Ver No Disponibles
            </Button>
            <Button sx={{ color: '#fff', fontSize: '15px' }} onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </>
        )}
      </List>
    </Box>
  );

  const container = window !== undefined ? window.document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        component="nav"
        sx={{
          background: '#27337F',
          position: 'fixed',
          height: '100px',
          padding: { xs: '0 10px', sm: '0 20px' }, // Ajustes según el tamaño de pantalla
        }}
      >
        <Toolbar>
          {/* Ícono de Menú */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { xs: 'block', sm: 'block', md: 'none' }, // Visible en xs y sm
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Box
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: 'none', sm: 'block' }, // Mostrar a partir de sm
              textAlign: { sm: 'center', md: 'left' }, // Centrado en sm
            }}
          >
            <LinkRouter to="/">
              <img
                src={Logo}
                alt="Logo"
                style={{
                  maxWidth: '150px', // Ajustar tamaño
                  height: 'auto',
                }}
              />
            </LinkRouter>
          </Box>

          {/* Botones de Navegación */}
          <Box
            sx={{
              display: { xs: 'none', sm: 'none', md: 'block' }, // Visible solo a partir de md
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item}
                sx={{
                  color: '#fff',
                  fontSize: '15px',
                  marginLeft: '10px',
                }}
                onClick={() => handleFilterChange(item.toLowerCase())}
              >
                {item}
              </Button>
            ))}
            {isAuthenticated && (
              <>
                <Button
                  sx={{ color: '#fff', fontSize: '15px', marginRight: '10px' }}
                  onClick={() => navigate('/no-disponible')}
                >
                  No Disponibles
                </Button>
                <Button
                  sx={{ color: '#fff', fontSize: '15px' }}
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Mejora el rendimiento en dispositivos móviles
          }}
          sx={{
            display: { xs: 'block', sm: 'block', md: 'none' }, // Activo hasta md
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>

      </nav>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
      </Box>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

export default DrawerAppBar;