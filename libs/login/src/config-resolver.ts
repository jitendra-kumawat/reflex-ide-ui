import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { appConfig } from '@reflex-ide/common';

@Injectable()
export class ConfigResolver implements Resolve<any> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const config = appConfig.login_config;
    config.authClient = appConfig.auth_info;
    return config;
  }
}
