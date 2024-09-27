import React from 'react';
import { Link } from 'react-router-dom';

const SearchResults = ({ results }) => {
    return (
        <div>
            {results.length === 0 ? (
                <p>No se encontraron propiedades.</p>
            ) : (
                <div>
                    {results.map((propiedad) => (
                        <div key={propiedad.id}>
                            <img src={propiedad.url_foto_principal} alt={propiedad.titulo} />
                            <h2>{propiedad.titulo}</h2>
                            <p>{propiedad.ubicacion}</p>
                            <p>{propiedad.precio}</p>
                            <Link to={`/publicacion/${propiedad.id}`}>Ver detalles</Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchResults;