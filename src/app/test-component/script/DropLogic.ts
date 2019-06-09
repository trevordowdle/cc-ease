import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
export class DropLogic {
  drop(componentThis:any, event: CdkDragDrop<string[]>) {
    moveItemInArray(componentThis.startResults, event.previousIndex, event.currentIndex);
    if(event.previousIndex !== event.currentIndex){
      componentThis.adjustTime(event.currentIndex === componentThis.startResults.length-1,event.currentIndex);
      componentThis.buildResults(componentThis.startResults);
      componentThis.resultsModified = true;
    }
  }
}
