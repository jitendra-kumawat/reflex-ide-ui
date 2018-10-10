import {EndPointConfig} from './endpoint-config';
import {ProjectConfig,APP_PROJECT_CONFIG} from './project-config';
import {RequestBuilder} from './request-builder';
import { inspect } from 'util';
import { Injectable, Inject } from '@angular/core';

@Injectable()
export class UrlBuilder {
  constructor(@Inject(APP_PROJECT_CONFIG) private config: ProjectConfig) { }

  getUrl(config: EndPointConfig): string {
    return RequestBuilder.getUrl(config, this.config);
  }
}
