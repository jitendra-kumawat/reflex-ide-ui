import { ProjectConfig } from './project-config';
export interface ApplicationConfig {
  about?: any;
  login_config?: any;
  project?: ProjectConfig;
  timezones?: Array<string>;
  auth_info?: any;
  build_info?: any;
  [key:string]: any;
}
