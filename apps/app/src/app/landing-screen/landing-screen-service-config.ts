import { EndPointConfig } from '@reflex-ide/common';

export const GET_USERS_COUNT_REQUEST: EndPointConfig = {
  method: 'GET',
  apiName: 'getUsersCount',
  baseUrl: '/',
  headers: {
    'content-type': 'application/json'
  }
};
