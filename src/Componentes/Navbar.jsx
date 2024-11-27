import * as React from 'react';
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

const drawerWidth = 240;
const navItems = ['alquiler', 'venta', 'emprendimiento', 'quienes-somos', 'contacto'];

function DrawerAppBar({ onFilterChange }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();

  // Obtener si el usuario está autenticado
  const isAuthenticated = localStorage.getItem('token') !== null;

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleFilterChange = (filterType) => {
    onFilterChange(filterType); // Actualiza el filtro en la App principal
    navigate(`/${filterType}`); // Navega a la página correspondiente
  };  

  const handleLogout = () => {
    localStorage.removeItem('token');  // Eliminar token de localStorage
    navigate('/');  // Redirigir al usuario a la página principal o cualquier otra página
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box variant="h6" sx={{ my: 2, backgroundColor: '#27337F' }}>
        <LinkRouter to={"/"}>
          <img className='imgLogo' src={Logo} alt="Logo" sx={{height:'100px'}}/>
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
        {/* Mostrar botón de "Cerrar Sesión" si el usuario está autenticado */}
        {isAuthenticated && (
          <ListItem disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }} onClick={handleLogout}>
              <ListItemText primary="Cerrar Sesión" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  const container = window !== undefined ? window.document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav" sx={{ background: '#27337F' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            <LinkRouter to={"/"}>
              <img src={Logo} alt="Logo"/>
            </LinkRouter>
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button
                key={item}
                sx={{ color: '#fff', fontSize: '15px' }}
                onClick={() => handleFilterChange(item.toLowerCase())}
              >
                {item}
              </Button>
            ))}
            {/* Mostrar botón de "Cerrar Sesión" solo si el usuario está autenticado */}
            {isAuthenticated && (
              <Button sx={{ color: '#fff', fontSize: '15px' }} onClick={handleLogout}>
                Cerrar Sesión
              </Button>
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
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
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