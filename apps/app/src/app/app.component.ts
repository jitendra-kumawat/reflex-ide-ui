import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FaviconService, ErrorHandler } from '@guavus/core';
import { appConfig } from '@reflex-ide/common';
import {
  AfterViewInit,
  Component,
  OnInit
} from '@angular/core';
import { MatAlertComponent } from '@guavus/smart-components';

@Component({
  selector: 'reflex-ide-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements AfterViewInit, OnInit {
  constructor(private titleService: Title, private router: Router, private favicon: FaviconService,private errorHandler:ErrorHandler) { }
  ngOnInit() {
    const icon = this.getFavicon();
    this.favicon.activate(icon);
    // set alert popup to errorhandler
    this.errorHandler.setErrorPopup(MatAlertComponent);
  }

  ngAfterViewInit() {
    this.titleService.setTitle(this.getAppTitle());
    this.removeNode('loadingIcon');
    //initial navigation after  APP_INITIALZER finishes
    this.router.initialNavigation();
  }

  getFavicon(): string {
    return (appConfig.project && appConfig.project.favicon) || 'default';
  }

  getAppTitle(): string {
    return appConfig.project && appConfig.project.appName ? appConfig.project.appName : '';
  }

  removeNode(tag: string) {
    const element = document.getElementById(tag);
    if (element) {
      const parent = element.parentNode;
      parent.removeChild(element);
    }
  }
}
