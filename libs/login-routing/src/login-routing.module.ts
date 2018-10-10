import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { LoginPageComponent, LoginModule, ConfigResolver } from '@reflex-ide/login';

export const loginRoutingRoutes: Route[] = [
  {
    path: '',
    component: LoginPageComponent,
    pathMatch: 'full',
    resolve: { config: ConfigResolver }
  }
];

@NgModule({
  imports: [CommonModule, LoginModule, RouterModule.forChild(loginRoutingRoutes)]
})
export class LoginRoutingModule {}
