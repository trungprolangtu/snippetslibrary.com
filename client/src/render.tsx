import { render } from './server';
import type { HelmetServerState } from 'react-helmet-async';

export function renderPage(url: string, template: string) {
  const { html, helmetContext } = render(url);
  const helmet = (helmetContext as { helmet: HelmetServerState }).helmet;
  
  return template
    .replace('<!--app-head-->', helmet ? [
      helmet.title.toString(),
      helmet.meta.toString(),
      helmet.link.toString(),
      helmet.script.toString(),
    ].join('\n') : '')
    .replace('<!--app-html-->', html);
}
