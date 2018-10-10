import { HttpObserve } from '@angular/common/http/src/client';
import { Injectable } from '@angular/core';
import { RequestConfig } from '@guavus/auth';
import { Observable } from 'rxjs/Observable';
import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';

export const HTTP_OBSERVE_TYPE: HttpObserve = 'body';
@Injectable()
export class DataService {
  constructor(private http: HttpClient) { }

  executeRequest(method: string, config:RequestConfig, responseType: HTTPResponseType, body?: any): Observable<any> {
    const httpHeaders: HttpHeaders = config.headers ? new HttpHeaders(config.headers) : undefined;
    const url: string = config.url;
    const isBodyRequired: boolean = ['POST', 'PUT', 'PATCH'].indexOf(method) !== -1;

    return this.http.request(method, url, {
      headers: httpHeaders,
      body: body,
      observe: HTTP_OBSERVE_TYPE,
      responseType: responseType.type
    });
  }
}
