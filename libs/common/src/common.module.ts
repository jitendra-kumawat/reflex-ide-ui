import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DataService } from './data.service';

@NgModule({
  imports: [CommonModule],
  providers: [
    DataService
  ],
})
export class ApplicationCommonModule { }
