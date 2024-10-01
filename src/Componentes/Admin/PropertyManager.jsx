// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const PropertyManager = ({ onPropertyAdded }) => {
//   const [propertyData, setPropertyData] = useState({
//     titulo: '',
//     ubicacion: '', // Dirección completa
//     precio: '',
//     tipo: '',
//     ciudad: '',
//     estado: 'Alquiler',
//     descripcion: '',
//     fotos: [],
//     caracteristicas: {
//       ambientes: 0,
//       banos: 0,
//       cochera: false,
//       aceptaMascotas: false,
//     },
//     latitud: '', // Para guardar latitud
//     longitud: '', // Para guardar longitud
//   });

//   const [newPhoto, setNewPhoto] = useState('');
//   const [cities, setCities] = useState([]);
//   const [newCity, setNewCity] = useState('');

//   useEffect(() => {
//     const fetchCities = async () => {
//       try {
//         const response = await axios.get('http://localhost:4000/api/cities');
//         setCities(response.data);
//       } catch (error) {
//         console.error('Error al cargar las ciudades:', error);
//       }
//     };

//     fetchCities();
//   }, []);

//   const handleChange = (e) => {
//     setPropertyData({
//       ...propertyData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleCaracteristicasChange = (e) => {
//     setPropertyData({
//       ...propertyData,
//       caracteristicas: {
//         ...propertyData.caracteristicas,
//         [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
//       },
//     });
//   };

//   const handleNewPhotoChange = (e) => {
//     setNewPhoto(e.target.value);
//   };

//   const addPhoto = () => {
//     if (newPhoto) {
//       setPropertyData((prevData) => ({
//         ...prevData,
//         fotos: [...prevData.fotos, newPhoto],
//       }));
//       setNewPhoto('');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     let cityId = propertyData.ciudad;

//     if (newCity) {
//       try {
//         const response = await axios.post('http://localhost:4000/api/cities', { name: newCity });
//         cityId = response.data._id;
//       } catch (error) {
//         console.error('Error al agregar la nueva ciudad:', error);
//         return;
//       }
//     }

//     try {
//       const geocodeResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
//         params: {
//           address: propertyData.ubicacion, // Usar `ubicacion` en lugar de `direccion`
//           key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
//         },
//       });

//       const location = geocodeResponse.data.results[0].geometry.location;

//       const response = await axios.post('http://localhost:4000/api/propiedades', {
//         ...propertyData,
//         ciudad: cityId,
//         latitud: location.lat,  // Guardar latitud obtenida
//         longitud: location.lng, // Guardar longitud obtenida
//       });

//       console.log('Propiedad agregada:', response.data);
//       onPropertyAdded(response.data);
//       setPropertyData({
//         titulo: '',
//         ubicacion: '',
//         precio: '',
//         tipo: '',
//         ciudad: '',
//         estado: 'Alquiler',
//         descripcion: '',
//         fotos: [],
//         caracteristicas: {
//           ambientes: 0,
//           banos: 0,
//           cochera: false,
//           aceptaMascotas: false,
//         },
//         latitud: '',
//         longitud: '',
//       });
//       setNewCity('');
//     } catch (error) {
//       console.error('Error al agregar la propiedad:', error);
//     }
//   };

//   return (
//     <div>
//       <h2>Agregar Propiedad</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="titulo"
//           value={propertyData.titulo}
//           onChange={handleChange}
//           placeholder="Título"
//           required
//         />
//         <input
//           type="text"
//           name="ubicacion"  // Cambiado a "ubicacion"
//           value={propertyData.ubicacion}
//           onChange={handleChange}
//           placeholder="Dirección"
//           required
//         />
//         <input
//           type="number"
//           name="precio"
//           value={propertyData.precio}
//           onChange={handleChange}
//           placeholder="Precio"
//           required
//         />
//         <textarea
//           name="descripcion"
//           value={propertyData.descripcion}
//           onChange={handleChange}
//           placeholder="Descripción"
//           required
//         />
//         <div>
//           <input
//             type="text"
//             value={newPhoto}
//             onChange={handleNewPhotoChange}
//             placeholder="URL de la foto"
//           />
//           <button type="button" onClick={addPhoto}>Agregar Foto</button>
//         </div>
//         <ul>
//           {propertyData.fotos.map((foto, index) => (
//             <li key={index}>{foto}</li>
//           ))}
//         </ul>
//         <div>
//           <label>Ambientes</label>
//           <input
//             type="number"
//             name="ambientes"
//             value={propertyData.caracteristicas.ambientes}
//             onChange={handleCaracteristicasChange}
//           />
//         </div>
//         <div>
//           <label>Baños</label>
//           <input
//             type="number"
//             name="banos"
//             value={propertyData.caracteristicas.banos}
//             onChange={handleCaracteristicasChange}
//           />
//         </div>
//         <div>
//           <label>
//             <input
//               type="checkbox"
//               name="cochera"
//               checked={propertyData.caracteristicas.cochera}
//               onChange={handleCaracteristicasChange}
//             />
//             Cochera
//           </label>
//         </div>
//         <div>
//           <label>
//             <input
//               type="checkbox"
//               name="aceptaMascotas"
//               checked={propertyData.caracteristicas.aceptaMascotas}
//               onChange={handleCaracteristicasChange}
//             />
//             Acepta Mascotas
//           </label>
//         </div>
//         <select
//           name="ciudad"
//           value={propertyData.ciudad}
//           onChange={handleChange}
//           required
//         >
//           <option value="">Selecciona una ciudad</option>
//           {cities.map((city) => (
//             <option key={city._id} value={city._id}>{city.name}</option>
//           ))}
//         </select>
//         <select
//           name="estado"
//           value={propertyData.estado}
//           onChange={handleChange}
//         >
//           <option value="Alquiler">Alquiler</option>
//           <option value="Venta">Venta</option>
//         </select>
//         <button type="submit">Agregar Propiedad</button>
//       </form>
//     </div>
//   );
// };

