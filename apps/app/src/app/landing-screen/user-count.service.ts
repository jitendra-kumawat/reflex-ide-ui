import { Injectable } from '@angular/core';
import { DataService } from '@reflex-ide/common';
import { RequestConfig } from '@guavus/auth';

@Injectable()
export class UserCountServcie {
  constructor(private dataService: DataService) {

  }

  fetch(method: string,requestConfig:RequestConfig) {
    const responseType: HTTPResponseType = { type: 'json' };
    return this.dataService.executeRequest(method,requestConfig ,responseType, {});
  }
}
