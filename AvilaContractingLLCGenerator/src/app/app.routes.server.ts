import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'home',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'about',
    renderMode: RenderMode.Prerender,
  },
  {
    // Generator uses MatDialog + window.open() — browser-only APIs.
    // Client render avoids SSR crashes from window/document access.
    path: 'generator',
    renderMode: RenderMode.Client,
  },
  {
    // Catch-all: generates an Angular shell index.html for any path
    // (including the root redirect '' → /home) so GitHub Pages never 404s.
    path: '**',
    renderMode: RenderMode.Client,
  },
];
