// import React, { useState } from 'react';
// import axios from 'axios';

// const AddProperty = () => {
//     const [title, setTitle] = useState('');
//     const [description, setDescription] = useState('');
//     const [price, setPrice] = useState('');
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const token = localStorage.getItem('token'); // Asegúrate de que el token esté almacenado en el localStorage si usas autenticación

//         try {
//             // Realizar la solicitud POST para agregar la propiedad
//             const response = await axios.post('http://localhost:4000/api/propiedad', {
//                 title,
//                 description,
//                 price
//             }, {
//                 headers: {
//                     Authorization: `Bearer ${token}`  // Si usas autenticación JWT
//                 }
//             });

//             // Manejo del éxito
//             setSuccess('Propiedad agregada exitosamente');
//             setError('');  // Limpiar errores

//             // Limpiar los campos después de agregar
//             setTitle('');
//             setDescription('');
//             setPrice('');

//             console.log('Propiedad agregada:', response.data);
//         } catch (error) {
//             // Manejo del error
//             setError('Error al agregar la propiedad');
//             setSuccess('');
//             console.error('Error al agregar la propiedad:', error);
//         }
//     };

//     return (
//         <div>
//             <h2>Agregar Nueva Propiedad</h2>
//             <form onSubmit={handleSubmit}>
//                 <input
//                     type="text"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     placeholder="Título"
//                     required
//                 />
//                 <textarea
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     placeholder="Descripción"
//                     required
//                 />
//                 <input
//                     type="number"
//                     value={price}
//                     onChange={(e) => setPrice(e.target.value)}
//                     placeholder="Precio"
//                     required
//                 />
//                 <button type="submit">Agregar Propiedad</button>
//             </form>

//             {/* Mensajes de éxito o error */}
//             {success && <p style={{ color: 'green' }}>{success}</p>}
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//         </div>
//     );
// };

// export default AddProperty;