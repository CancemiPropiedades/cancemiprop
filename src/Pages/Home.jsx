import React, { useEffect, useState } from 'react';
import PropertyList from '../Componentes/PropertyList';
import ImgInicio from '../Imagenes/boca-banner.jpg';
import '../Css/Home.css';
import axios from 'axios';

function Home() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:4001/api/propiedades');

        const propiedadesHabilitadas = response.data.filter(
          property => property.habilitada === true
        );

        setProperties(propiedadesHabilitadas);
      } catch (error) {
        console.error('Error al obtener propiedades:', error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div>
      <img src={ImgInicio} className='banner-img' alt="Imagen de inicio" />
      <PropertyList properties={properties} />
    </div>
  );
}

export default Home;