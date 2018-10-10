import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPageComponent } from './login-page.component';
import { KiwikAuthModule, UserStatus, AuthReducer } from '@guavus/auth';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { LoginState } from '../+state/login.interfaces';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  const reducers: ActionReducerMap<LoginState> = {
    login: s => s,
    auth: AuthReducer
  };
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          KiwikAuthModule,
          RouterTestingModule,
          StoreModule.forRoot(reducers, { initialState: { login: { auth: { user: null, status: UserStatus.UN_AUTHENTICATED } } } }),
        ],
        declarations: [LoginPageComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
