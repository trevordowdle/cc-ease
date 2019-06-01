import { NgModule } from '@angular/core';
import { MatButtonModule, MatTooltipModule, MatDialogModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { TestComponent, GroupingDialog } from './test-component/test-component';



@NgModule({
  imports: [ BrowserModule, BrowserAnimationsModule, FormsModule, DragDropModule, MatButtonModule, MatTooltipModule, MatDialogModule, MatFormFieldModule, MatInputModule ],
  entryComponents: [GroupingDialog],
  declarations: [ AppComponent, HelloComponent, TestComponent, GroupingDialog ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
