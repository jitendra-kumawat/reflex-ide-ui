import {
  APP_INITIALIZER,
  NgModule
  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import {
  Logout,
  RequestConfig
  } from '@guavus/auth';
import {
  AuthInterceptor,
  AuthTokenService
  } from '@guavus/auth-interceptor';
import {
  ErrorHandler,
  ErrorInterceptor,
  ErrorMessages,
  FAVICONS_CONFIG,
  FaviconService,
  IS_OFFLINE,
  OfflineDataGenerator,
  OfflineInterceptor,
  OfflineUtils
  } from '@guavus/core';
import {
  ABOUT_APP,
  SmartComponentsModule
  } from '@guavus/smart-components';
import {
  APP_PROJECT_CONFIG,
  appConfig,
  ApplicationCommonModule,
  ERROR_MESSAGES,
  ISOFFLINE,
  OfflineDataGeneratorService,
  RequestBuilder,
  TRACE_ROUTES,
  UrlBuilder
  } from '@reflex-ide/common';
import {
  LoginModule,
  LOGOUT_REQUEST
  } from '@reflex-ide/login';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import {
  Store,
  StoreModule
  } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NxModule } from '@nrwl/nx';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { AuthorizationGuard } from './authorization-guard';
import { ConfigurationInitializer } from './configuration-initializer';
import { AuthInfoResolver } from './landing-page/auth-info-resolver';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LandingScreenComponent } from './landing-screen/landing-screen.component';
import { UserCountServcie } from './landing-screen/user-count.service';
import { environment } from '../environments/environment';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
} from '@angular/common/http';

import { ApplicationEffects } from './+state/application.effects';
import { reducers, metaReducers, RootState } from './+state/application.interfaces';
import { MatDialogRef, MatDialog } from '@angular/material';


export const FAVICONS = {
  cacheBusting: true,
  icons: {
    default: { href: 'default.ico', type: 'image/x-icon' },
    profile: { href: 'profile.ico', type: 'image/x-icon' },
    alert: { href: 'assets/images/alert_png.png', type: 'image/png' }
  }
};
@NgModule({
  imports: [
    ApplicationCommonModule,
    SmartComponentsModule.forRoot(),
    LoginModule,
    BrowserModule,
    HttpClientModule,
    NxModule.forRoot(),
    // initial navigation is disabled as routings starts before  APP_INITIALZER finishes
    RouterModule.forRoot(routes, { enableTracing: TRACE_ROUTES, initialNavigation: 'disabled' }),
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([ApplicationEffects]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    StoreRouterConnectingModule,
    BrowserAnimationsModule
  ],
  declarations: [AppComponent, LandingPageComponent, LandingScreenComponent],
  bootstrap: [AppComponent],
  providers: [
    // Initalization providers
    {provide: MatDialogRef, useValue: {}},
    ConfigurationInitializer,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [ConfigurationInitializer, HttpClientModule],
      multi: true
    },
    // project level configrations
    { provide: APP_PROJECT_CONFIG, useFactory: projectFactory, deps: [APP_INITIALIZER] },
    { provide: ABOUT_APP, useFactory: aboutAPPFactory, deps: [APP_INITIALIZER] },
    // screen level providers
    UserCountServcie,
    //helpers
    { provide: UrlBuilder, useClass: UrlBuilder, deps: [APP_PROJECT_CONFIG] },
    //offline intercepting providers
    { provide: IS_OFFLINE, useValue: ISOFFLINE },
    { provide: HTTP_INTERCEPTORS, multi: true, useClass: OfflineInterceptor, deps: [IS_OFFLINE, OfflineUtils] },
    // error interceptor for new http client request
    { provide: HTTP_INTERCEPTORS, multi: true, useClass: ErrorInterceptor },
    { provide: OfflineDataGenerator, useClass: OfflineDataGeneratorService },
    OfflineUtils,
    // auth
    AuthorizationGuard,
    AuthInfoResolver,
    // application state mangment
    // Favicons,
    FaviconService,
    { provide: FAVICONS_CONFIG, useValue: FAVICONS },

    // autorization interceptor
    { provide: HTTP_INTERCEPTORS, multi: true, useClass: AuthInterceptor },
    AuthTokenService,
    // error message provider
    { provide: ERROR_MESSAGES, useValue: appConfig.errorMessages },
    // error handler
    {
      provide: ErrorHandler, useFactory: errorHandlerFactory,
      deps: [Store, ERROR_MESSAGES, MatDialog],
    },
  ]
})
export class AppModule { }

export function appInitializerFactory(initializer: ConfigurationInitializer) {
  return () => initializer.run();
}

export function projectFactory() {
  return appConfig.project;
}

export function aboutAPPFactory() {
  return Object.assign({}, appConfig.build_info, appConfig.about);
}

export function errorHandlerFactory(store: Store<RootState>, messages: ErrorMessages, dialog:MatDialog) {
  const errorHandler: ErrorHandler = new ErrorHandler(messages, dialog);
  const DEFAULT_ERROR_MESSAGE = 'Error in retrieving data';
  errorHandler.setLogoutHandler(() => {

    const logoutConfig: RequestConfig = {
      url: RequestBuilder.getUrl(LOGOUT_REQUEST, appConfig.project),
      headers: LOGOUT_REQUEST.headers,
      payload: undefined
    };

    store.dispatch(new Logout(logoutConfig))
  });

  errorHandler.setInvalidTokenHandler(() => {
    (appConfig.loginConfig['logoutRedirectUrl'] === 'self') ?
      window.open(document.baseURI, '_self') :
      window.open(appConfig.loginConfig['logoutRedirectUrl'], '_self');
  });

  errorHandler.setDefaultErrorMessage(DEFAULT_ERROR_MESSAGE);

  return errorHandler;
}
