import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild
  } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef
  } from '@angular/material';
import {
  ActivatedRoute,
  Router
  } from '@angular/router';
import {
  AuthUtils,
  ChangePassword,
  ChangePasswordComponent,
  ChangePasswordVO,
  Logout,
  RequestConfig,
  UserDetails,
  UserStatus
  } from '@guavus/auth';
import {
  AppSwiticherData,
  MatAlertComponent,
  ModuleItem,
  NavbarItem,
  NavbarMenuItem
  } from '@guavus/smart-components';
import { Store } from '@ngrx/store';
import {
  appConfig,
  getRequestConfig,
  ProjectConfig,
  UrlBuilder
  } from '@reflex-ide/common';
import {
  CHANGE_PASSWORD_REQUEST,
  LOGOUT_REQUEST
  } from '@reflex-ide/login';
import { isNil } from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { applicationConfig } from './config';
import {
  ABOUT_MENUITEM_ID,
  CHANGE_PASSWORD_MENUITEM_ID,
  HELP_MENUITEM_ID,
  LOGOUT_MENUITEM_ID,
  PASSWORD_CHANGE_MESSAGE,
  POPUP_SUCCESS_TITLE
  } from './constants';
import {
  AboutAppComponent,
  HeaderComponent,
  updateYear,
  YEAR_IDENTIFIER,
} from '@guavus/smart-components';
import { ApplicationState } from '../+state/application.interfaces';

@Component({
  selector: 'reflex-ide-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.less']
})
export class LandingPageComponent implements OnInit, OnDestroy {

  // props
  statusChangeSubscription: Subscription;
  dataChangeSubscription: Subscription;
  alertPopupSubscription: Subscription;
  changePwdDialogSubscription:Subscription;

  // user props
  username: string;
  user: UserDetails;

  // header pros
  logo: string = undefined;
  appName: string = undefined;
  modules: Array<ModuleItem> = new Array(0);
  showSingleModule = false;
  rightMenu: Array<NavbarItem> = new Array(0);
  appSwitcherData: AppSwiticherData = undefined;

  // footer pros
  leftText;
  rightText;

  // children
  @ViewChild(HeaderComponent) header: HeaderComponent;

  private alertDialogRef: MatDialogRef<MatAlertComponent>;
  private changePwdDialogRef: MatDialogRef<ChangePasswordComponent>;

  constructor(public router: Router,
    private route: ActivatedRoute,
    private store: Store<ApplicationState>,
    private urlbuilder: UrlBuilder,
    public dialog: MatDialog) {
  }

  ngOnInit() {
    this.setBackgroundColor();
    // set header props
    this.setHeaderProps(appConfig.project);
    // set footer props
    this.setFooterProps(appConfig.project);

    this.addSubscriptions();
  }

  setBackgroundColor() {
    document.body.style.backgroundColor = 'transparent';
  }

  setHeaderProps(projectconfig: ProjectConfig) {
    const headerConfig = Object.assign({}, this.getAppConfig().header.options)
    this.logo = projectconfig ? projectconfig.short_logo : '';
    this.appName = projectconfig.appName;
    this.showSingleModule = headerConfig.showSingleModule;
    this.modules = headerConfig.modules;
    this.rightMenu = headerConfig.rightMenu;
   //  this.appSwitcherData = appConfig.app_switcher;
  }

  setFooterProps(projectconfig: ProjectConfig) {
    this.leftText = projectconfig.timezone;
    this.rightText = this.getCopyrightText(projectconfig);
  }

  getCopyrightText(projectconfig: ProjectConfig) {
    return updateYear(projectconfig ? projectconfig.copyright : '', YEAR_IDENTIFIER);
  }

  addSubscriptions() {
    //this.popup.close.subscribe(() => this.doLogout());
    this.dataChangeSubscription = this.route.data.subscribe(this.onDataChange.bind(this));
  }

  onDataChange(data: any) {
    if (data && data.auth) {
      this.onUserChange(data.auth.user);
      this.onAuthStatusChange(data.auth.status$);
    }
  }

  onAuthStatusChange(status$: any) {
    if (status$) {
      this.statusChangeSubscription = status$.subscribe(status => this.onStatusChange(status));
    }
  }

  onUserChange(user: UserDetails): void {
    if (isNil(user)) {
      return;
    }
    this.username = (user && user.userId) ? user.userId : '';
    this.user = user;
    // update footer props
    this.leftText = this.user.timezone;
    // update header props
    this.rightMenu[0].label = this.getUserName(user);

  }

