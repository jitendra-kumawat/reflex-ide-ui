import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild
  } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  getRequestConfig,
  UrlBuilder
  } from '@reflex-ide/common';
import {
  Ng2TreeSettings,
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

  @ViewChild('treeComponent') treeComponent;

  data = [{
    "filename": "dev",
	"longname": "drwxr-xr-x   19 root     root         3220 Aug  3 05:14 dev",
	"attrs": {
		"mode": 16877,
		"permissions": 16877,
		"uid": 0,
		"gid": 0,
		"size": 3220,
		"atime": 1538994301,
		"mtime": 1533273290
	}
}, {
	"filename": "proc",
	"longname": "dr-xr-xr-x  234 root     root            0 Aug  1 07:01 proc",
	"attrs": {
		"mode": 16749,
		"permissions": 16749,
		"uid": 0,
		"gid": 0,
		"size": 0,
		"atime": 1533106913,
		"mtime": 1533106913
	}
}, {
	"filename": "run",
	"longname": "drwxr-xr-x   37 root     root         1080 Oct  9 09:43 run",
	"attrs": {
		"mode": 16877,
		"permissions": 16877,
		"uid": 0,
		"gid": 0,
		"size": 1080,
		"atime": 1533106917,
		"mtime": 1539078229
	}
}, {
	"filename": "sys",
	"longname": "dr-xr-xr-x   13 root     root            0 Aug  1 07:01 sys",
	"attrs": {
		"mode": 16749,
		"permissions": 16749,
		"uid": 0,
		"gid": 0,
		"size": 0,
		"atime": 1533106917,
		"mtime": 1533106917
	}
}, {
	"filename": "var",
	"longname": "drwxr-xr-x   20 root     root          278 Aug  1 10:17 var",
	"attrs": {
		"mode": 16877,
		"permissions": 16877,
		"uid": 0,
		"gid": 0,
		"size": 278,
		"atime": 1539172211,
		"mtime": 1533118624
	}
}, {
	"filename": "etc",
	"longname": "drwxr-xr-x   98 root     root         8192 Oct 10 10:50 etc",
	"attrs": {
		"mode": 16877,
		"permissions": 16877,
		"uid": 0,
		"gid": 0,
		"size": 8192,
		"atime": 1539173493,
		"mtime": 1539168644
	}
}, {
	"filename": "root",
	"longname": "dr-xr-x---   10 root     root         4096 Oct  1 10:43 root",
	"attrs": {
		"mode": 16744,
		"permissions": 16744,
		"uid": 0,
		"gid": 0,
		"size": 4096,
		"atime": 1539102909,
		"mtime": 1538390639
	}
}, {
	"filename": "tmp",
	"longname": "drwxrwxrwt    9 root     root          192 Oct 10 12:11 tmp",
	"attrs": {
		"mode": 17407,
		"permissions": 17407,
		"uid": 0,
		"gid": 0,
		"size": 192,
		"atime": 1478360316,
		"mtime": 1539173493
	}
}, {
	"filename": "usr",
	"longname": "drwxr-xr-x   14 root     root          167 Mar 15  2017 usr",
	"attrs": {
		"mode": 16877,
		"permissions": 16877,
		"uid": 0,
		"gid": 0,
		"size": 167,
		"atime": 1538388721,
		"mtime": 1489567160
	}
}, {
	"filename": "bin",
	"longname": "lrwxrwxrwx    1 root     root            7 Feb 22  2018 bin",
	"attrs": {
		"mode": 41471,
		"permissions": 41471,
		"uid": 0,
		"gid": 0,
		"size": 7,
		"atime": 1539154927,
		"mtime": 1519301460
	}
}, {
	"filename": "sbin",
	"longname": "lrwxrwxrwx    1 root     root            8 Feb 22  2018 sbin",
	"attrs": {
		"mode": 41471,
		"permissions": 41471,
		"uid": 0,
		"gid": 0,
		"size": 8,
		"atime": 1539154931,
		"mtime": 1519301460
	}
}, {
	"filename": "lib",
	"longname": "lrwxrwxrwx    1 root     root            7 Feb 22  2018 lib",
	"attrs": {
		"mode": 41471,
		"permissions": 41471,
		"uid": 0,
		"gid": 0,
		"size": 7,
		"atime": 1539102935,
		"mtime": 1519301460
	}
}, {
	"filename": "lib64",
	"longname": "lrwxrwxrwx    1 root     root            9 Feb 22  2018 lib64",
	"attrs": {
		"mode": 41471,
		"permissions": 41471,
		"uid": 0,
		"gid": 0,
		"size": 9,
		"atime": 1539154921,
		"mtime": 1519301460
	}
}, {
	"filename": "boot",
	"longname": "dr-xr-xr-x    4 root     root         4096 Feb 22  2018 boot",
	"attrs": {
		"mode": 16749,
		"permissions": 16749,
		"uid": 0,
		"gid": 0,
		"size": 4096,
		"atime": 1538390020,
		"mtime": 1519302007
	}
}, {
	"filename": "home",
	"longname": "drwxr-xr-x    5 root     root           67 Oct  9 16:58 home",
	"attrs": {
		"mode": 16877,
		"permissions": 16877,
		"uid": 0,
		"gid": 0,
		"size": 67,
		"atime": 1539106928,
		"mtime": 1539104327
	}
}, {
	"filename": "media",
	"longname": "drwxr-xr-x    2 root     root            6 Nov  5  2016 media",
	"attrs": {
		"mode": 16877,
		"permissions": 16877,
		"uid": 0,
		"gid": 0,
		"size": 6,
		"atime": 1478360316,
		"mtime": 1478360316
	}
}, {
	"filename": "mnt",
	"longname": "drwxr-xr-x    2 root     root            6 Nov  5  2016 mnt",
	"attrs": {
		"mode": 16877,
		"permissions": 16877,
		"uid": 0,
		"gid": 0,
		"size": 6,
		"atime": 1478360316,
		"mtime": 1478360316
	}
}, {
	"filename": "test.ts",
	"longname": "-rw-r--r--    1 root     root            5 Oct 10 12:12 test.ts",
	"attrs": {
		"mode": 33188,
		"permissions": 33188,
		"uid": 0,
		"gid": 0,
		"size": 5,
		"atime": 1539173528,
		"mtime": 1539173528
	}
}];

data2 = [ {
	"filename": "opt",
	"longname": "drwxr-xr-x    4 root     root           35 Aug  3 03:48 opt",
	"attrs": {
		"mode": 16877,
		"permissions": 16877,
		"uid": 0,
		"gid": 0,
		"size": 35,
		"atime": 1539173488,
		"mtime": 1533268108
	}
}, {
	"filename": "srv",
	"longname": "drwxr-xr-x    2 root     root            6 Nov  5  2016 srv",
	"attrs": {
		"mode": 16877,
		"permissions": 16877,
		"uid": 0,
		"gid": 0,
		"size": 6,
		"atime": 1478360316,
		"mtime": 1478360316
	}
}, {
	"filename": "test",
	"longname": "drwxr-xr-x    3 root     root           37 Oct  1 10:54 test",
	"attrs": {
		"mode": 16877,
		"permissions": 16877,
		"uid": 0,
		"gid": 0,
		"size": 37,
		"atime": 1538391267,
		"mtime": 1538391264
	}
}];


  isDirectorySelected = true;
  isNodeSelected = false;
  isSettingSelected = false;

  cmdInputModel:any = "";

  constructor(private store: Store<RootState>, private urlbuilder: UrlBuilder,private elementRef: ElementRef) { }

  historyData:any = [];
  selectedDirectoryID = '';


   treeSettings: Ng2TreeSettings = {
    rootIsVisible: false
  };

  public tree: TreeModel = {
    value: 'Programming languages',
    additionalData: 'folder',
    settings: {
      'isCollapsedOnInit': true,
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

    this.tree = this.updateTreeModel(this.data) as TreeModel;
  }

  checkInput(event:any){
    if (event.keyCode === 13) {
      this.elementRef.nativeElement.getElementsByClassName('consoletext')[0].innerHTML += event.target.value;
      this.cmdInputModel = "";
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

          if (element.longname.startsWith('d')){
            item['children'] = []

          }
           item['additionalData'] = element.longname.startsWith('d') ? 'folder' : 'file';
         root.children.push(item);
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

          if (element.longname.startsWith('d')){
            item['children'] = []
          }
           item['additionalData'] = element.longname.startsWith('d') ? 'folder' : 'file';
         root.push(item);
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
   this.historyData.push(selectedDir);
    const newNode: TreeModel = this.updateChildrenTreeModel(this.data2);

    selectedDir.setChildren(newNode);
    selectedDir.expand();

  }

  onSearch(value) {
    console.log(value.target.value);


  }

  nodeTabClick(ip){
    this.elementRef.nativeElement.getElementsByClassName('tree-content')[0].style.display ='';
    this.elementRef.nativeElement.getElementsByClassName('node-content')[0].style.display ='none';
    this.elementRef.nativeElement.getElementsByClassName('history-content')[0].style.display ='none';
    this.elementRef.nativeElement.getElementsByClassName('settings-content')[0].style.display ='none';
    document.getElementsByClassName("node")[0].classList.remove("active");
    document.getElementsByClassName("home")[0].classList.add("active");



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
