import { useState } from "react";
import { Box, ToggleButtonGroup, ToggleButton, Typography } from "@mui/material";
import ResidentialPropertyForm from "./ResidentialPropertyForm";
import CommercialPropertyForm from "./CommercialPropertyForm";

const PropertyStepper = ({ cities }) => {
    const [propertyType, setPropertyType] = useState("residential");

    const handlePropertyAdded = () => {

    };

    return (
        <Box sx={{ width: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Formulario de Propiedad
            </Typography>

            <ToggleButtonGroup
                value={propertyType}
                exclusive
                onChange={(event, newType) => newType && setPropertyType(newType)}
                sx={{ mb: 2 }}
            >
                <ToggleButton value="residential">Residencial</ToggleButton>
                <ToggleButton value="commercial">Comercial</ToggleButton> 
            </ToggleButtonGroup>

            {propertyType === "residential" ? (
                <ResidentialPropertyForm onPropertyAdded={handlePropertyAdded} />
            ) : propertyType === "commercial" ? ( 
                <CommercialPropertyForm cities={cities} onPropertyAdded={handlePropertyAdded} />
            ) : null}

        </Box>
    );
};

export default PropertyStepper;