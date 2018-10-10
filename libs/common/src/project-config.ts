import { EndPointConfig } from './endpoint-config';
import { InjectionToken } from '@angular/core';
export interface ProjectConfig extends EndPointConfig {
  appName: string;
  copyright?: string;
  offline?: boolean;
  logo?: string;
  short_logo?: string;
  urls?: any;
  helpURL?: string;
  [key: string]: any;
}

export const APP_PROJECT_CONFIG = new InjectionToken<ProjectConfig>('APP_PROJECT_CONFIG');
