import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  OnInit
  } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  getRequestConfig,
  UrlBuilder
  } from '@reflex-ide/common';
import { TreeModel } from 'ng2-tree';
import { Observable } from 'rxjs/Observable';
import { GET_USERS_COUNT_REQUEST } from './landing-screen-service-config';

import { RootState, ApplicationState } from '../+state/application.interfaces';
import * as ApplicationActions from '../+state/application.actions';
import { getUserCountSelector } from '../+state/application.reducer';
import { UserCountStatus } from '../+state/application.init';

@Component({
  selector: 'reflex-ide-landing-screen',
  templateUrl: './landing-screen.component.html',
  styleUrls: ['./landing-screen.component.less']
})
export class LandingScreenComponent implements OnInit {
  userCount: number;
  usersCount$: Observable<any>;
  constructor(private store: Store<RootState>,private urlbuilder: UrlBuilder) { }

  public tree: TreeModel = {
    value: 'Programming languages',
    children: [
      {
        value: 'Object-oriented',
        children: [{ value: 'Java' }, { value: 'C++' }, { value: 'C#' }]
      },
      {
        value: 'Prototype-based',
        children: [{ value: 'JavaScript' }, { value: 'CoffeeScript' }, { value: 'Lua' }]
      }
    ]
  };

  ngOnInit() {
    this.usersCount$ = this.store.select(getUserCountSelector);
    this.usersCount$.subscribe(this.onUserCountChange.bind(this));
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
