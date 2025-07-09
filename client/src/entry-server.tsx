import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

interface RenderContext {
  url?: string;
  statusCode?: number;
  [key: string]: unknown;
}

export function render(url: string, context: RenderContext = {}) {
  const helmetContext = {};
  
  const html = renderToString(
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <MemoryRouter initialEntries={[url]}>
          <App />
        </MemoryRouter>
      </HelmetProvider>
    </StrictMode>
  );
  
  return { html, context, helmetContext };
}
