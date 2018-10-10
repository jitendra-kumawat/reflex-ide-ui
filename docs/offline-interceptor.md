# Offline Interceptor

<!-- markdownlint-disable MD032 MD029 MD010 MD007-->
<!-- vscode-markdown-toc -->
* 1. [Introduction](#Introduction)
* 2. [Note](#Note)
* 3. [Making a request offline](#Makingarequestoffline)
* 4. [Making all the requests offline](#Makingalltherequestsoffline)
* 5. [Generating random data as response](#Generatingrandomdataasresponse)
	* 5.1. [Random data](#Randomdata)
	* 5.2. [Customizing random data](#Customizingrandomdata)
* 6. [Using file as response](#Usingfileasresponse)
	* 6.1. [JSON file as response](#JSONfileasresponse)
	* 6.2. [CSV file as default response](#CSVfileasdefaultresponse)
	* 6.3. [Updating file path and loading other file formats](#Updatingfilepathandloadingotherfileformats)
	* 6.4. [In case response file does not exist](#Incaseresponsefiledoesnotexist)
* 7. [Generating error for a response](#Generatingerrorforaresponse)
* 8. [Writing custom OfflineInterceptor](#WritingcustomOfflineInterceptor)
	* 8.1. [Use Cases](#UseCases)
		* 8.1.1. [Disable use file as response for all requests](#Disableusefileasresponseforallrequests)
		* 8.1.2. [Generate error instead of falling back to random data when response file not found](#Generateerrorinsteadoffallingbacktorandomdatawhenresponsefilenotfound)
		* 8.1.3. [Disable random data](#Disablerandomdata)
* 9. [Disabling offline interceptor](#Disablingofflineinterceptor)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

<!-- markdownlint-enable MD032 MD029 MD010 MD007-->

##  1. <a name='Introduction'></a>Introduction

Offline interceptor is an implementation of Angular's [HTTP Interceptor](https://angular.io/api/common/http/HttpInterceptor). Its purpose is to make the requests offline that means returning a user defined response or error for a http call without hitting any backend.

##  2. <a name='Note'></a>Note

`$PROJECT_HOME` is root directory of the project that contains `package.json`.

##  3. <a name='Makingarequestoffline'></a>Making a request offline

1. Add `is-offline` header to the http request and set its value to `true`.

    Sample: `getUserCount` request config

    ``` javascript
    export const GET_USERS_COUNT_REQUEST: EndPointConfig = {
      method: 'GET',
      apiName: 'getUsersCount',
      baseUrl: '/',
      headers: {
        'content-type': 'application/json',
        'is-offline': 'true'
      }
    };
    ```

##  4. <a name='Makingalltherequestsoffline'></a>Making all the requests offline

To make all the http requests offline, follow the steps described [here](./project.md#offline-application).

##  5. <a name='Generatingrandomdataasresponse'></a>Generating random data as response
  
###  5.1. <a name='Randomdata'></a>Random data

`OfflineInterceptor` checks for `use-file` header in a request, if it is `false` then it returns the random data as a response of that request.

Steps for generating random data

1. Set `use-file` to `false` in request config.
    ``` js
    export const GET_USERS_COUNT_REQUEST: EndPointConfig = {
      method: 'GET',
      apiName: 'getUsersCount',
      baseUrl: '/',
      headers: {
        'content-type': 'application/json',
        'use-file': 'false'
      }
    };
    ```

1. Open `$PROJECT_HOME/libs/common/src/offline-data-generator.service.ts`.

1. Define a function with same name as the `apiName`. For request config defined in previous code snippet create a function with name `getUsersCount`.

    ``` javascript
    @Injectable()
    export class OfflineDataGeneratorService extends OfflineDataGenerator {
      constructor() {
        super(undefined);
      }

      getUsersCount() {
        // Here goes your data generation logic.
      }
    }
    ```

###  5.2. <a name='Customizingrandomdata'></a>Customizing random data

When generating the random data, by default name of the random data generator function and the `apiName` should be the same. If you want `OfflineInterceptor` to call a user defined custom function, follow these steps

1. Create a service by extending `OfflineUtils`
    ``` js
    export class OfflineUtilsService extends OfflineUtils {
        constructor(private offlineDataGenerator: OfflineDataGenerator){
        }
    }
    ```
1. Override the `getRequestHandler` function from `OfflineUtils` and insert your logic. After that `OfflineInterceptor` will call your own fuction for a particular request.

    ``` js
    import { Injectable } from "@angular/core";
    import { HttpRequest } from "@angular/common/http";
    import { OfflineUtils, OfflineDataGenerator } from "@guavus/core";

    @Injectable()
    export class OfflineUtilsService extends OfflineUtils {
      constructor(private offlineDataGeneratorService: OfflineDataGenerator) {
        super(offlineDataGeneratorService);
      }

      getRequestHandler(request: HttpRequest<any>) {
        /* Separate the case of your targeted request. */
        /** Select getUsersCount request only **/
        if (request.url.includes('getUsersCount')) {

          /* Define name of your own function that you want to use to generate the data. */
          const dataGeneratorFunction = 'customGenerator';

          /* Make sure `customGenerator` function exist in '$PROJECT_HOME/libs/common/src/offline-data-generator.service.ts'. */
          /* Return the reference of your generator function */
          return this.offlineDataGeneratorService[dataGeneratorFunction].bind(this.offlineDataGeneratorService);
        } else {
          /* Let it handler other requests as usual. */
          return super.getRequestHandler(request);
        }
      }
    }

    ```

1. Make sure generator function `customGenerator` exist in `OfflineDataGeneratorService` located at `$PROJECT_HOME/libs/common/src/offline-data-generator.service.ts`. See [this](#Randomdata) for more details.

1. Go to `$PROJECT_HOME/apps/app/src/app/app.module.ts`.

1. Modify `OfflineUtils` entry in providers array to use new `OfflineUtilsService`

    ``` js
    @NgModule({
      providers: [
        { provide: OfflineUtils, useClass: OfflineUtilsService }
      ]
    })
    export class AppModule
    ```

##  6. <a name='Usingfileasresponse'></a>Using file as response

###  6.1. <a name='JSONfileasresponse'></a>JSON file as response

`OfflineInterceptor` returns file as response by default for an offline request. It looks for a `json` file with same name as `apiName` in `/apps/app/src/data` folder.

> Example: If request url is `/user-management/users` then it will looks for `users.json` file in `/apps/app/src/data` folder and returns it as a response of the request.

###  6.2. <a name='CSVfileasdefaultresponse'></a>CSV file as default response

By default `OfflineInterceptor` looks for json file in `apps/app/src/data` folder. Follow below steps to load a CSV file.

1. Open `$PROJECT_HOME/libs/common/src/offline-data-generator.service.ts`.

1. Override the behaviour of `getFilePath` function to always load CSV file.

    ``` js
    export class OfflineDataGeneratorService extends OfflineDataGenerator {
      /** Override the behaviour from base class **/
      getFilePath(request: HttpRequest<any>): string {
        /* Get the apiName */
        const fragment = this.getFragment(request.method, request.url);

        /* Will always return CSV file from "/apps/app/src/data" folder */
        return `./data/${fragment}.csv`;
      }
    ```

1. Override `getResponseType` function to return `text` instead of `json`.

    ```javascript
    getResponseType(request: HttpRequest<any>): 'json' | 'arraybuffer' | 'blob' | 'text' {
      return 'text';
    }
    ```

###  6.3. <a name='Updatingfilepathandloadingotherfileformats'></a>Updating file path and loading other file formats

Steps defined [here](#CSVfileasdefaultresponse) can be extended to load other file formats from location other than `apps/app/src/data`.

1. Open `$PROJECT_HOME/libs/common/src/offline-data-generator.service.ts`.

1. Override the behaviour of `getFilePath` function as per requirements.

    Sample example:

    ``` js
    export class OfflineDataGeneratorService extends OfflineDataGenerator {
      /** Override the behaviour from base class **/
      getFilePath(request: HttpRequest<any>): string {
        /* Get the apiName */
        const fragment = this.getFragment(request.method, request.url);

        /* In case of "getUsersCount" api call return a txt file. */
        if(request.url.includes('getUsersCount')) {
          return `./data/${fragment}.txt`;
        } else if(fragment === 'login') {
          // In case of `login` return login.json from different location `apps/app/src/data/login-data`
          return `./data/login-data/${fragment}.txt`;
        } else {
          /* Handler other requests as usual -> load json files.*/
          return super.getFilePath(request);
        }
      }
    }
    ```
  
1. Override `getResponseType` function to return `json`, `text` or `blob` based on file type.
    ``` javascript
    // For loading a csv files.
    getResponseType(request: HttpRequest<any>): 'json' | 'arraybuffer' | 'blob' | 'text' {
      return 'text';
    }

    // ...

    // For loading a excel files.
    getResponseType(request: HttpRequest<any>): 'json' | 'arraybuffer' | 'blob' | 'text' {
      return 'blob';
    }

    // ...

    // For loading a json files.
    getResponseType(request: HttpRequest<any>): 'json' | 'arraybuffer' | 'blob' | 'text' {
      return 'json';
    }
    ```

###  6.4. <a name='Incaseresponsefiledoesnotexist'></a>In case response file does not exist

When 'OfflineInterceptor' can not find the file to generate response it fallbacks to random data(see [this](#Randomdata)). Follow [here](#UseCase:Disableusefileasresponseforallrequests) to modify the behaviour.

##  7. <a name='Generatingerrorforaresponse'></a>Generating error for a response

Add following header in `RequestConfig` of a request to generate the error.

``` json
  {
    "generate-error": "true"
  }
```

##  8. <a name='WritingcustomOfflineInterceptor'></a>Writing custom OfflineInterceptor

1. Create a service by extending `OfflineInterceptor`

    ``` javascript
    export class OfflineInterceptorModified extends OfflineInterceptor {
      constructor( @Inject(IS_OFFLINE) private offline: boolean, private offlineutils: OfflineUtils) {
        super(offline, offlineutils);
      }
    }
    ```

1. Open `$PROJECT_HOME/apps/app/src/app/app.module.ts`.

1. Modify `HTTP_INTERCEPTOR` provider to use new `OfflineInterceptorModified`.

    ``` javascript
    @NgModule({
      providers: [
        { provide: HTTP_INTERCEPTORS, multi: true, useClass: OfflineInterceptorModified, deps: [IS_OFFLINE, OfflineUtils] },
      ]
    })
    export class AppModule
    ```

###  8.1. <a name='UseCases'></a>Use Cases

####  8.1.1. <a name='Disableusefileasresponseforallrequests'></a>Disable use file as response for all requests

  1. Create new interceptor as described [here](#WritingcustomOfflineInterceptor).

  1. Override `shouldLoadResponseFromFile` function from base class and modify it to return always `false`.

      ``` javascript
      // Decides whether to load the response from file or not.
      shouldLoadResponseFromFile(headers: HttpHeaders) {
        // Never load response from file.
        return false;
      }
      ```

####  8.1.2. <a name='Generateerrorinsteadoffallingbacktorandomdatawhenresponsefilenotfound'></a>Generate error instead of falling back to random data when response file not found

1. Create new interceptor as described [here](#WritingcustomOfflineInterceptor).

1. Override `onFileLoadFailure` function to throw error.
    ``` javascript
    onFileLoadFailure<T = any>(originalRequest: HttpRequest<T>) {
      // Build a error response.
      const customerror = this.buildErrorResponse(request);

      // Whenever a file is not found throw error.
      return Observable.throw(customError);
    }
    ```

####  8.1.3. <a name='Disablerandomdata'></a>Disable random data

1. Create new interceptor as described [here](#WritingcustomOfflineInterceptor).

1. Override `shouldLoadResponseFromFile` function to return `true`.
    ``` javascript
    onFileLoadFailure<T = any>(originalRequest: HttpRequest<T>) {
      return true;
    }
    ```

##  9. <a name='Disablingofflineinterceptor'></a>Disabling offline interceptor

To disable `OfflineInterceptor` remove its entry from providers array in `$PROJECT_HOME/apps/app/src/app/app.module.ts`

``` js
// Remove this line
@NgModule({
  // ...

  providers: [
    // Remove this entry.
    { provide: HTTP_INTERCEPTORS, multi: true, useClass: OfflineInterceptor, deps: [IS_OFFLINE, OfflineUtils] },
  ]

  // ...
})

export class AppModule
```
