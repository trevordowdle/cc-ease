import { Component, Input, Inject } from '@angular/core';
import {MatButtonModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {GroupingDialog} from './groupingDialogue/groupingDialogue';
import { RaceLogic } from "./script/RaceLogic";
import { RaceData } from "./script/RaceData";



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
raceData:string;

 @Input() title: string;

  constructor(public dialog: MatDialog){}

  ngOnInit(){
    this.raceLogic = new RaceLogic();
    let raceDataInf = new RaceData();
    this.raceData = raceDataInf.dillenger16;
    let initialResults = raceDataInf.buildResultsType1(this.raceData);
    this.originalResults = JSON.parse(JSON.stringify(initialResults));
    this.startResults = initialResults;
    this.buildResults(this.startResults);
  };

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
    //moveItemInArray(this.results, event.previousIndex, event.currentIndex);
    //recalculate here
  }

  adjustTime(last,currentIndex){
    let ref = last ? -1 : 1;
    this.startResults[currentIndex]['TIME'] = this.startResults[currentIndex+ref]['TIME'];
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

  formatTime(time,mili?){
    let miliCompare = 0;
    let divide = 1000;
    if(mili){
      miliCompare = 9;
      divide = 100;
    }
    if(typeof time === "string"){
      time = new Date(time);
    }
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let seconds = time.getSeconds();
    let milliseconds = parseInt((time.getMilliseconds()/divide).toFixed(0));
    let miliString = '';
    if(mili){
      if(milliseconds < 10){
        miliString = '.'+milliseconds;
      }
      else{
        miliString = '.0';
      }
      //miliString = '.'+time.getMilliseconds();
    }
    if(milliseconds > miliCompare){
      seconds += 1;
      if(seconds > 59){
        seconds = '00';
        minutes += 1;
        if(minutes > 59){
          minutes = '00';
          hours += 1;
        }
      }
    }
    if(minutes < 10 && !(minutes.length === 2)){
      minutes = '0'+minutes;
    }
    if(seconds < 10 && !(seconds.length === 2)){
      seconds = '0'+seconds;
    }
    let hoursString = '';
    if(hours !== 0){
      hoursString = hours+':';
    }
    return hoursString+minutes+':'+seconds+miliString;
    return time; 
  }

  openDialog(team): void {
    //check for grouping here
    let grouping = '';
    const dialogRef = this.dialog.open(GroupingDialog, {
      width: '250px',
      data: {team: team, grouping: grouping}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.grouping){
        console.log('The dialog was closed');
        alert(result.grouping + ' ' + result.team);
      }
    });
  }

}


