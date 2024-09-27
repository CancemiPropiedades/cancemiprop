import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Home from './Pages/Home';
import Navbar from './Componentes/Navbar';
import Alquiler from './Pages/Alquiler';
import Venta from './Pages/Venta';
import AdminDashboard from './Pages/AdminDashboard';
import LoginPage from './Pages/LoginPage';
import PropertyDetails from './Pages/PropertyDetails';

function Cancemi() {

  // Función para verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  // Configurar interceptor de Axios para manejar el token y redirigir en caso de error de autenticación
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response, // Deja pasar las respuestas exitosas
      error => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token'); // Eliminar el token si es inválido o ha expirado
          window.location.href = '/login'; // Redirigir al login usando window.location
        }
        return Promise.reject(error);
      }
    );

    // Limpiar el interceptor al desmontar el componente
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Inicio" element={<Home />} />
          <Route path="/Detalles/:id" element={<PropertyDetails />} /> {/* Ruta dinámica */}
          <Route path="/Alquiler" element={<Alquiler />} />
          <Route path="/Venta" element={<Venta />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Ruta protegida para el dashboard de admin */}
          <Route
            path="/admin"
            element={isAuthenticated() ? <AdminDashboard /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default Cancemi;