// export default PropertyManager;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal'; // Para el modal

Modal.setAppElement('#root'); // Necesario para accesibilidad

const PropertyManager = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
      const fetchProperties = async () => {
          try {
              const response = await axios.get('http://localhost:4000/api/propiedades', {
                  headers: { Authorization: `Bearer ${token}` }
              });
              setProperties(response.data);
          } catch (error) {
              console.error('Error al cargar las propiedades:', error);
          }
      };

      fetchProperties();
  }, [token]);

  const handleEdit = (property) => {
      setSelectedProperty(property);
      setIsModalOpen(true);
  };

  const closeModal = () => {
      setIsModalOpen(false);
      setSelectedProperty(null);
  };

  const handleSaveChanges = async () => {
      try {
          await axios.put(`http://localhost:4000/api/propiedades/${selectedProperty._id}`, selectedProperty, {
              headers: { Authorization: `Bearer ${token}` }
          });
          setProperties(properties.map(prop => (prop._id === selectedProperty._id ? selectedProperty : prop)));
          closeModal();
      } catch (error) {
          console.error('Error al guardar los cambios:', error);
      }
  };

  const handleDisable = async (id) => {
    try {
        await axios.put(`http://localhost:4000/api/propiedades/${id}`, { habilitada: false }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setProperties(properties.map(property => 
            property._id === id ? { ...property, habilitada: false } : property
        ));
    } catch (error) {
        console.error('Error al deshabilitar la propiedad:', error);
    }
};

  const handleDelete = async (id) => {
      try {
          await axios.delete(`http://localhost:4000/api/propiedades/${id}`);
          setProperties(properties.filter(property => property._id !== id));
      } catch (error) {
          console.error('Error al eliminar la propiedad:', error);
      }
  };

  return (
      <div>
          <h2>Gestionar Propiedades</h2>
          <ul>
              {properties.map(property => (
                  <li key={property._id}>
                      {property.titulo}
                      <button onClick={() => handleEdit(property)}>Editar</button>
                      <button onClick={() => handleDisable(property._id)}>Deshabilitar</button>
                      <button onClick={() => handleDelete(property._id)}>Eliminar</button>
                  </li>
              ))}
          </ul>

          {selectedProperty && (
              <Modal
                  isOpen={isModalOpen}
                  onRequestClose={closeModal}
                  contentLabel="Editar Propiedad"
                  className="modal"
              >
                  <h2>Editar Propiedad</h2>
                  <input
                      type="text"
                      value={selectedProperty.titulo}
                      onChange={e => setSelectedProperty({ ...selectedProperty, titulo: e.target.value })}
                      placeholder="Título"
                  />
                  <input
                      type="text"
                      value={selectedProperty.ubicacion}
                      onChange={e => setSelectedProperty({ ...selectedProperty, ubicacion: e.target.value })}
                      placeholder="Ubicación"
                  />
                  <input
                      type="number"
                      value={selectedProperty.precio}
                      onChange={e => setSelectedProperty({ ...selectedProperty, precio: e.target.value })}
                      placeholder="Precio"
                  />
                  <textarea
                      value={selectedProperty.descripcion}
                      onChange={e => setSelectedProperty({ ...selectedProperty, descripcion: e.target.value })}
                      placeholder="Descripción"
                  />
                  <button onClick={handleSaveChanges}>Guardar Cambios</button>
                  <button onClick={closeModal}>Cancelar</button>
              </Modal>
          )}
      </div>
  );
};

export default PropertyManager;