import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  OnInit
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { getRequestConfig, UrlBuilder } from '@reflex-ide/common';

import { RootState, ApplicationState } from '../+state/application.interfaces';
import * as ApplicationActions from '../+state/application.actions';
import { getUserCountSelector } from '../+state/application.reducer';
import { UserCountStatus } from '../+state/application.init';
import { GET_USERS_COUNT_REQUEST } from './landing-screen-service-config';

@Component({
  selector: 'reflex-ide-landing-screen',
  templateUrl: './landing-screen.component.html',
  styleUrls: ['./landing-screen.component.less']
})
export class LandingScreenComponent implements OnInit {
  userCount: number;
  usersCount$: Observable<any>;
  constructor(private store: Store<RootState>,private urlbuilder: UrlBuilder) { }

  ngOnInit() {
    this.usersCount$ = this.store.select(getUserCountSelector);
    this.usersCount$.subscribe(this.onUserCountChange.bind(this));

    this.getUsersCount();
  }

  getUsersCount() {
    const requestConfig = getRequestConfig(GET_USERS_COUNT_REQUEST,this.urlbuilder);
    this.store.dispatch(new ApplicationActions.FetachUserCount(requestConfig));
  }

  onUserCountChange(userCount: any) {
    if (userCount) {
      this.userCount = userCount;
    }
    else {
      this.userCount = undefined;
    }
  }

}
