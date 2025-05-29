import React, { useState, useEffect, useRef } from "react";
import { TextField, List, ListItem, Paper } from "@mui/material";

const AutocompleteAddressInput = ({ value, onPlaceSelected }) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [predictions, setPredictions] = useState([]);
  const autocompleteService = useRef(null);

  useEffect(() => {
    if (!window.google) {
      console.error("Google Maps JavaScript API no está cargada.");
      return;
    }
    autocompleteService.current = new window.google.maps.places.AutocompleteService();
  }, []);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (!autocompleteService.current) return;

    if (newValue.length > 2) {
      autocompleteService.current.getPlacePredictions(
        { input: newValue, types: ["address"], componentRestrictions: { country: "ar" } },
        (predictions, status) => {
          if (status !== window.google.maps.places.PlacesServiceStatus.OK || !predictions) {
            setPredictions([]);
            return;
          }
          setPredictions(predictions);
        }
      );
    } else {
      setPredictions([]);
    }
  };

  const handleSelect = (prediction) => {
    setInputValue(prediction.description);
    setPredictions([]);
    onPlaceSelected(prediction.description);
  };

  return (
    <div style={{ position: "relative" }}>
      <TextField
        label="Dirección"
        value={inputValue}
        onChange={handleChange}
        fullWidth
        autoComplete="off"
      />
      {predictions.length > 0 && (
        <Paper style={{ position: "absolute", zIndex: 10, width: "100%" }}>
          <List>
            {predictions.map((prediction) => (
              <ListItem
                button
                key={prediction.place_id}
                onClick={() => handleSelect(prediction)}
              >
                {prediction.description}
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </div>
  );
};

export default AutocompleteAddressInput;

