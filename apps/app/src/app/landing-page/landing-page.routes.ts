import { Routes } from '@angular/router';
import { AuthInfoResolver } from './auth-info-resolver';
import { LandingPageComponent } from './landing-page.component';
import { AuthorizationGuard } from '../authorization-guard';
import { LandingScreenComponent } from '../landing-screen/landing-screen.component';

export const LandingPageRoutes: Routes = [
  {
    path: 'app',
    component: LandingPageComponent,
    children: [
      {
        path: '',
        component: LandingScreenComponent,
        pathMatch: 'full'
      }
    ],
    // canActivate: [AuthorizationGuard],
    // resolve: { auth: AuthInfoResolver }
  }
];
