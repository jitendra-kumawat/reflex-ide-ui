import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appConfig, ISOFFLINE, OFFLINE_LOGIN_DATA } from '@reflex-ide/common';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ConfigurationInitializer {
  constructor(private http: HttpClient) { }
  readonly files: Array<string> = ['about.json', 'build_info.json', 'config.json', 'login_config.json', 'timezones.json', 'auth_info.json', 'app_switcher.json'];

  run(): Promise<any> {
    if (ISOFFLINE) {
      this.files.push('login.json');
    }
    const promises: Array<Promise<any>> = [];
    for (const file of this.files) {
      const filepath = this.getFilePath(file);
      const promise = this.http
        .get(filepath)
        .toPromise()
        .then((value: any) => {
          this.onResolved(file, value)
        })
      promises.push(promise);
    }
    const waiton = Promise.all(promises);
    return waiton;
  }

  getFilePath(file: string): string {
    return file === 'login.json' ? './data/login.json' : `./config/${file}`;
  }

  onResolved(file: string, value: any): any {
    const key = file.split('.')[0];
    switch (key) {
      case 'config':
        const projectConfig = value;
        projectConfig.offline = ISOFFLINE;
        appConfig.project = projectConfig;
        break;
      case 'login':
        OFFLINE_LOGIN_DATA.data = value
        break;
      default:
        appConfig[key] = value;
    }
  }
}
