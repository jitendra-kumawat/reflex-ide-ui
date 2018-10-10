# Login Configurations

<!-- markdownlint-disable MD032 MD029 MD010 MD007-->
<!-- vscode-markdown-toc -->
* 1. [Prerequisite](#Prerequisite)
* 2. [Note](#Note)
* 3. [Offline login](#Offlinelogin)
	* 3.1. [Add user for offline login](#Adduserforofflinelogin)
	* 3.2. [Remove user for offline login](#Removeuserforofflinelogin)
	* 3.3. [Update user details](#Updateuserdetails)
	* 3.4. [Per user response](#Peruserresponse)
* 4. [Online login](#Onlinelogin)
	* 4.1. [Configuration](#Configuration)
	* 4.2. [Custom Response handling](#CustomResponsehandling)
	* 4.3. [User Info interface](#UserInfointerface)
* 5. [Bypass login](#Bypasslogin)
	* 5.1. [online/offline mode](#onlineofflinemode)
	* 5.2. [offline mode: quick fix](#offlinemode:quickfix)
* 6. [Remove login module](#Removeloginmodule)
	* 6.1. [Removing login screen and dependecies](#Removingloginscreenanddependecies)
	* 6.2. [Update user-menu in header](#Updateuser-menuinheader)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

<!-- markdownlint-enable MD032 MD029 MD010 MD007-->


A project created using UI-kit will have login enabled by default.
The login will be offline/online as per [project configuration](project.md).

##  1. <a name='Prerequisite'></a>Prerequisite

* Project has been created using ui-kit (preffered) or adhere to ui-kit standards

##  2. <a name='Note'></a>Note

1. `$PROJECT_HOME` is root directory of the project that contains `package.json`.
1. `@projectname` is value of name tag from package.json.
    ```json
    {
      "name": "uikit",
      "version": "1.0.0",
    }
    ```
    * For above json `@projectname` will be `@uikit`

##  3. <a name='Offlinelogin'></a>Offline login

###  3.1. <a name='Adduserforofflinelogin'></a>Add user for offline login

  1. Open login.json located at `$PROJECT_HOME/apps/app/src/data/login.json`
  1. Create a user object as below
      ```json
        {
          "userName": "new-user",
          "password": "new-user-password"
        }
      ```
  1. Add this object into json array of file opened at step 1.

###  3.2. <a name='Removeuserforofflinelogin'></a>Remove user for offline login

  1. Open login.json located at `$PROJECT_HOME/apps/app/src/data/login.json`
  1. Remove desired user object from above file

###  3.3. <a name='Updateuserdetails'></a>Update user details
  
The default implementation provides single response for all offline login.
However this can be configured as oulined [here](#Peruserresponse).
The following steps are specific to update default response.

  1. Open default.json located at `$PROJECT_HOME/apps/app/src/data/login/default.json`
  1. You can modify the objects as desired. User details are available in property `userDetails`
  1. The object has structure as outlined [here](#UserInfointerface)

###  3.4. <a name='Peruserresponse'></a>Per user response

  1. Create a replica of default.json located at `$PROJECT_HOME/apps/app/src/data/login/default.json`
  1. Save the file as `$username.json` in directory `$PROJECT_HOME/apps/app/src/data/login/`. `$username` is placeholder for username like `myuser`
  1. Update the user details as per [above section](#Updateuserdetails).
  1. Follow the instruction outlined [here](offline-data.md#Configure-filepaths) to override `createLoginResponseFilePath` function as below
      ```javascript
        createLoginResponseFilePath(queryString:string): string {
            // We should return the $username.json rather than default.json

            return isExists ?`./data/login/$username.json` : './data/login/error.json';
        }
      ```

##  4. <a name='Onlinelogin'></a>Online login

###  4.1. <a name='Configuration'></a>Configuration

1. Open file config.json located at `$PROJECT_HOME/apps/app/src/config/config.json`
1. Update the auth url to Authorization endpoint
1. Update the um url to user managment endpoint
1. Sample configuration
    ```json
    {
      "appName": "projectname",
      // other entries
      "urls": {
        "auth": "url for oAuth server without trailing slash",
        "base": "/",
        "um": "url for oAuth server without trailing slash"
      },
      //other entries
    }
    ```
    * Authorization/User-managment endpoint can be of format specified [here](project.md#url-formats)

###  4.2. <a name='CustomResponsehandling'></a>Custom Response handling

Auth expect userdetails to be of particular format. As specfied [here](#UserInfointerface)

To convert your exiting reponse to align to ui-kit expectation follow the below procedure

1. Create a new auth service like CustomAuthService class inside login module. You can utilize angular cli for its generation.
    ```sh
      ng g s CustomAuth --app=login
    ```
1. Extend the `CustomAuth` from `AuthService`.
1. override `validateSession` and `login` function to do custom handling or any other function as needed
1. Sample implementation of custom auth service

    ```javascript
    export class CustomeAuthService extends AuthService {

      constructor(private http_:HttpClient) {
        super(http_);
      }

      validateSession<T extends UserDetails>(token: string, config: RequestConfig,
        clientDetails: AuthClientInfo): Observable<ValidateSessionResult<T>> {
          const httpHeaders: HttpHeaders = config.headers ? new HttpHeaders(config.headers) : undefined;
          //below is sample changes to update firstname property add a fullName property

          //You can avoid super call here and make http call yourself and post process as well

          return super.validateSession<T>(token,config,clientDetails).map( (response) => {
          response.userDetails.firstName = 'Arpit';
          response.userDetails['fullName'] = 'Arpit Agarwal'
          return response;
        }
        );
      }

      login<T extends UserDetails>(username: string, password: string, config: RequestConfig, clientDetails: AuthClientInfo): Observable<LoginResult<T>> {
        return super.login(username,password,config,clientDetails)
      }
    }
    ```
1. Add entry of custom-auth in index.ts of login module located at `$PROJECT_HOME/libs/login/index.ts`
    ```javascript
    export * from './src/custom-auth.service';
    ```
1. Update the providers of `login module` to provide newer implementation of Auth service
    1. Open login.module.ts located at `$PROJECT_HOME/libs/login/src/login.module.ts`
    1. Update the Auth service provide as below
        ```javascript
        import { CustomAuthService } from './custom-auth.service';

        @NgModule({
          // existing entries

          providers: [
            // Update Auth service provider as below. rest is intact

            {provide: AuthService, useClass: MyAuthService},

          ]
        })
        ```

###  4.3. <a name='UserInfointerface'></a>User Info interface

```javascript
export interface UserDetails {
    id?: number;
    userId: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    isEnabled: boolean;
    timezone: string;
    imageUrl: any;
    roles: Role[];
    group?: Group;
    applications?: Application[];
    isLdap?: boolean;
    lastModifiedTimestamp?: number;
    lastLoginTimestamp: any;
    lastLoginHost: any;
}
export interface Role {
    id?: number;
    role: string;
    permissions: Permission[];
}
export interface Group {
    id: number;
    name: string;
}
export interface Application {
    id: number;
    name: string;
    description: string;
    url: string;
    displayName?: string;
}
export interface Permission {
    id?: number;
    module?: string;
    service?: string;
    operations: string;
}
```

##  5. <a name='Bypasslogin'></a>Bypass login

###  5.1. <a name='onlineofflinemode'></a>online/offline mode

1. Open authorization-guard.ts located at `$PROJECT_HOME/apps/app/src/app/authorization-guard.ts`
1. Update the `canActivate` function to always return true
    ```javascript
        canActivate(route: ActivatedRouteSnapshot,  state: RouterStateSnapshot ): boolean | Observable<boolean> | Promise<boolean> {
          return true;
        }
    ```
1. Open auth-info-resolver.ts located at `$PROJECT_HOME/apps/app/src/app/landing-page/auth-info-resolver.ts`
1. Add an import for `UserStatus` and dummy login response
1. Update the `resolve` function to return an object with status of Authenticated with dummy user details
    ```javascript

      import { UserStatus } from '@guavus/auth';
      import { loginResponse } from '@guavus/core';

      resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot) {
        //existing code before return statment could be removed
        // loginResponse is a sample response you can create similar object and pass it here

      return { user: loginResponse.userDetails, status$: Observable.of(UserStatus.AUTHENTICATED)
     };

    ```

###  5.2. <a name='offlinemode:quickfix'></a>offline mode: quick fix

  1. Open the file service-configs.ts located at `$PROJECT_HOME/libs/login/src/service-configs.ts`
  1. Update the `VALIDATE_SESSION_REQUEST` to avoid session failure by changing `generate-error` header to `false`.
      ```javascript
          export const VALIDATE_SESSION_REQUEST: EndPointConfig = {
            method: 'POST',
            apiName: 'checkToken',
            urlId: 'auth',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              'generate-error': 'false', //This line is updated

              'show-popup': 'false',
              'use-file': 'false'
            }
          };
      ```
##  6. <a name='Removeloginmodule'></a>Remove login module

###  6.1. <a name='Removingloginscreenanddependecies'></a>Removing login screen and dependecies

1. Delete login module folder located at `$PROJECT_HOME/libs/login`
1. Delete login-routing module folder located at `$PROJECT_HOME/libs/login-routing`
1. Delete authorization-guard.ts located at `$PROJECT_HOME/apps/app/src/app/authorization-guard.ts`
1. Delete auth-info-resolver.ts located at `$PROJECT_HOME/apps/app/src/app/landing-page/auth-info-resolver.ts`
1. Open app.routes.ts located at `$PROJECT_HOME/apps/app/src/app/app.routes.ts`
    1. Remove routing to login module. Delete below code form the `routes` array
        ```javascript
        {
          path: 'login',
          loadChildren: '@projectname/login-routing#LoginRoutingModule'
        },
        ```
    1. Remove routing to login module. Delete below code form the `routes` array
        ```javascript
        {
          path: 'login',
          loadChildren: '@projectname/login-routing#LoginRoutingModule'
        },
        ```
1. Open landing-page.routes.ts located at `$PROJECT_HOME/apps/app/src/app/landing-page/landing-page.routes.ts`
    1. Remove imports of `authorization-guard` and `auth-info-resolver`
        ```javascript
        import { AuthorizationGuard } from '../authorization-guard';
        import { AuthInfoResolver } from './auth-info-resolver';
        ```
    1. Remove `AuthorizationGuard` from canActivate guard. Remove the guard completely if it is an empty array after the change
          ```javascript
          export const LandingPageRoutes: Routes = [
            //...

            canActivate: [AuthorizationGuard], //remove this line
            //...
          ```
    1. Remove `AuthInfoResolver` from resolve. Remove the resolve property if it is an empty object
          ```javascript
          export const LandingPageRoutes: Routes = [
            //...

            resolve: { auth: AuthInfoResolver }, //remove this line
            //...
          ```

1. Open app.module.ts located at `$PROJECT_HOME/apps/app/src/app/app.module.ts`
    1. Remove imports of `@projectname/login` from file like
        ```javascript
        import { LoginModule, LOGOUT_REQUEST } from '@projectname/login';
        ```
    1. Remove imports of `./authorization-guard` and `./landing-page/auth-info-resolver` from file like
        ```javascript
        import { AuthInfoResolver } from './landing-page/auth-info-resolver';
        import { AuthorizationGuard } from './authorization-guard';
        ```
    1. Remove `LoginModule` from imports property in `@Ngmodule` declaration
    1. Remove `AuthorizationGuard` and `AuthInfoResolver` from providers property in `@Ngmodule` declaration
    1. Update `errorHandlerFactory` to set `noop` as logout handler
        ```javascript
            export function errorHandlerFactory(store: Store<RootState>, messages: ErrorMessages) {
                errorHandler.setLogoutHandler(() => {});
            }
        ```
    1. Remove any other error occured due to unavailability of login module
1. Open landing-page.component.ts located at `$PROJECT_HOME/apps/app/src/app/landing-page/landing-page.component.ts`
    1. Remove imports of `@projectname/login` from file like
        ```javascript
        import { CHANGE_PASSWORD_REQUEST, LOGOUT_REQUEST } from '@projectname/login';
        ```
    1. Remove `ChangePasswordComponent` declaration as view child
        ```javascript
        //remove below line

        @ViewChild(ChangePasswordComponent) changePwd: ChangePasswordComponent;
        ```
    1. Remove function `onChangePasswordClick` or any function bind to `submit` output of gvs-change-password component
    1. Update `menuItemSelectHandler` or function bind to `onMenuItemSelect` output of `gvs-header`
        1. Remove Change Password handler
        1. Remove Logout handler
        ```javascript
        menuItemSelectHandler(event: { data: NavbarMenuItem }): void {
          switch (event.data.id) {
            // Remove below cases from the function

            case CHANGE_PASSWORD_MENUITEM_ID:
              this.openChangePassword();
              break;
            case LOGOUT_MENUITEM_ID:
              this.doLogout();
            break
          }
        }
        ```
    1. Remove function used in above steps like `openChangePassword` and  `doLogout`
    1. Remove function `changePassword`, `onStatusChange`, `onLogoutSuccess`, `onLogoutFail`, `onAuthStatusChange`, `onDataChange`, `onUserChange`, `getUserName`, `addSubscriptions`
    1. Update `ngOnInit` to remove call for `addSubscriptions`

1. Open landing-page.component.html located at `$PROJECT_HOME/apps/app/src/app/landing-page/landing-page.component.html`
    * Remove HTML tag `gvs-change-password` from the template
        ```html
          <gvs-change-password #changepwd [username]='username' (submitted)='onChangePasswordClick($event)'></gvs-change-password>
        ```
1. Open application.interfaces.ts located at `$PROJECT_HOME/apps/app/src/app/+state/application.interfaces.ts`
    1. Remove imports of `@projectname/login` from file like
        ```javascript
        import { LoginState } from '@projectname/login';
        ```
    1. Remove login state from `RootState`

###  6.2. <a name='Updateuser-menuinheader'></a>Update user-menu in header

1. Remove the `ChangePassword` and `Logout` from user menu in header
    1. Open file config.ts located at `$PROJECT_HOME/apps/app/src/app/landing-page/config.ts`
    1. Remove `menu` options in above config at `options.header.options.rightMenu.menu`

1. Updating default user text in user menu in header
    1. Open file config.ts located at `$PROJECT_HOME/apps/app/src/app/landing-page/config.ts
    1. Update rightMenu label to desired value `options.header.options.rightMenu.label`
1. Removing the user-menu
    1. Open file config.ts located at `$PROJECT_HOME/apps/app/src/app/landing-page/config.ts
    1. Remove the first entry in rightMenu with label as `admin`
