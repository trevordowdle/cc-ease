import { Component, Input, Inject } from '@angular/core';
import {MatButtonModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {GroupingDialog} from './groupingDialogue/groupingDialogue';
import { RaceLogic } from "./script/RaceLogic";
import { DropLogic } from "./script/DropLogic";
import { RaceData } from "./script/RaceData";
import { FormatingUtil } from "./script/FormatingUtil";

@Component({
  selector: 'app-test-component',
  templateUrl: './test-component.html',
  styleUrls: ['./test-component.css']
})
export class TestComponent {

raceInfo:object;
scoringKeys:object;
results:any;
originalResults:any;
startResults:any;
resultKeys:Array<string> = ["PL","NAME","TEAM","TIME","SCORE"];
resultsModified:boolean = false;
raceLogic:any;
dropLogic:any;
formatingUtil:any;
raceData:string;
groupingData:any={};

 @Input() title: string;

  constructor(public dialog: MatDialog){}

  ngOnInit(){
    this.formatingUtil = new FormatingUtil();
    this.raceLogic = new RaceLogic();
    this.dropLogic = new DropLogic();
    let raceDataInf = new RaceData();
    this.raceData = raceDataInf.dillenger16;
    let initialResults = raceDataInf.buildResultsType1(this.raceData);
    this.originalResults = JSON.parse(JSON.stringify(initialResults));
    this.startResults = initialResults;
    this.buildResults(this.startResults);
  };

  getKeys(data){
    return Object.keys(data);
  }

  buildResults(startResults){
    let info = this.raceLogic.buildResults(startResults);
    this.raceInfo = info.raceInfo;
    this.scoringKeys = info.scoringKeys;
    this.results = info.results;
  }

  openDialog(team): void {
    //check for grouping here
    let grouping = '';
    const dialogRef = this.dialog.open(GroupingDialog, {
      width: '250px',
      data: {team: team, grouping: grouping}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.groupingData[result.team] = result.grouping;
      }
    });
  }

  showGroupingModal(team){
    this.openDialog(team);
  }

  undoChanges(){
    this.buildResults(this.originalResults);
    this.resultsModified = false;
  }

}


