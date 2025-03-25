import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import PropertyStepper from '../Componentes/Admin/PropertyStepper';
import PropertyManager from '../Componentes/Admin/PropertyManager';
import TypeManager from '../Componentes/Admin/TypeManager';
import CityManager from '../Componentes/Admin/CityManager';
import { Box, Drawer, Button, List, Divider, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import HouseIcon from '@mui/icons-material/House';
import PlaceIcon from '@mui/icons-material/Place';
import ApartmentIcon from '@mui/icons-material/Apartment';
import CategoryIcon from '@mui/icons-material/Category';
import '../Css/AdminDashboard.css';

Modal.setAppElement('#root');

const AdminDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [activeView, setActiveView] = useState('Agregar Propiedad');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:4001/api/propiedades', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProperties(response.data);
      } catch (error) {
        console.error('Error al cargar las propiedades:', error);
      }
    };

    fetchProperties();
  }, [token]);

  const toggleDrawer = (open) => () => {
    setOpenDrawer(open);
  };

  const handleDrawerItemClick = (view) => {
    setActiveView(view);
    setOpenDrawer(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`http://localhost:4001/api/propiedades/${selectedProperty._id}`, selectedProperty, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProperties(properties.map(prop => prop._id === selectedProperty._id ? selectedProperty : prop));
      closeModal();
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'Agregar Propiedad':
        return <PropertyStepper onPropertyAdded={setProperties} />;
      case 'Gestionar Barrios':
        return <CityManager />;
      case 'Gestionar Propiedades':
        return <PropertyManager />;
      case 'Gestionar Tipos':
        return <TypeManager />;
      default:
        return <PropertyStepper onPropertyAdded={setProperties} />;
    }
  };

  const handleMarkAsUnavailable = async () => {
    try {
      await axios.patch(`http://localhost:4001/api/propiedades/no-disponible/${selectedProperty._id}`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProperties(properties.map(prop => prop._id === selectedProperty._id ? { ...prop, disponible: false } : prop));
      closeModal(); // Cerramos el modal después de marcar como no disponible
    } catch (error) {
      console.error('Error al marcar la propiedad como no disponible:', error);
    }
  };

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>Abrir menú</Button>
      <Drawer anchor="left" open={openDrawer} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {[
              { text: 'Agregar Propiedad', icon: <HouseIcon /> },
              { text: 'Gestionar Barrios', icon: <PlaceIcon /> },
              { text: 'Gestionar Propiedades', icon: <ApartmentIcon /> },
              { text: 'Gestionar Tipos', icon: <CategoryIcon /> },
            ].map(({ text, icon }) => (
              <ListItem button key={text} onClick={() => handleDrawerItemClick(text)}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
      <div className="admin-dashboard">
        <div className="admin-dashboard-content">
          {renderActiveView()}
        </div>
      </div>

      {selectedProperty && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Editar Propiedad"
          className="modal"
        >
          <h2>Editar Propiedad</h2>
          <input
            type="text"
            value={selectedProperty.titulo}
            onChange={e => setSelectedProperty({ ...selectedProperty, titulo: e.target.value })}
            placeholder="Título"
          />
          <input
            type="text"
            value={selectedProperty.ubicacion}
            onChange={e => setSelectedProperty({ ...selectedProperty, ubicacion: e.target.value })}
            placeholder="Ubicación"
          />
          <input
            type="number"
            value={selectedProperty.precio}
            onChange={e => setSelectedProperty({ ...selectedProperty, precio: e.target.value })}
            placeholder="Precio"
          />
          <textarea
            value={selectedProperty.descripcion}
            onChange={e => setSelectedProperty({ ...selectedProperty, descripcion: e.target.value })}
            placeholder="Descripción"
          />
          <button onClick={handleSaveChanges}>Guardar Cambios</button>
          <button onClick={closeModal}>Cancelar</button>
          <button onClick={handleMarkAsUnavailable}>Marcar como No Disponible</button>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;