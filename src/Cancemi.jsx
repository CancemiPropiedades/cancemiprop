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

function Cancemi() {
  const [filterType, setFilterType] = useState('');
  console.log(filterType)
  const handleFilterChange = (filterType) => {
    setFilterType(filterType); // Almacena el tipo de filtro seleccionado
  };

  // Configurar interceptor de Axios
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar onFilterChange={handleFilterChange} /> {/* Pasar el filtro */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/alquiler" element={<PropertySearchPage filterType="Alquiler" />} />
          <Route path="/venta" element={<PropertySearchPage filterType="Venta" />} />
          <Route path="/emprendimiento" element={<PropertySearchPage filterType="Emprendimiento" />} />
          <Route path="/quienes-somos" element={<QuienesSomos filterType="QuienesSomos" />} />
          <Route path="contacto" element={<FormContacto filterType="Contactanos"/>}/>
          <Route path="/admin" element={localStorage.getItem('token') ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/Pages/PropertyDetails/:id" element={<PropertyDetails />} />
        </Routes>
        <WhatsAppButton />
      </div>
    </Router>
  );
}

export default Cancemi;