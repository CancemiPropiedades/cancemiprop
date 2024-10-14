import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal'; // Para el modal

// Importamos los iconos de Material-UI
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

import EditProperty from './EditProperty'; // Importamos el componente de edición

Modal.setAppElement('#root'); // Necesario para accesibilidad

const PropertyManager = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleEdit = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  const handleSaveChanges = async (updatedProperty) => {
    try {
      await axios.put(`http://localhost:4000/api/propiedades/${selectedProperty._id}`, updatedProperty, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProperties(properties.map(prop => (prop._id === updatedProperty._id ? updatedProperty : prop)));
      closeModal();
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  const handleDisable = async (id, isHabilitada) => {
    try {
      await axios.put(`http://localhost:4000/api/propiedades/${id}`, { habilitada: !isHabilitada }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProperties(properties.map(property => 
        property._id === id ? { ...property, habilitada: !isHabilitada } : property
      ));
    } catch (error) {
      console.error('Error al deshabilitar/habilitar la propiedad:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/propiedades/${id}`);
      setProperties(properties.filter(property => property._id !== id));
    } catch (error) {
      console.error('Error al eliminar la propiedad:', error);
    }
  };

  return (
    <div>
      <h2>Gestionar Propiedades</h2>
      <ul>
        {properties.map(property => (
          <li key={property._id}>
            {property.titulo}
            {/* Icono de Editar */}
            <EditIcon 
              onClick={() => handleEdit(property)} 
              style={{ cursor: 'pointer', marginLeft: '10px' }}
            />
            {/* Icono de habilitar/deshabilitar */}
            {property.habilitada ? (
              <VisibilityIcon 
                onClick={() => handleDisable(property._id, property.habilitada)} 
                style={{ cursor: 'pointer', marginLeft: '10px' }}
              />
            ) : (
              <VisibilityOffIcon 
                onClick={() => handleDisable(property._id, property.habilitada)} 
                style={{ cursor: 'pointer', marginLeft: '10px' }}
              />
            )}
            {/* Icono de Eliminar */}
            <DeleteIcon 
              onClick={() => handleDelete(property._id)} 
              style={{ cursor: 'pointer', marginLeft: '10px' }}
            />
          </li>
        ))}
      </ul>

      {selectedProperty && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Editar Propiedad"
          className="modal"
        >
          <EditProperty 
            property={selectedProperty}
            onSave={handleSaveChanges} 
            onClose={closeModal} 
          />
        </Modal>
      )}
    </div>
  );
};

export default PropertyManager;