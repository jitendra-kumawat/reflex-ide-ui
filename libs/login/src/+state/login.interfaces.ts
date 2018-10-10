import { AuthState } from '@guavus/auth';

// tslint:disable-next-line:no-empty-interface
export interface Login {
  // define state here
}

export interface LoginState {
  readonly login: Login;
  readonly auth: AuthState;
}
