import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

import { UserCountServcie } from '../landing-screen/user-count.service';
import * as ApplicationActions from '../+state/application.actions';
import { GET_USERS_COUNT_REQUEST } from '../landing-screen/landing-screen-service-config';

@Injectable()
export class ApplicationEffects {

  constructor(private actions$: Actions,private service: UserCountServcie) { }

  @Effect()
  getUserCount$ = this.actions$
      .ofType(ApplicationActions.FETCH_USER_COUNT)
      .switchMap((action:ApplicationActions.FetachUserCount) => this.service.fetch(GET_USERS_COUNT_REQUEST.method,action.config)
        .map( (response) => { console.log(response.count);
          return new ApplicationActions.FetachUserCountSuccess(response.count);
         })
        .catch( exception => Observable.of(new ApplicationActions.FetachUserCountFail()))
      );
}
