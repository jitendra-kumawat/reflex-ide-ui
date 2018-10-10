import { EndPointConfig } from '@reflex-ide/common';

export const GET_USERS_COUNT_REQUEST: EndPointConfig = {
  method: 'GET',
  apiName: 'getUsersCount',
  headers: {
    'content-type': 'application/json'
  }
};

export var DIRLIST_REQUEST: EndPointConfig = {
  method: 'GET',
  apiName: 'hosts/file',
  headers: {
    'content-type': 'application/json'
  }
};


export var CMD_REQUEST: EndPointConfig = {
  method: 'GET',
  apiName: 'hosts/cmd',
  headers: {
    'content-type': 'application/json'
  }
};



