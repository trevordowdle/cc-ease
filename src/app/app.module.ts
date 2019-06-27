import { NgModule } from '@angular/core';
import { MatButtonModule, MatTooltipModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';

import { TestComponent } from './raceType1/race-type1';
import { GroupingDialog } from './raceType1/groupingDialog/groupingDialog';
import { AddDialog } from './raceType1/addRunnerDialog/addDialog';

@NgModule({
  imports: [ BrowserModule, BrowserAnimationsModule, FormsModule, DragDropModule, MatButtonModule, MatTooltipModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule ],
  entryComponents: [GroupingDialog, AddDialog],
  declarations: [ TestComponent, GroupingDialog, AddDialog ],
  bootstrap:    [ TestComponent ]
})
export class AppModule { }
