import { Injectable, Optional } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';
import { UserStatus, RequestConfig, AuthClientInfo, Authenticate } from '@guavus/auth';
import { EndPointConfig } from '@reflex-ide/common';
import { UrlBuilder, getRequestConfig } from '@reflex-ide/common';
import { VALIDATE_SESSION_REQUEST } from './service-configs';
import { LoginState } from './+state/login.interfaces';
import { selectAuthStatus } from './+state/selectors';

@Injectable()
export class LoginService {
  constructor(private store: Store<{ login: LoginState }>, @Optional() private urlbuilder: UrlBuilder) { }

  isAuthenticated(): boolean {
    let isAutenenticated: boolean;
    this.store
      .select(selectAuthStatus)
      .map(status => status === UserStatus.AUTHENTICATED)
      .first()
      .subscribe(status => (isAutenenticated = status));
    return isAutenenticated;
  }
  authenticate$(clientDetails: AuthClientInfo): Observable<boolean> {
    this.store.dispatch(new Authenticate(getRequestConfig(VALIDATE_SESSION_REQUEST, this.urlbuilder), clientDetails));

    const isAuthenticated$ = this.store
      .select(selectAuthStatus)
      .filter(status => status !== UserStatus.PROCESSING)
      .map(status => status === UserStatus.AUTHENTICATED);
    return isAuthenticated$;
  }
}
