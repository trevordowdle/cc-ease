import { NgModule } from '@angular/core';
import { MatButtonModule, MatTooltipModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { TestComponent } from './test-component/test-component';
import { GroupingDialog } from './test-component/groupingDialog/groupingDialog';
import { AddDialog } from './test-component/addRunnerDialog/addDialog';

@NgModule({
  imports: [ BrowserModule, BrowserAnimationsModule, FormsModule, DragDropModule, MatButtonModule, MatTooltipModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule ],
  entryComponents: [GroupingDialog, AddDialog],
  declarations: [ AppComponent, HelloComponent, TestComponent, GroupingDialog, AddDialog ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
