import React, { useEffect, useState } from 'react';
import PropertyList from '../Componentes/PropertyList';
import FormularioBusqueda from '../Componentes/FormularioBusqueda';
import ImgInicio from '../Imagenes/banner.webp';
import '../Css/Home.css';
import axios from 'axios';

function Home() {
  const [todasLasPropiedades, setTodasLasPropiedades] = useState([]);
  const [properties, setProperties] = useState([]);

  const aplicarFiltros = ({ zona, estado, ambientes }) => {
    const filtradas = todasLasPropiedades.filter((propiedad) => {
      const matchZona = zona
        ? propiedad.ubicacion?.toLowerCase().includes(zona.toLowerCase())
        : true;

      const matchEstado = estado
        ? propiedad.estado === estado
        : true;

      const matchAmbientes = ambientes
        ? propiedad.caracteristicas?.ambientes === Number(ambientes)
        : true;

      return matchZona && matchEstado && matchAmbientes;
    });

    setProperties(filtradas);
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:4001/api/propiedades');

        const propiedadesHabilitadas = response.data.filter(
          (property) => property.habilitada !== false
        );

        setTodasLasPropiedades(propiedadesHabilitadas);
        setProperties(propiedadesHabilitadas); // Mostrar todas por defecto
      } catch (error) {
        console.error('Error al obtener propiedades:', error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="home-container">
      <div className="banner-container">
        <img src={ImgInicio} className="banner-img" alt="Imagen de inicio" />
        <div className="form-overlay">
          <FormularioBusqueda onFilterChange={aplicarFiltros} />
        </div>
      </div>
      <PropertyList properties={properties} />
    </div>
  );
}

export default Home;