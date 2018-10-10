import { HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OfflineDataGenerator } from '@guavus/core';
import { OFFLINE_LOGIN_DATA } from './app-config';
import { EndPointConfig } from './endpoint-config';
import { UrlBuilder } from './url-builder';


@Injectable()
export class OfflineDataGeneratorService extends OfflineDataGenerator {
  constructor() {
    super(undefined);
  }

  readonly LOGIN_REQUEST: EndPointConfig = {
    method: 'POST',
    apiName: 'login',
    urlId: 'auth',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  };

  getFilePath(request: HttpRequest<any>): string {
    const fragment = this.getFragment(request.method, request.url);
    if (!fragment.endsWith('json') && fragment.indexOf(this.LOGIN_REQUEST.apiName) !== -1) {
      const body: string = request.body.toString();
      return this.createLoginResponseFilePath(body);
    }
    return super.getFilePath(request);
  }

  createLoginResponseFilePath(queryString:string): string {
    const users: Array<any> = OFFLINE_LOGIN_DATA.data || [];
    const params: HttpParams = new HttpParams({ fromString: queryString });
    const username = params.get('username');
    const password = params.get('password');
    const isExists = users.some(user => user.userName === username && user.password === password);
    return isExists ? './data/login/default.json' : './data/login/error.json';
  }
}
