import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'

const container = document.getElementById('root')!;

const AppWithProviders = (
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);

// For now, just use createRoot since we haven't implemented full SSR yet
// Later we can detect if content was server-rendered and use hydrateRoot
createRoot(container).render(AppWithProviders);
