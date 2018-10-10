import { EndPointConfig } from '@reflex-ide/common';

export const LOGIN_REQUEST: EndPointConfig = {
  method: 'POST',
  apiName: 'login',
  urlId: 'auth',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'generate-error': 'true',
  }
}
