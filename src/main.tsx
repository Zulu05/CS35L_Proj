// External Dependencies
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Internal Dependences
import App from './App';

// Frontend
import './index.css';

// Get the root DOM element
const rootElement = document.getElementById('root') as HTMLElement;

// Create a React root and render the app
createRoot(rootElement).render(
  <BrowserRouter>
  <StrictMode>
    <App />
  </StrictMode>
  </BrowserRouter>
);
