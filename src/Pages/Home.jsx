import React, { useEffect, useState } from 'react';
import PropertyList from '../Componentes/PaginatedPropertyList'; 
import FormularioBusqueda from '../Componentes/FormularioBusqueda';
import ImgInicio from '../Imagenes/inicio.png';
import '../Css/Home.css';
import axios from 'axios';

function Home() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/propiedades');
        
        // Filtrar solo las propiedades habilitadas
        const propiedadesHabilitadas = response.data.filter(property => property.habilitada === true);
        
        setProperties(propiedadesHabilitadas);
      } catch (error) {
        console.error('Error al obtener propiedades:', error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div>
      <FormularioBusqueda />
      <img src={ImgInicio} className='imgHome' alt="Imagen de inicio" />
      <PropertyList properties={properties} /> {/* O PaginatedPropertyList */}
    </div>
  );
}

export default Home;