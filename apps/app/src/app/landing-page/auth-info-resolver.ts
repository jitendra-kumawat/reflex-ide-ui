import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from "@angular/router";
import { Injectable } from "@angular/core";
import { RootState } from "../+state/application.interfaces";
import { Store } from "@ngrx/store";
import { AuthState, selectUserState, UserDetails, UserStatus, selectStatusState } from "@guavus/auth";
import { Observable } from "rxjs/Observable";
import { OFFLINE_LOGIN_DATA, ISOFFLINE } from "@reflex-ide/common";

@Injectable()
export class AuthInfoResolver implements Resolve<any>{
  constructor(private store: Store<RootState>) { }
  resolve(route: ActivatedRouteSnapshot, routerState: RouterStateSnapshot) {
    let user: UserDetails
    const loginStore = this.store.select<{ auth: AuthState }>(state => state.login);

    loginStore.select(selectUserState).subscribe((_user) => user = _user);
    const status$: Observable<UserStatus> = loginStore.select(selectStatusState);
    if (ISOFFLINE && user) {
      user.userId = OFFLINE_LOGIN_DATA.username;
    }
    return { user: user, status$: status$ };
  }

}