  getUserName(userDetails: UserDetails): string {
    let name = '';

    if (userDetails) {
      // By default first name and last name will never be empty but still.
      const firstName: string = (userDetails.firstName === undefined || userDetails.firstName === null) ? '' : userDetails.firstName;
      const lastName: string = (userDetails.lastName === undefined || userDetails.lastName === null) ? '' : userDetails.lastName;
      name = firstName === lastName ? firstName.trim() : (firstName + ' ' + lastName).trim();
      name = (name !== '') ? name : userDetails.userId;
    }

    return name;
  }

  onStatusChange(status: UserStatus): void {
    switch (status) {
      case UserStatus.PASSWORD_CHANGED: {
        this.changePassword();
        break;
      }

      case UserStatus.UN_AUTHENTICATED: {
        this.onLogoutSuccess();
        break;
      }
    }
  }

  moduleChangeHandler(event: { data: ModuleItem }): void {
    const state: string = event.data.state;
    this.router.navigateByUrl(state);
  }

  showAlert(message: string, title?: string) {

    if(this.alertPopupSubscription) {
      this.alertPopupSubscription.unsubscribe();
    }

    const alertConfig: MatDialogConfig = new MatDialogConfig();
    alertConfig.width = '400px';
    alertConfig.autoFocus = false;
    alertConfig.data = {
      title: title,
      message: message,
    }

    this.alertDialogRef = this.dialog.open(MatAlertComponent, alertConfig);
    this.alertPopupSubscription = this.alertDialogRef.afterClosed().subscribe(() => this.doLogout());
  }

  menuItemSelectHandler(event: { data: NavbarMenuItem }): void {

    if (event === undefined || event.data === undefined) {
      this.showAlert('Invalid Option. Please contact Support.');
      return;
    }

    switch (event.data.id) {
      case CHANGE_PASSWORD_MENUITEM_ID:
        this.openChangePassword();
        break;
      case ABOUT_MENUITEM_ID:
        this.openAbout();
        break;
      case LOGOUT_MENUITEM_ID:
        this.doLogout();
        break
      case HELP_MENUITEM_ID:
        this.openHelp();
        break;
      default:
        this.showAlert('Invalid Option. Please contact Support.');
    }
  }

  openChangePassword(): void {
    const changePasswordDialogConfig:MatDialogConfig = new MatDialogConfig();
    changePasswordDialogConfig.width = '350px';
    changePasswordDialogConfig.autoFocus = false;
    changePasswordDialogConfig.data = {
      title: 'Change Password',
      username: this.username,
    }

    this.changePwdDialogRef = this.dialog.open(ChangePasswordComponent, changePasswordDialogConfig);
    this.changePwdDialogSubscription = this.changePwdDialogRef.componentInstance.submitted.subscribe((data) => {
      this.onChangePasswordClick(data);
    });
  }

  openAbout(): void {
    const aboutUsDialogConfig: MatDialogConfig = new MatDialogConfig();
    aboutUsDialogConfig.width = '500px';

    this.dialog.open(AboutAppComponent, aboutUsDialogConfig);
  }

  openHelp(): void {
    window.open('/help/index.html');
  }

  changePassword(): void {
    this.changePwdDialogRef.componentInstance.closeModal();
    this.showAlert(PASSWORD_CHANGE_MESSAGE, POPUP_SUCCESS_TITLE);
  }

  onLogoutSuccess(): void {
    window.open(document.baseURI, '_self');
  }

  onLogoutFail(err): void {
    this.showAlert(err, 'Error');
  }

  getAppConfig() {
    return applicationConfig.options;
  }

  doLogout(): void {
    // I thought to not use logout action here but decied against it. Adding and action to just dispatch this action on applicatipn level is overkill
    // We are not gaining any decoupling as we are moving all this dep in effects/reducers
    const logoutConfig = getRequestConfig(LOGOUT_REQUEST, this.urlbuilder);
    this.store.dispatch(new Logout(logoutConfig));
  }

  onChangePasswordClick(data: ChangePasswordVO) {
    const baseconfig = getRequestConfig(CHANGE_PASSWORD_REQUEST, this.urlbuilder);
    const config: RequestConfig = { url: baseconfig.url, headers: baseconfig.headers };
    config.url = AuthUtils.getChangePasswordUrl(this.user.id, config.url);
    config.payload = AuthUtils.getChangePasswordPayload(data.password, data.newPassword);
    this.store.dispatch(new ChangePassword(config));
  }

  removeSubscriptions() {
    if (this.dataChangeSubscription) {
      this.dataChangeSubscription.unsubscribe();
    }
    if (this.statusChangeSubscription) {
      this.statusChangeSubscription.unsubscribe();
    }
    if(this.alertPopupSubscription){
      this.alertPopupSubscription.unsubscribe();
    }
    if(this.changePwdDialogSubscription){
      this.changePwdDialogSubscription.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.removeSubscriptions();
  }
}
