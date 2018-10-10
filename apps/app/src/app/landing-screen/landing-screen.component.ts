import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  OnInit,
  ElementRef
  } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  getRequestConfig,
  UrlBuilder
  } from '@reflex-ide/common';
import {
  NodeEvent,
  TreeModel
  } from 'ng2-tree';
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

  isDirectorySelected = true;
  isNodeSelected = false;
  isSettingSelected = false;

  constructor(private store: Store<RootState>, private urlbuilder: UrlBuilder,private elementRef: ElementRef) { }

  historyData:any = [];

  public tree: TreeModel = {
    value: 'Programming languages',
    additionalData: 'folder',
    settings: {
      'isCollapsedOnInit': true
    },
    children: [
      {
        value: 'Object-oriented',
        additionalData: 'folder',
        children: [{ value: 'Java' }, { value: 'C++' }, { value: 'C#' }]
      },
      {
        value: 'Prototype-based',
        additionalData: 'folder',
        children: [{ value: 'JavaScript' }, { value: 'CoffeeScript' }, { value: 'Lua' }]
      }
    ]
  };

  ngOnInit() {
    this.elementRef.nativeElement.getElementsByClassName('tree-content')[0].style.display ='none';
    this.elementRef.nativeElement.getElementsByClassName('node-content')[0].style.display ='';
    this.elementRef.nativeElement.getElementsByClassName('history-content')[0].style.display ='none';
    this.elementRef.nativeElement.getElementsByClassName('settings-content')[0].style.display ='none';
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

  updateTreeModel() {

  }

  handleSelected(event: NodeEvent) {
    if (event.node.node.additionalData === 'folder') {
      this.handleFolderSelection();
    } else {
      this.handleFileSelection();
    }
  }

  handleFileSelection() {
    console.log('file selected')
  }

  handleFolderSelection() {
    console.log('folder selected');
  }

  onSearch(value) {
    console.log(value.target.value);
  }

  navTabClick(key)
  {

    switch (key) {
      case 'tree-content':
       this.elementRef.nativeElement.getElementsByClassName('tree-content')[0].style.display ='';
       this.elementRef.nativeElement.getElementsByClassName('node-content')[0].style.display ='none';
       this.elementRef.nativeElement.getElementsByClassName('history-content')[0].style.display ='none';
       this.elementRef.nativeElement.getElementsByClassName('settings-content')[0].style.display ='none';

        break;
      case 'node-content':
     this.elementRef.nativeElement.getElementsByClassName('tree-content')[0].style.display ='none';
     this.elementRef.nativeElement.getElementsByClassName('node-content')[0].style.display ='';
     this.elementRef.nativeElement.getElementsByClassName('history-content')[0].style.display ='none';
     this.elementRef.nativeElement.getElementsByClassName('settings-content')[0].style.display ='none';
        break;
      case 'history-content':
     this.elementRef.nativeElement.getElementsByClassName('tree-content')[0].style.display ='noe';
     this.elementRef.nativeElement.getElementsByClassName('node-content')[0].style.display ='none';
     this.elementRef.nativeElement.getElementsByClassName('history-content')[0].style.display ='';
     this.elementRef.nativeElement.getElementsByClassName('settings-content')[0].style.display ='none';
        break;
      case 'settings-content':
     this.elementRef.nativeElement.getElementsByClassName('tree-content')[0].style.display ='none';
     this.elementRef.nativeElement.getElementsByClassName('node-content')[0].style.display ='none';
     this.elementRef.nativeElement.getElementsByClassName('history-content')[0].style.display ='';
     this.elementRef.nativeElement.getElementsByClassName('settings-content')[0].style.display ='none';
        break;

      default:
        break;
    }
    // alert(item);
  }

}
