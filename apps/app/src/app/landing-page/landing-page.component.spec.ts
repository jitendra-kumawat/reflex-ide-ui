import { Location } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import {
  async,
  ComponentFixture,
  inject,
  TestBed
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ChangePasswordVO,
  UserDetails
} from '@guavus/auth';
import { MatDialogRef } from '@angular/material';
import {
  ABOUT_APP,
  AboutAppComponent,
  SmartComponentsModule
} from '@guavus/smart-components';
import {
  APP_PROJECT_CONFIG,
  appConfig,
  UrlBuilder
} from '@reflex-ide/common';
import { StoreModule } from '@ngrx/store';
import { applicationConfig } from './config';
import { LandingPageComponent } from './landing-page.component';


describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule.withRoutes(
          [{ path: 'lb', component: AboutAppComponent }]), SmartComponentsModule.forRoot(), StoreModule.forRoot({})],
        declarations: [LandingPageComponent],
        providers: [
          { provide: APP_PROJECT_CONFIG, useValue: { appName: 'test', copyright: '' } },
          { provide: ABOUT_APP, useValue: { copyRightLabel: '' } },
          UrlBuilder,
          { provide: MatDialogRef, useValue: {} }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    appConfig.project = TestBed.get(APP_PROJECT_CONFIG);
    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call openAbout()', async(() => {
    const evt = { data: { id: 'about_menuitem', label: 'About' } };

    spyOn(component, 'openAbout');
    component.menuItemSelectHandler(evt);
    fixture.whenStable().then(() => {

      expect(component.openAbout).toHaveBeenCalled();
    });
  }));

  it('should call doLogout()', async(() => {
    const evt = { data: { id: 'logout_menuitem', label: 'Logout' } };

    spyOn(component, 'doLogout');
    component.menuItemSelectHandler(evt);
    fixture.whenStable().then(() => {

      expect(component.doLogout).toHaveBeenCalled();
    });
  }));

  it('should call openChangePassword()', async(() => {
    const evt = { data: { id: 'change_password_menuitem', label: 'Change Password' } };

    spyOn(component, 'openChangePassword');
    component.menuItemSelectHandler(evt);
    fixture.whenStable().then(() => {

      expect(component.openChangePassword).toHaveBeenCalled();
    });
  }));

  it('should call openHelp()', async(() => {
    const evt = { data: { id: 'help_menuitem', label: 'Help' } };

    spyOn(component, 'openHelp');
    component.menuItemSelectHandler(evt);
    fixture.whenStable().then(() => {

      expect(component.openHelp).toHaveBeenCalled();
    });
  }));

  it('should modulechange  selection', async(inject([Location],
    (location: Location) => {
      const mevt = { data: { state: 'lb' } }
      component.moduleChangeHandler(mevt);
      fixture.whenStable().then(() => {
        expect(location.path()).toEqual('/lb');
      });
    })));

  it('should call onChangePasswordClick', async(() => {
    const evt: ChangePasswordVO = { newPassword: 'test', password: 'admin' };
    spyOn(component, 'onChangePasswordClick');
    component.onChangePasswordClick(evt);
    fixture.whenStable().then(() => {
      expect(component.onChangePasswordClick).toHaveBeenCalledWith(evt);
    });
  }));

  it('should call getUserName', async(() => {
    const evt: UserDetails = {
      id: 1, userId: 'admin', lastName: 'a', firstName: 'f', password: undefined, email: '',
      isEnabled: true,
      timezone: 'utc',
      imageUrl: '',
      roles: [],
      lastLoginTimestamp: undefined,
      lastLoginHost: undefined
    };
    const un = component.getUserName(evt);
    expect(un).toEqual('f a');
  }));

});
