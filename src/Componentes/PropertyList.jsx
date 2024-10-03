import React, { useEffect, useState } from 'react';
import PropertyList from '../Componentes/PropertyList'; // Asegúrate de que esto sea la ruta correcta
import FormularioBusqueda from '../Componentes/FormularioBusqueda';
import ImgInicio from '../Imagenes/inicio.png';
import '../Css/Home.css';
import axios from 'axios';

function Home() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      const response = await axios.get('http://localhost:4000/api/propiedades');
      setProperties(response.data);
    };

    fetchProperties();
  }, []);

  return (
    <div>
      <h1>Bienvenido a Inmobiliaria</h1>
      <FormularioBusqueda />
      <img src={ImgInicio} alt="Imagen de inicio" />
      <PropertyList properties={properties} /> {/* Asegúrate de que aquí estés pasando las propiedades */}
    </div>
  );
}

export default Home;