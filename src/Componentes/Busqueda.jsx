import React, { useState } from 'react';
import PropertySearch from './PropertySearch';
import SearchResults from './SearchResults';

const Busqueda = () => {
    const [results, setResults] = useState([]);

    const handleSearch = async (searchResults) => {
        setResults(searchResults);
    };

    return (
        <div>
            <PropertySearch onSearch={handleSearch} />
            <SearchResults results={results} />
        </div>
    );
};

export default Busqueda;