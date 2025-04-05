import React, { useState } from 'react';
import '../Css/FormularioBusqueda.css';

const FormularioBusqueda = ({ onFilterChange }) => {
  const [zona, setZona] = useState('');
  const [estado, setEstado] = useState('');
  const [ambientes, setAmbientes] = useState('');

  const handleApplyFilters = () => {
    onFilterChange({
      zona,
      estado,
      ambientes: ambientes ? Number(ambientes) : null,
    });
  };

  return (
    <div className="Container-Form">
      <div className="formulario-container">
        <h2>Encontrá la propiedad ideal</h2>
        <h3>Descubrí el lugar perfecto para todas tus necesidades</h3>
        <form className="formulario-busqueda">
          <div className="input-group">
            <label>Ubicación</label>
            <input
              type="text"
              value={zona}
              onChange={(e) => setZona(e.target.value)}
              placeholder="Ej: Palermo, Tigre, etc."
            />
          </div>

          <div className="input-group">
            <label>Tipo de operación</label>
            <select value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="">Todas</option>
              <option value="Venta">Venta</option>
              <option value="Alquiler">Alquiler</option>
              <option value="Emprendimiento">Emprendimiento</option>
            </select>
          </div>

          <div className="input-group">
            <label>Ambientes</label>
            <input
              type="number"
              value={ambientes}
              onChange={(e) => setAmbientes(e.target.value)}
              placeholder="Ej: 2"
            />
          </div>

          <button type="button" className="button-home" onClick={handleApplyFilters}>
            Aplicar Filtros
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormularioBusqueda;
