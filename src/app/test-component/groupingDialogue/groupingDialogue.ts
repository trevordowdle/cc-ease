
import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

export interface DialogData {
  team: string;
  grouping: string;
}

@Component({
  selector: 'grouping-dialog',
  templateUrl: 'groupingDialogue.html',
})
export class GroupingDialog {
  constructor(
    public dialogRef: MatDialogRef<GroupingDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}