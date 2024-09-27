import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './Cancemi'; // Aquí ya se está importando Cancemi que contiene la Navbar
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />  {/* Solo deja App aquí, ya incluye Navbar */}
  </React.StrictMode>
);

reportWebVitals();

