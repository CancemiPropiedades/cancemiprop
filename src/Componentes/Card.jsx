import React, { useEffect, useState } from 'react';
import { Link as LinkRouter } from 'react-router-dom';
import axios from 'axios';
import CarouselCard from './CarouselCard';
import '../Css/Card.css';

function Card() {
  const [properties, setProperties] = useState([]);  // Aquí almacenaremos las propiedades obtenidas desde la DB
  const [loading, setLoading] = useState(true); // Para mostrar el estado de carga

  // Función para obtener las propiedades desde la base de datos
  async function fetchProperties() {
    try {
      const propiedades = await axios.get('http://localhost:4000/api/propiedades'); // Cambia el puerto a 4000
      console.log('Propiedades obtenidas:', propiedades.data); // Verificar la respuesta aquí
      setProperties(propiedades.data); 
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener las propiedades', error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProperties(); // Llamamos a la función para obtener los datos cuando el componente se monta
  }, []);

  // Función para renderizar las propiedades obtenidas
  function renderProperties() {
    if (properties.length === 0) {
      return <p>No hay propiedades disponibles.</p>; // Si no hay propiedades
    }

    return (
      <div className="Container">
        {properties.map((property) => (
          <div className="card" key={property._id}>
            <h6>{property.ubicacion}</h6> {/* Asumiendo que tienes la ubicación en el campo `location` */}
            <CarouselCard images={property.images} /> {/* Muestra las imágenes si tienes un campo `images` */}
            <div>
            <h4 className='price'>{property.titulo}</h4>
              <h4 className="price">${property.precio}</h4> {/* Muestra el precio */}
              <div className="iconos">
                {/* Puedes ajustar la lógica para mostrar iconos según las características */}
                <h5>ICONOS</h5>
                <h5>ICONOS</h5>
                <h5>ICONOS</h5>
              </div>
              <h4>{property.description}</h4> {/* Muestra la descripción de la propiedad */}
            </div>
            <div className="ContainerDetails">
              <LinkRouter to={'../Pages/PropertyDetails/' + property._id}>
                <div className="buttonCard">VER MÁS</div>
              </LinkRouter>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bodyProperties">
      {loading ? (
        <div className="loading">Cargando propiedades...</div>  // Muestra un mensaje de carga
      ) : (
        renderProperties() // Muestra las propiedades una vez cargadas
      )}
    </div>
  );
}

export default Card;