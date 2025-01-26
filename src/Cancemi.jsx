import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Componentes/Navbar';
import Home from './Pages/Home';
import PropertySearchPage from './Componentes/PropertySearchPage';
import AdminDashboard from './Pages/AdminDashboard';
import PropertyDetails from './Pages/PropertyDetails';
import QuienesSomos from './Pages/Quienes-Somos';
import FormContacto from './Pages/Form-Contacto';
import WhatsAppButton from './Componentes/Botton-Whatsapp';
import LoginPage from './Pages/LoginPage';
import UnavailableProperties from './Pages/UnavailableProperties';

function Cancemi() {
  const [properties, setProperties] = useState([]);
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/propiedades');
        setProperties(response.data);
      } catch (error) {
        console.error('Error al obtener propiedades:', error);
      }
    };

    fetchProperties();
  }, []);

  const handleFilterChange = (filterType) => {
    setFilterType(filterType);
  };

  const filteredProperties = properties.filter((property) => {

    if (!property.disponible) {
      return false;
    }

    if (filterType === 'venta') {
      return property.estado?.toLowerCase() === 'venta';
    }
    if (filterType === 'alquiler') {
      return property.estado?.toLowerCase() === 'alquiler';
    }
    if (filterType === 'emprendimiento') {
      return property.estado?.toLowerCase() === 'emprendimiento';
    }

  });

  return (
    <Router>
      <div className="App">
        <Navbar onFilterChange={handleFilterChange} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/alquiler" element={<PropertySearchPage filterType="alquiler" properties={filteredProperties} />} />
          <Route path="/venta" element={<PropertySearchPage filterType="venta" properties={filteredProperties} />} />
          <Route path="/emprendimiento" element={<PropertySearchPage filterType="emprendimiento" properties={filteredProperties} />} />
          <Route path="/quienes-somos" element={<QuienesSomos />} />
          <Route path="/contacto" element={<FormContacto />} />
          <Route path="/no-disponible" element={<UnavailableProperties />} />
          <Route path="/admin" element={localStorage.getItem('token') ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/Pages/PropertyDetails/:id" element={<PropertyDetails />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        <WhatsAppButton />
      </div>
    </Router>
  );
}

export default Cancemi;
