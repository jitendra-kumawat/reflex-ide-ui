import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { appConfig } from '@reflex-ide/common';
import { LoginService } from '@reflex-ide/login';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private router: Router, private service: LoginService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return this.authenticate$(route, state);
  }

  private authenticate$(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    const isAutenticated = this.service.isAuthenticated();
    if (isAutenticated) {
      return true;
    }
    const isAuthenticated$: Observable<boolean> = this.service.authenticate$(appConfig.auth_info);
    isAuthenticated$.subscribe(value => {
      if (value === false) this.router.navigate(['/login']);
    });
    return isAuthenticated$;
  }
}
