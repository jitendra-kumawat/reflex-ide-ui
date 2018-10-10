import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  KiwikAuthModule,
  AuthService,
  AuthEffects
} from '@guavus/auth';
import { AuthTokenService } from '@guavus/auth-interceptor'
import { HttpClient } from '@angular/common/http';
import { ProjectConfig, EndPointConfig } from '@reflex-ide/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { loginInitialState } from './+state/login.init';
import { LoginPageComponent } from './login-page/login-page.component';
import { RouterModule } from '@angular/router';
import { ActionReducerMap } from '@ngrx/store/src/models';
import { LoginState, Login } from './+state/login.interfaces';
import { AuthReducer } from '@guavus/auth';
import { ConfigResolver } from './config-resolver';
import { LoginService } from './login.service';
import { CHANGE_PASSWORD_REQUEST } from './service-configs';
export function noopReducer(state, action) {
  return state;
}
export const reducers: ActionReducerMap<LoginState> = {
  login: noopReducer,
  auth: AuthReducer
};
@NgModule({
  imports: [
    CommonModule,
    KiwikAuthModule,
    StoreModule.forFeature('login', reducers, { initialState: loginInitialState }),
    EffectsModule.forFeature([AuthEffects])
  ],
  exports: [KiwikAuthModule],
  providers: [
    // Auth module
    AuthTokenService,
    AuthService,
    LoginService,
    ConfigResolver
  ],
  declarations: [LoginPageComponent]
})
export class LoginModule { }

