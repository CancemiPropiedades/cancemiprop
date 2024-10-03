import React, { useState } from 'react';
import Pagination from '@mui/material/Pagination';
import PropertyList from './PropertyList';

const PaginatedPropertyList = ({ properties }) => {
    const [page, setPage] = useState(1);
    const propertiesPerPage = 12;

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const startIndex = (page - 1) * propertiesPerPage;
    const endIndex = startIndex + propertiesPerPage;

    return (
        <div>
            <PropertyList properties={properties.slice(startIndex, endIndex)} />
            <Pagination
                count={Math.ceil(properties.length / propertiesPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
            />
        </div>
    );
};

export default PaginatedPropertyList;