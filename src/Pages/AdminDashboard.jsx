import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal'; // Para el modal
import PropertyStepper from '../Componentes/Admin/PropertyStepper'; 
import PropertyManager from '../Componentes/Admin/PropertyManager'
import CityManager from '../Componentes/Admin/CityManager';
import { Box, Drawer, Button, List, Divider, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox'; // O cualquier icono que quieras usar
import '../Css/AdminDashboard.css';

Modal.setAppElement('#root'); // Necesario para accesibilidad

const AdminDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null); // Propiedad seleccionada para editar
  const [isModalOpen, setIsModalOpen] = useState(false); // Control del modal
  const [openDrawer, setOpenDrawer] = useState(false); // Control del drawer
  const [activeView, setActiveView] = useState('Agregar Propiedad'); // Vista activa
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/propiedades', {
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
    setSelectedProperty(null); // Cerrar modal y limpiar propiedad seleccionada
  };

  const handleSaveChanges = async () => {
    // Guardar los cambios de la propiedad en el backend
    try {
      await axios.put(`http://localhost:4000/api/propiedades/${selectedProperty._id}`, selectedProperty, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProperties(properties.map(prop => prop._id === selectedProperty._id ? selectedProperty : prop));
      closeModal();
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  // Renderiza la vista activa basada en el estado
  const renderActiveView = () => {
    switch (activeView) {
        case 'Agregar Propiedad':
            return <PropertyStepper onPropertyAdded={setProperties} />;
        case 'Gestionar Ciudades':
            return <CityManager />;
        case 'Gestionar Propiedades':
            return <PropertyManager />;
        default:
            return <PropertyStepper onPropertyAdded={setProperties} />;
    }
};

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>Abrir menú</Button>
      <Drawer anchor="left" open={openDrawer} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {['Agregar Propiedad', 'Gestionar Ciudades', 'Gestionar Propiedades'].map((text, index) => (
              <ListItem button key={text} onClick={() => handleDrawerItemClick(text)}>
                <ListItemIcon>
                  <InboxIcon /> {/* Cambia el icono según la opción */}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>

      <h1>Panel de Administración</h1>
      {renderActiveView()}

      {/* Modal para editar la propiedad */}
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
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;