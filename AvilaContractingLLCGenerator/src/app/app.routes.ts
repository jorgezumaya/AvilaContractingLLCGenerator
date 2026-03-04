import { Routes } from '@angular/router';
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
    loadComponent: () =>
      import('./pages/generator/generator.component').then(m => m.GeneratorComponent),
    resolve: { data: generatorResolver },
    title: 'Generator — Avila Contracting LLC',
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];
