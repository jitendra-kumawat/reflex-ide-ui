import { Component, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, MemoizedSelector, createFeatureSelector, createSelector } from '@ngrx/store';
import { EndPointConfig } from '@reflex-ide/common';
import { LoginCredentials, Login as AuthLoginAction, AuthClientInfo, UserStatus, RequestConfig } from '@guavus/auth';
import { UrlBuilder, getRequestConfig, OFFLINE_LOGIN_DATA } from '@reflex-ide/common';
import { LoginState, Login } from '../+state/login.interfaces';
import { LOGIN_REQUEST } from './request-config';
import { selectAuthStatus } from '../+state/selectors';
import { INVALID_CREDENTIALS } from '../login-constants';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.less']
})
export class LoginPageComponent implements OnInit {
  logo: string;
  copyright: string;
  disclaimer: string;
  config: { logo: string; rightsText: string; disclaimerText: string; authClient: AuthClientInfo };
  clientDetails: AuthClientInfo;
  errorMessage = '';
  showLoginError = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<{ login: LoginState }>,
    @Optional() private urlbuilder: UrlBuilder
  ) {
    this.route.data.subscribe(this.updateLoginInfo.bind(this));
  }
  ngOnInit() {
    this.store.select(selectAuthStatus).subscribe(this.onUserStatusChange.bind(this));
  }
  private onUserStatusChange(status: UserStatus): void {
    if (status === UserStatus.AUTHENTICATED) {
      this.router.navigate(['/']);
    } else if (this.showLoginError && status === UserStatus.UN_AUTHENTICATED) {
      this.errorMessage = INVALID_CREDENTIALS;
    }
  }

  updateLoginInfo(data) {
    if (data && data.config) {
      this.config = data.config;
      this.logo = this.config.logo;
      this.copyright = this.config.rightsText;
      this.disclaimer = this.config.disclaimerText;
      this.clientDetails = this.config.authClient;
    }
  }

  onSignIn(credentials: LoginCredentials) {
    this.showLoginError = true;
    this.errorMessage = '';
    const config = getRequestConfig(LOGIN_REQUEST, this.urlbuilder);
    OFFLINE_LOGIN_DATA.username = credentials.username.trim();
    this.store.dispatch(new AuthLoginAction(credentials.username.trim(), credentials.password, config, this.clientDetails));
  }
}
