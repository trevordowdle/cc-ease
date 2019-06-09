import { Component, Input, Inject } from '@angular/core';
import {MatButtonModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {GroupingDialog} from './groupingDialogue/groupingDialogue';
import { RaceLogic } from "./script/RaceLogic";
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
formatingUtil:any;
raceData:string;
groupingData:any={};

 @Input() title: string;

  constructor(public dialog: MatDialog){}

  ngOnInit(){
    this.formatingUtil = new FormatingUtil();
    this.raceLogic = new RaceLogic();
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
    //get Scoring info
    let scoringInfo = this.raceLogic.buildScoringInfo(startResults);
    //get Scoring filters
    let scoringFilters = this.raceLogic.buildScoringFilters(scoringInfo);
    //Bottom info detail
    //calculate runners scores
    let results = this.raceLogic.calculateScores(startResults,scoringFilters);
    // TOP info detail //
    //get scoring totals by team
    let scoreTotals = this.raceLogic.getScoringTotals(results);
    //populate score, avg time, spread
    this.raceInfo = this.raceLogic.populateRaceInfo(scoringInfo,scoreTotals);
    //get scoring keys in order by place
    this.scoringKeys = this.raceLogic.getScoringKeys(this.raceInfo); 
    this.results = results;
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

  adjustTime(last,currentIndex){
    let ref = last ? -1 : 1;
    this.startResults[currentIndex]['TIME'] = this.startResults[currentIndex+ref]['TIME'];
  }

  showGroupingModal(team){
    this.openDialog(team);
  }

  undoChanges(){
    this.buildResults(this.originalResults);
    this.resultsModified = false;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.startResults, event.previousIndex, event.currentIndex);
    if(event.previousIndex !== event.currentIndex){
      this.adjustTime(event.currentIndex === this.startResults.length-1,event.currentIndex);
      this.buildResults(this.startResults);
      this.resultsModified = true;
    }
  }

}


