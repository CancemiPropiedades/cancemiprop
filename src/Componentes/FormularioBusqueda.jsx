import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Css/FormularioBusqueda.css';

function FormularioBusqueda() {
  const [ubicacion, setUbicacion] = useState('');
  const [tipo, setTipo] = useState('');
  const [ambientes, setAmbientes] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí más adelante iría la lógica para redirigir con filtros
    navigate('/alquileres', { state: { ubicacion, tipo, ambientes } });
  };

  return (
    <div className="formulario-container">
      <h1>Encuentra tu lugar ideal</h1>
      <h2>Descubre los mejores alojamientos que se adapten a tus necesidades</h2>
      <form onSubmit={handleSubmit} className="formulario-busqueda">
        <div className="input-group">
          <label htmlFor="ubicacion">Ubicación</label>
          <input
            type="text"
            id="ubicacion"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            placeholder="Ej. Buenos Aires"
          />
        </div>
        <div className="input-group">
          <label htmlFor="tipo">Tipo</label>
          <select
            id="tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="">Selecciona un tipo</option>
            <option value="ph">PH</option>
            <option value="apartamento">Apartamento</option>
            <option value="casa">Casa</option>
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="ambientes">Ambientes</label>
          <select
            id="ambientes"
            value={ambientes}
            onChange={(e) => setAmbientes(e.target.value)}
          >
            <option value="">Selecciona ambientes</option>
            <option value="1">1 Ambiente</option>
            <option value="2">2 Ambientes</option>
            <option value="3">3 Ambientes</option>
            <option value="4">4 Ambientes</option>
          </select>
        </div>
        <button type="submit">Buscar</button>
      </form>
    </div>
  );
}

export default FormularioBusqueda;