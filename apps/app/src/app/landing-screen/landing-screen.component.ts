import { HttpErrorResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild
  } from '@angular/core';
import { Store } from '@ngrx/store';
import { EndPointConfig, DataService } from '@reflex-ide/common';
import * as _ from 'lodash';
import {
  Ng2TreeSettings,
  NodeEvent,
  TreeModel
  } from 'ng2-tree';
import { Observable } from 'rxjs/Observable';
import {
  CMD_REQUEST,
  DIRLIST_REQUEST
  } from './landing-screen-service-config';
import { UserCountServcie } from '../landing-screen/user-count.service';
import {
  getRequestConfig,
  UrlBuilder,
  } from '@reflex-ide/common';

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

  @ViewChild('treeComponent') treeComponent;
  selectedIP = '192.168.152.19';
  data = [];


  isDirectorySelected = true;
  isNodeSelected = false;
  isSettingSelected = false;

  cmdInputModel:any = "";

  constructor(private store: Store<RootState>,
      private dataService: DataService,
     private urlbuilder: UrlBuilder,private elementRef: ElementRef,private service: UserCountServcie,private http: HttpClient) { }

  historyData:any = [];
  selectedDirectoryID = '';


   treeSettings: Ng2TreeSettings = {
    rootIsVisible: false
  };

  public tree: TreeModel = {

  };

  ngOnInit() {
    this.elementRef.nativeElement.getElementsByClassName('tree-content')[0].style.display ='';
    this.elementRef.nativeElement.getElementsByClassName('node-content')[0].style.display ='none';
    this.elementRef.nativeElement.getElementsByClassName('history-content')[0].style.display ='none';
    this.elementRef.nativeElement.getElementsByClassName('settings-content')[0].style.display ='none';
    this.usersCount$ = this.store.select(getUserCountSelector);
    this.usersCount$.subscribe(this.onUserCountChange.bind(this));
    const req:any = _.cloneDeep(DIRLIST_REQUEST);
    req.apiName = DIRLIST_REQUEST.apiName+"?ip="+this.selectedIP;
    const requestConfig = getRequestConfig(req,this.urlbuilder);
    this.dataService.executeRequest('GET', requestConfig, { type: 'text/html' }, '')
      .subscribe(data => {
        console.log(JSON.parse(data));
        this.tree = this.updateTreeModel(JSON.parse(data));
      });
  }

  checkInput(event:any){
    if (event.keyCode === 13) {
      const objDiv = this.elementRef.nativeElement.getElementsByClassName('consoletext')[0];
      this.elementRef.nativeElement.getElementsByClassName('consoletext')[0].innerHTML += event.target.value;
      this.cmdInputModel = "";
      objDiv.scrollTop = objDiv.scrollHeight;

      const req:any = _.cloneDeep(CMD_REQUEST);
      req.apiName = CMD_REQUEST.apiName+"?ip="+this.selectedIP+"&cmd="+event.target.value;
      const requestConfig = getRequestConfig(req,this.urlbuilder);

      this.dataService.executeRequest('GET', requestConfig, { type: 'text/html' }, '')
      .subscribe(data => {
        //console.log(JSON.parse(data));
        this.elementRef.nativeElement.getElementsByClassName('output')[0].innerHTML = data;
      });

    }
  }

  onUserCountChange(userCount: any) {
    if (userCount) {
      this.userCount = userCount;
    }
    else {
      this.userCount = undefined;
    }
  }

  updateTreeModel(data): any {

    const root:Object = {};
    root['value'] = 'root';
    root['id'] = 'root';
    root['children'] = [];
    root['additionalData'] = 'folder';

      if (data && data.length > 0) {
        data.forEach(element => {
           const item:Object = {};
           item['value'] = element.filename;
           item['id'] = element.filename;
           item['path'] = element.filename;

          if (element.longname.startsWith('d')){
            item['children'] = []

          }
           item['additionalData'] = element.longname.startsWith('d') ? 'folder' : 'file';
         console.log(element.filename + ' rr ' )
         root["children"].push(item);
        });
      }

      return root;
  }

  updateChildrenTreeModel(data): any {

    const root = [];

      if (data && data.length > 0) {
        data.forEach(element => {
           const item:Object = {};
           item['value'] = element.filename;
           item['id'] = element.filename;
           item['path'] = this.selectedDirectoryID + '/' + element.filename;

          if (element.longname.startsWith('d')){
            item['children'] = []
          }
           item['additionalData'] = element.longname.startsWith('d') ? 'folder' : 'file';
         console.log(element.filename + ' rr ' )
         root["children"].push(item);
        });

      }

      return root;
  }

  handleSelected(event: NodeEvent) {
    if (event.node.node.additionalData === 'folder') {
      this.handleFolderSelection(event);
    } else {
      this.handleFileSelection(event);
    }
  }

  handleFileSelection(event: NodeEvent) {
    console.log('file selected : ' + event.node.node.value)
  }

  handleFolderSelection(event: NodeEvent) {

    this.selectedDirectoryID = event.node.node.value as string;
    const selectedDir = this.treeComponent.getControllerByNodeId(this.selectedDirectoryID);
   this.historyData.push({"title":this.selectedDirectoryID});
    const newNode: TreeModel = this.updateChildrenTreeModel(this.data2);

    selectedDir.setChildren(newNode);
    selectedDir.expand();

  }

  onSearch(value) {
    console.log(value.target.value);


  }

  nodeTabClick(ip){

    this.selectedIP = ip;
    this.elementRef.nativeElement.getElementsByClassName('tree-content')[0].style.display ='';
    this.elementRef.nativeElement.getElementsByClassName('node-content')[0].style.display ='none';
    this.elementRef.nativeElement.getElementsByClassName('history-content')[0].style.display ='none';
    this.elementRef.nativeElement.getElementsByClassName('settings-content')[0].style.display ='none';
    document.getElementsByClassName("node")[0].classList.remove("active");
    document.getElementsByClassName("home")[0].classList.add("active");
    const req:any = _.cloneDeep(DIRLIST_REQUEST);
    req.apiName = DIRLIST_REQUEST.apiName+"?ip="+this.selectedIP;
    const requestConfig = getRequestConfig(req,this.urlbuilder);
    this.dataService.executeRequest('GET', requestConfig, { type: 'text/html' }, '')
      .subscribe(data => {
        // console.log(JSON.parse(data));
        this.tree = this.updateTreeModel(JSON.parse(data));
      });
  }

  getColor(value) {
    if (this.selectedIP === value) {
      return '#C8C8C8'
    } else {
      return '';
    }
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
     this.elementRef.nativeElement.getElementsByClassName('tree-content')[0].style.display ='none';
     this.elementRef.nativeElement.getElementsByClassName('node-content')[0].style.display ='none';
     this.elementRef.nativeElement.getElementsByClassName('history-content')[0].style.display ='';
     this.elementRef.nativeElement.getElementsByClassName('settings-content')[0].style.display ='none';
        break;
      case 'settings-content':
     this.elementRef.nativeElement.getElementsByClassName('tree-content')[0].style.display ='none';
     this.elementRef.nativeElement.getElementsByClassName('node-content')[0].style.display ='none';
     this.elementRef.nativeElement.getElementsByClassName('history-content')[0].style.display ='none';
     this.elementRef.nativeElement.getElementsByClassName('settings-content')[0].style.display ='';
        break;

      default:
        break;
    }
  }

}
