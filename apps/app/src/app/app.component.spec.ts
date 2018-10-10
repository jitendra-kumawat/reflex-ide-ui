import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { appConfig } from '@reflex-ide/common';
import { FaviconService, FAVICONS_CONFIG, ERROR_MESSAGES, ErrorHandler } from '@guavus/core';
import { CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        providers: [
          FaviconService,
          {
            provide: FAVICONS_CONFIG,
            useValue: {
              cacheBusting: true,
              icons: {
                default: { href: 'favicon.ico', type: 'image/x-icon' },
                profile: { href: 'profile.ico', type: 'image/x-icon' },
                alert: { href: 'assets/images/alert_png.png', type: 'image/png' },

              }
            }
          },
          { provide: ERROR_MESSAGES, useValue: { } },
          { provide: ErrorHandler, useValue: jasmine.createSpyObj('errorHandler', ['setErrorPopup','setDefaultErrorMessage'])}
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        declarations: [AppComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    const DEFAULT_ERROR_MESSAGE = 'Error in retrieving data';
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    const tokenService = TestBed.get(ErrorHandler);
      tokenService.setErrorPopup.and.returnValue();
      tokenService.setDefaultErrorMessage.and.returnValue(DEFAULT_ERROR_MESSAGE);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should give correct app title', () => {
    const oldConfig = appConfig.project;
    appConfig.project = { appName: 'Seed App' };
    expect(component.getAppTitle()).toEqual('Seed App');
    appConfig.project = { appName: undefined };
    expect(component.getAppTitle()).toEqual('');
    appConfig.project = undefined;
    expect(component.getAppTitle()).toEqual('');
    appConfig.project = oldConfig;
  });
  it('should give correct favicon', () => {
    const oldConfig = appConfig.project;
    appConfig.project = { appName: 'Seed App', favicon: 'profile' };
    expect(component.getFavicon()).toEqual('profile');
    appConfig.project = { appName: 'seed' };
    expect(component.getFavicon()).toEqual('default');
    appConfig.project = undefined;
    expect(component.getFavicon()).toEqual('default');
    appConfig.project = oldConfig;
  });
});
