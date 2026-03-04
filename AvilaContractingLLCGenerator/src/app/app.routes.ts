import { Routes } from '@angular/router';
import { authGuardFn } from '@auth0/auth0-angular';
import { homeResolver } from './resolvers/home.resolver';
import { aboutResolver } from './resolvers/about.resolver';
import { generatorResolver } from './resolvers/generator.resolver';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent),
    resolve: { data: homeResolver },
    title: 'Home — Avila Contracting LLC',
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about.component').then(m => m.AboutComponent),
    resolve: { data: aboutResolver },
    title: 'About Us — Avila Contracting LLC',
  },
  {
    path: 'generator',
    canActivate: [authGuardFn],
    loadComponent: () =>
      import('./pages/generator/generator.component').then(m => m.GeneratorComponent),
    resolve: { data: generatorResolver },
    title: 'Generator — Avila Contracting LLC',
  },
  {
    // Auth0 redirect_uri lands here. No guard — auth0-angular reads ?code & ?state
    // from the URL, processes the callback, then AppComponent.appState$ navigates
    // to the originally-requested route (e.g. /generator).
    path: 'callback',
    loadComponent: () =>
      import('./pages/callback/callback.component').then(m => m.CallbackComponent),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];
