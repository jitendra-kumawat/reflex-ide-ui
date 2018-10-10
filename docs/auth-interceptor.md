# Auth Interceptor Module

AuthInterceptor is an implementation of HttpInterceptor it is used for following purpose

1. Add "Authorization" headers to all outgoing request unless in exception list.
1. If Authorization header already present in request then no modification is performed

After interception, the request contains an authorization header which looks something like below:

``` javascript
Authorization: Bearer <Credentials/token>
```

## Note

`$PROJECT_HOME` is root directory of the project that contains `package.json`.

## By-pass authorization header

To bypass Auth Interceptor request has to be added in `anonymousRequests` list as per below steps

1. Open `$PROJECT_HOME/apps/app/src/app/app.module.ts`.

1. Define list of anonymous requests.

    ``` javascript
    // Imports...

    // The values is an array of apiNames. Now it will not add any auth header for `version` and `authorize` api call like below.
    // http://localhost/user-management/version
    // http://localhost/user-management/oauth/authorize
    const anonymousRequests: String[] = [
      'version',
      'authorize',
      // ...
    ]
    // ...
    ```

1. Add `ANONYMOUS_GET_REQUESTS` provider which uses `anonymousRequests` defined above as its value.

    ``` javascript
    import { ANONYMOUS_GET_REQUESTS } from "@guavus/auth-interceptor";
    // ...
    @NgModule({
      // providers
      providers: [
        // ...
        provide: ANONYMOUS_GET_REQUESTS, useValue: anonymousRequests,
      ]
    });
    // ...
    ```

## Get Authorization token

1. Inject `AuthTokenService` dependency in the project.

    ``` javascript
    class RandomService {
      // Injec the AuthTokenService.
      constructor(private tokenService: AuthTokenService) {

      }
    }
    ```

1. Use `getToken` function to get the token whereever required.

    ``` javascript
    class RandomService {
      // Injec the AuthTokenService.
      constructor(private tokenService: AuthTokenService) {
        // Returns the token.
        const token: string = this.tokenService.getToken();
      }
      // ...
    }
    ```

## Set Authorization Token

1. Inject `AuthTokenService` in the project as defined in [here](#get-authorization-token)

1. Use `setToken` function to setup a new token

    ``` javascript
    // Sample
    class RandomService {
      // Injec the AuthTokenService.
      constructor(private tokenService: AuthTokenService) {
        // Sampe token
        const token = 'Bearer sdExdTsEdsgg';

        // Set token
        this.tokenService.getToken();
      }
      // ...
    }
    ```

## Remove Authorization Token

1. Inject `AuthTokenService` in the project as defined in [here](#get-authorization-token)

1. Use `clearToken` method to remove the token.

    ``` javascript
    // Sample
    class RandomService {
      // Injec the AuthTokenService.
      constructor(private tokenService: AuthTokenService) {
        // Sampe token
        const token = 'Bearer sdExdTsEdsgg';

        // Set token
        this.tokenService.getToken();
      }
      // ...
    }
    ```

## Custom Storage Service

1. Create new storage service by extending `AuthTokenService`.

    ``` javascript
    // Sample
    export class CustomStorageService extends AuthTokenService {
      // ...
      constructor(@Optional() @Inject(ANONYMOUS_GET_REQUESTS) private anonymous_requests: string[]) {
        super(anonymous_requests);
      }
      // ...
    }
    ```

1. Override various function like `getToken`, `setToken` and `clearToken` or add new methods as per requirements like below sample

    ``` javascript
    // Sample
    export class CustomStorageService extends AuthTokenService {
      // ...
      constructor(@Optional() @Inject(ANONYMOUS_GET_REQUESTS) private anonymous_requests: string[]) {
        super(anonymous_requests);
      }
      // ...

      getToken() {
        // Custom logic
      }

      setToken() {
        // Custom logic
      }

      // Any other logic
    }

    ```

1. Open `$PROJECT_HOME/apps/app/src/app/app.module.ts`
1. Modify `AuthTokenService` provider entry in `app.module.ts` to use `CustomStorageService`.

    ``` javascript
    // ...
    @NgModule({
      // ...
      providers: [
        { provide: AuthTokenService, useClass: CustomStorageService }
        // ...
      ]
      // ...
    })
    export class AppModule {
      // ...
    }
    ```
