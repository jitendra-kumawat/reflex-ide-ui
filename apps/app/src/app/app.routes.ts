import {
  RouterModule,
  Routes
  } from '@angular/router';
import { LandingPageRoutes } from './landing-page/landing-page.routes';

export const routes: Routes = [
  // {
  //   path: 'login',
  //   loadChildren: '@reflex-ide/login-routing#LoginRoutingModule'
  // },
  ...LandingPageRoutes,
  { path: '', redirectTo: 'app', pathMatch: 'full' }
];
