import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Get the root DOM element
const rootElement = document.getElementById('root') as HTMLElement;

// Create a React root and render the app
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
