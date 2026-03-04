import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // Auth0's AuthService is providedIn:'root' and requires browser-only deps
    // (Auth0ClientService) registered only in main.ts. Prerendering any route
    // that includes the sidebar would fail with NG0201 on the server.
    // All routes use Client render so the Angular shell is always served.
    path: '**',
    renderMode: RenderMode.Client,
  },
];
