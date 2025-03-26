import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Componentes/Navbar';
import Home from './Pages/Home';
import PropertySearchPage from './Componentes/PropertySearchPage';
import AdminDashboard from './Pages/AdminDashboard';
import PropertyDetails from './Pages/PropertyDetails';
import Nosotros from './Pages/QuienesSomos';
import FormContacto from './Pages/Form-Contacto';
import WhatsAppButton from './Componentes/Botton-Whatsapp';
import LoginPage from './Pages/LoginPage';
import UnavailableProperties from './Pages/UnavailableProperties';
import ForgotPassword from './Componentes/ForgotPassword';
import ResetPassword from './Componentes/ResetPassword';

function Cancemi() {
  const [properties, setProperties] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [loadingProperties, setLoadingProperties] = useState(true); // Estado de carga

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:4001/api/propiedades');
        setProperties(response.data);
      } catch (error) {
        console.error('Error al obtener propiedades:', error);
      } finally {
        setLoadingProperties(false); // Actualizar el estado de carga
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
    return true; // Mostrar todas las propiedades si no hay filtro
  });

  const isAdminLoggedIn = localStorage.getItem('token');

  const shouldShowWhatsAppButton = !isAdminLoggedIn && (
    window.location.pathname === '/' ||
    window.location.pathname.startsWith('/alquiler') ||
    window.location.pathname.startsWith('/venta') ||
    window.location.pathname.startsWith('/emprendimiento') ||
    window.location.pathname.startsWith('/quienes_somos') ||
    window.location.pathname.startsWith('/contacto')
  );

  if (loadingProperties) {
    return <div>Cargando propiedades...</div>; // Mostrar mensaje de carga
  }

  return (
    <Router>
      <div className="App">
        <Navbar onFilterChange={handleFilterChange} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/alquiler" element={<PropertySearchPage filterType="alquiler" properties={filteredProperties} />} />
          <Route path="/venta" element={<PropertySearchPage filterType="venta" properties={filteredProperties} />} />
          <Route path="/emprendimiento" element={<PropertySearchPage filterType="emprendimiento" properties={filteredProperties} />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<FormContacto />} />
          <Route path="/no-disponible" element={<UnavailableProperties />} />
          <Route path="/admin" element={isAdminLoggedIn ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/Pages/PropertyDetails/:id" element={<PropertyDetails />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset/:token" element={<ResetPassword />} />
        </Routes>

        {shouldShowWhatsAppButton && <WhatsAppButton />}
      </div>
    </Router>
  );
}

export default Cancemi;