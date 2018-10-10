import { Injectable } from '@angular/core';
import { RequestConfig } from '@guavus/auth';
import { DataService } from '@reflex-ide/common';

@Injectable()
export class DirectoryServcie {
  constructor(private dataService: DataService) {

  }

  fetch(method: string, requestConfig:RequestConfig) {
    const responseType: HTTPResponseType = { type: 'json' };
    return this.dataService.executeRequest(method, requestConfig, responseType, {});
  }
}
