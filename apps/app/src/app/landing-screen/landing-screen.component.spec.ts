import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed
  } from '@angular/core/testing';
import {
  APP_PROJECT_CONFIG,
  getRequestConfig,
  UrlBuilder
  } from '@reflex-ide/common';
import {
  Store,
  StoreModule
  } from '@ngrx/store';
import 'rxjs/add/observable/of';
import { GET_USERS_COUNT_REQUEST } from './landing-screen-service-config';
import { LandingScreenComponent } from './landing-screen.component';

import { reducers } from '../+state/application.interfaces';
import { metaReducers } from '../+state/application.interfaces';
import * as ApplicationActions from '../+state/application.actions';
import { UserCountStatus } from '../+state/application.init';
import { ApplicationState, RootState } from '../+state/application.interfaces';

const dummyUsers = { count: 101 };

describe('LandingScreenComponent', () => {
  let component: LandingScreenComponent;
  let fixture: ComponentFixture<LandingScreenComponent>;

  beforeEach(
    () => {
      TestBed.configureTestingModule({
        imports: [
          StoreModule.forRoot(reducers, { metaReducers }),
        ],
        declarations: [LandingScreenComponent],
        providers:[
          { provide: APP_PROJECT_CONFIG, useValue: {
            "appName": "Seed Application",
            "logo": "assets/images/guavusLogoLarge.png",
            "short_logo": "assets/images/guavus_logo.svg",
            "copyright": "© 2018 Guavus",
            "urls": {
              "auth": "/oauth/1",
              "base": "/",
              "um": "/api/v1"
            },
            "contextRoot": "/",
            "timezone": "GMT",
            "helpURL": "help/index.html",
            "authorization": "auth",
            "favicon": "default"
          } },
          UrlBuilder
        ],
        schemas: [NO_ERRORS_SCHEMA]
      })
        .compileComponents();
    });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingScreenComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getUsersCount', () => {
    const store = TestBed.get(Store);
    const requestConfig = getRequestConfig(GET_USERS_COUNT_REQUEST,component["urlbuilder"]);
    spyOn(store, 'dispatch');
    component['getUsersCount']();
    expect(store.dispatch).toHaveBeenCalledWith(new ApplicationActions.FetachUserCount(requestConfig));
  });

  it('should check success', () => {
    component.onUserCountChange(dummyUsers.count);
    expect(component.userCount).toEqual(dummyUsers.count);
    component.onUserCountChange(undefined);
    expect(component.userCount).toBeUndefined();
  })

});
