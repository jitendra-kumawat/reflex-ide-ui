# HTTP Error Handling

<!-- markdownlint-disable MD032 MD029 MD010 MD007-->
<!-- vscode-markdown-toc -->

* 1. [Introduction](#Introduction)
* 2. [Note](#Note)
* 3. [Do not show error popup for a request](#Donotshowerrorpopupforarequest)
* 4. [Adding a new error code](#Addinganewerrorcode)
* 5. [Adding a new logout error code](#Addinganewlogouterrorcode)
* 6. [Adding a new Logout Handler](#AddinganewLogoutHandler)
* 7. [Changing the default error messages](#Changingthedefaulterrormessages)
* 8. [Using custom `ErrorHandler`](#UsingcustomErrorHandler)
* 9. [Custom Error popup](#CustomErrorpopup)
* 10. [Disable Error Interceptor](#DisableErrorInterceptor)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

<!-- markdownlint-enable MD032 MD029 MD010 MD007-->

##  1. <a name='Introduction'></a>Introduction

UI-Kit uses `ErrorInterceptor` for handling the errors produced by http requests.

ErrorInterceptor serves following purpose

* Filter out the failed http requests and extract their raw error response.
* Get the error code from raw error response and generate the user readable error.
* Generate a default error ('Error in retrieving data') message in case no error code is present in the error response.
* Show error popup.
* Based on error code, logout the user.

In more technical terms `ErrorInterceptor` passes raw error response of a failed http request to `ErrorHandler`. Then ErrorHandler uses `$PROJECT_HOME/libs/common/src/errorMessages.ts` to generate a user readable error messages and shows error popup as per configuration.

##  2. <a name='Note'></a>Note

`$PROJECT_HOME` is root directory of the project that contains `package.json`.

##  3. <a name='Donotshowerrorpopupforarequest'></a>Do not show error popup for a request

1. Open request config file of a request.
    > For example `getUsersCount` request open `$PROJECT_HOME/apps/app/src/app/landing-screen/landing-screen-service-config.ts`

1. Add a new header `show-popup` and set its value to `false`.

    ``` javascript
    export const GET_USERS_COUNT_REQUEST: EndPointConfig = {
      method: 'GET',
      apiName: 'getUsersCount',
      baseUrl: '/',
      headers: {
        'content-type': 'application/json',
        'show-popup': 'false'
      }
    };
    ```

1. By default error handler shows error popup for every request failure.

##  4. <a name='Addinganewerrorcode'></a>Adding a new error code

1. Open `$PROJECT_HOME/libs/common/src/errorMessages.ts`.

1. Add error code and correspoding error messages in `ERROR_MESSAGES` object like below.

    ``` javascript
    export const ERROR_MESSEGES = {
      // ...

      // Add new error code
      "CUSTOM_ERROR_CODE": "Custom error messages"
    }
    ```

##  5. <a name='Addinganewlogouterrorcode'></a>Adding a new logout error code

1. Add error code as per [this](#Addinganewerrorcode) if required.

1. Open `$PROJECT_HOME/apps/app/src/app/app.module.ts`.

1. Go to `errorHandlerFactory` function.

1. Add new error code using `addLogoutErrorCode` function.
    ``` javascript
    // Sample
    export function errorHandlerFactory(store: Store<RootState>, messages: ErrorMessages) {
      const newLogoutErrorCode = 'INVALIDE_TOKEN';
      errorHandler.addLogoutErrorCode(newLogoutErrorCode);

      // ...
      return errorHandler;
    }
    ```

##  6. <a name='AddinganewLogoutHandler'></a>Adding a new Logout Handler

1. Open `$PROJECT_HOME/apps/app/src/app/app.module.ts`.

1. Go to `errorHandlerFactory` function.

1. Function passed to `setLogoutHandler` function is logout handler that you can modify as per requirement.

    ``` javascript
    export function errorHandlerFactory(store: Store<RootState>, messages: ErrorMessages) {
      // Passing new logout handler as anonymous function.
      errorHandler.setLogoutHandler(() => {
        // Here goes your custom logout handler code.
      });
    }
    ```

##  7. <a name='Changingthedefaulterrormessages'></a>Changing the default error messages

When `ErrorHandler` can not find the error message corresponding to a error code or it can not find the error code at all, in that case it shows a default messsage that is "Error in retrieving data".

1. Open `$PROJECT_HOME/apps/app/src/app/app.module.ts`.

1. Go to `errorHandlerFactory` function.

1. Use `setDefaultErrorMessage` from `ErrorHandler` to update the default error message.

    ``` javascript
    export function errorHandlerFactory(store: Store<RootState>, messages: ErrorMessages) {
      const errorHandler: ErrorHandler = new ErrorHandler(messages);

      // Define the new default error message.
      const newDefaultErrorMessage = 'Http request failed to execute';

      // Update the value in ErrorHandler.
      errorHandler.setDefaultErrorMessage(newDefaultErrorMessage)

      // ...

      return errorHandler;
    }
    ```

##  8. <a name='UsingcustomErrorHandler'></a>Using custom `ErrorHandler`

1. Create your own custom `ErrorHandler` by extending the original one.

    ``` javascript
    export class CustomErrorHanlder extends ErrorHandler {

      // Define new default messages
      private newDefaultErrorMessage: String = 'New Default Error Messages';

      constructor(@Inject(ERROR_MESSAGES) private errorMessages: ErrorMessages) {
        super(errorMessages);
      }
    }
    ```

1. Make sure to define following functions when creating custom error handler because original one does not have its own implementation of these functions.
    * logoutHandler
    * invalidTokenHandler
  
    See full sample below:

    ``` javascript
    export class CustomErrorHanlder extends ErrorHandler {

      // Define new default messages
      private newDefaultErrorMessage: String = 'New Default Error Messages';

      constructor(@Inject(ERROR_MESSAGES) private errorMessages: ErrorMessages) {
        super(errorMessages);

        // Some examples.

        // Example:1. Override the default error message of base class.
        super.setDefaultErrorMessage(this.newDefaultErrorMessage);

        // Example:2. Set your custom logout handler function.
        super.setLogoutHandler(this.customLogoutHandler);

        // Example:3. Set your custom invalid token handler
        super.setInvalidTokenHandler(this.customInvalidTokenHandler);
      }

      customLogoutHandler() {
        // Here goes your custom code ...
      }

      customInvalidTokenHandler() {
        // Here goes your custom code ...
      }
    }
    ```

1. Open `$PROJECT_HOME/apps/app/src/app/app.module.ts`.

1. Change the `ErrorHandler` entry in providers list.

    ``` javascript
    @NgModule({
      providers: [
        // Other way is to use a factory provider and instead of creating an instance of ErrorHanlder
        // create an instance of CustomErrorHandler and return it.
        { provide: ErrorHandler, useClass: CustomErrorHandler }
      ]
    })
    ```

##  9. <a name='CustomErrorpopup'></a>Custom Error popup

1. Create custom error popup component by extending `AlertComponent`(from `@guavus/components`)

    Example:

    ``` javascript
    @Component({
      selector: 'custom-error-popup-component',
      templateUrl: 'custom-error-popup-component.html'
    })
    export class CustomErrorPopupComponent extends AlertComponent {
      constructor(){
        super();
      }

      // Here goes you custom code.
    }

    ```

1. Open `$PROJECT_HOME/apps/app/src/app/app.module.ts`.

1. Go to `errorHandlerFactory` function.

1. Use `setErrorPopup` function from `ErrorHandler` to configure new popup.

    ``` javascript
    export function errorHandlerFactory(store: Store<RootState>, messages: ErrorMessages) {
      const errorHandler: ErrorHandler = new ErrorHandler(messages);

      // Rest of the content.

      // Create a new popup component
      const newPopup = new CustomErrorPopupComponent();

      // Pass it to error handler to use.
      errorHandler.setErrorPopup(newPopup);

      // ...
      return errorHandler;
    }
    ```

##  10. <a name='DisableErrorInterceptor'></a>Disable Error Interceptor

`ErrorInterceptor` can not be removed directly because it is part of `@guavus/core` library package which contains many other utilities like `OfflineInterceptor` and also other packages depends on this.

But it can be disabled by removing its entry from providers list in `$PROJECT_HOME/apps/app/src/app/app.module.ts`

Example

``` javascript
@NgModule({
  providers: [
    // Remove this line
    { provide: HTTP_INTERCEPTORS, multi: true, useClass: ErrorInterceptor },
  ]
});

```
