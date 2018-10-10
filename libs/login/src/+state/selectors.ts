import { MemoizedSelector, createSelector, createFeatureSelector } from '@ngrx/store';
import { UserStatus } from '@guavus/auth';
import { LoginState } from './login.interfaces';

export const selectLoginFeature: MemoizedSelector<{ login: LoginState }, LoginState> = createFeatureSelector('login');
export const selectAuthStatus: MemoizedSelector<{ login: LoginState }, UserStatus> = createSelector(
  selectLoginFeature,
  (state: LoginState) => state.auth.status
);
