import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal'; // Para el modal
import PropertyManager from '../Componentes/Admin/PropertyManager';
import CityManager from '../Componentes/Admin/CityManager';
import TypeManager from '../Componentes/Admin/TypeManager';
import '../Css/AdminDashboard.css'

Modal.setAppElement('#root'); // Necesario para accesibilidad

const AdminDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null); // Propiedad seleccionada para editar
  const [isModalOpen, setIsModalOpen] = useState(false); // Control del modal
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/propiedades', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProperties(response.data); // Mostrar todas las propiedades, incluidas las deshabilitadas
      } catch (error) {
        console.error('Error al cargar las propiedades:', error);
      }
    };

    fetchProperties();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/propiedades/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProperties(properties.filter(property => property._id !== id)); // Remover propiedad borrada del estado local
    } catch (error) {
      console.error('Error al eliminar la propiedad:', error);
    }
  };

  const handleDisable = async (id) => {
    const updatedProperties = properties.map(property => 
      property._id === id ? { ...property, habilitada: false } : property
    );
    setProperties(updatedProperties); // Actualizar la propiedad deshabilitada en el estado local
    // Aquí puedes enviar la solicitud al backend para actualizar la propiedad
  };

  const handleEdit = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true); // Abrir modal con los detalles de la propiedad
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

  return (
    <div>
      <h1>Panel de Administración</h1>
      <div>
        <PropertyManager />
        <CityManager />
        <TypeManager />
      </div>

      <div className="property-list">
        {properties.map(property => (
          <div className="property-item" key={property._id}>
            <span>{property.titulo}</span>
            <div className="dropdown-menu">
              <button onClick={() => handleEdit(property)}>Editar</button>
              <button onClick={() => handleDisable(property._id)}>Deshabilitar</button>
              <button onClick={() => handleDelete(property._id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>

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
          {/* Otros campos según la estructura de la propiedad */}
          <button onClick={handleSaveChanges}>Guardar Cambios</button>
          <button onClick={closeModal}>Cancelar</button>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;
