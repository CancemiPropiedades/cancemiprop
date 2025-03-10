import React, { useState } from 'react';
import { AppBar, Box, Toolbar, IconButton, Button, Menu, MenuItem, Drawer, CssBaseline, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Logo from '../Imagenes/LOGO.svg';
import '../Css/Navbar.css';

const drawerWidth = 240;

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token') !== null;

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleCloseMenu();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box sx={{ my: 2 }}>
        <RouterLink to="/">
          <img src={Logo} alt="Logo" className="logo-img" />
        </RouterLink>
      </Box>
      <Divider />
      <List>
        {!isAuthenticated ? (
          <>
            {['Alquiler', 'Venta', 'Emprendimiento', 'Nosotros', 'Contacto'].map((item) => (
              <ListItem key={item} disablePadding>
                <ListItemButton onClick={() => handleNavigation(`/${item.toLowerCase()}`)}>
                  <ListItemText primary={item} />
                </ListItemButton>
              </ListItem>
            ))}
          </>
        ) : (
          <>
            <ListItemButton onClick={handleMenuClick}>
              <ListItemText primary="Operación Comercial" />
            </ListItemButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
              {['Alquiler', 'Venta', 'Emprendimiento'].map((item) => (
                <MenuItem key={item} onClick={() => handleNavigation(`/${item.toLowerCase()}`)}>
                  {item}
                </MenuItem>
              ))}
            </Menu>
            <ListItemButton onClick={() => handleNavigation('/Nosotros')}>
              <ListItemText primary="Nosotros" />
            </ListItemButton>
            <ListItemButton onClick={() => handleNavigation('/no-disponible')}>
              <ListItemText primary="No Disponible" />
            </ListItemButton>
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Cerrar Sesión" />
            </ListItemButton>
            <ListItemButton onClick={() => handleNavigation('/admin')}>
              <ListItemText primary="Panel Admin" />
            </ListItemButton>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar sx={{ background: '#27337F', position: 'fixed', height: '100px', padding: '0 20px' }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }}>
            <RouterLink to="/">
              <img src={Logo} alt="Logo" style={{ maxWidth: '150px', height: 'auto' }} />
            </RouterLink>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {!isAuthenticated ? (
              ['Alquiler', 'Venta', 'Emprendimiento', 'Nosotros', 'Contacto'].map((item) => (
                <Button key={item} sx={{ color: '#fff' }} onClick={() => handleNavigation(`/${item.toLowerCase()}`)}>
                  {item}
                </Button>
              ))
            ) : (
              <>
                <Button sx={{ color: '#fff' }} onClick={handleMenuClick}>
                  Operación Comercial
                </Button>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                  {['Alquiler', 'Venta', 'Emprendimiento'].map((item) => (
                    <MenuItem key={item} onClick={() => handleNavigation(`/${item.toLowerCase()}`)}>
                      {item}
                    </MenuItem>
                  ))}
                </Menu>
                <Button sx={{ color: '#fff' }} onClick={() => handleNavigation('/no-disponible')}>
                  No Disponible
                </Button>
                <Button sx={{ color: '#fff' }} onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
                <Button sx={{ color: '#fff' }} onClick={() => handleNavigation('/admin')}>
                  Panel Admin
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <nav>
        <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} sx={{ '& .MuiDrawer-paper': { width: drawerWidth } }}>
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}

export default Navbar;