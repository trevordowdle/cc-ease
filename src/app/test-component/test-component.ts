import { Component, Input, Inject } from '@angular/core';
import {MatButtonModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

import { RaceLogic } from "./script/RaceLogic";
import { RaceData } from "./script/RaceData";

export interface DialogData {
  animal: string;
  name: string;
}

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

raceData:string;

 @Input() title: string;

  constructor(public dialog: MatDialog){
    let raceLogic = new RaceLogic();
    let raceData = new RaceData();
    this.raceData = raceData.dillenger16;
    //console.log(this.raceData);
    let initialResults = this.raceData.split('\n');
    initialResults = initialResults.reduce((output,result,i)=>{
      let info = result.split('	');
      output.push({
        //PL:i+1,
        NAME:info[1],
        bib:info[2],
        TEAM:info[3],
        SCORE:null,//info[4],
        TIME:info[5],
        gap:info[6]
      });
      return output;
    },[]);

    this.originalResults = JSON.parse(JSON.stringify(initialResults));
    this.startResults = initialResults;

    this.buildResults(this.startResults);

  }

  ngOnInit(){
    //console.log(BillDellinger);
    console.log('k');
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
    let scoringInfo = this.buildScoringInfo(startResults);
    //get Scoring filters
    let scoringFilters = this.buildScoringFilters(scoringInfo);

    //Bottom info detail

    //calculate runners scores
    let results = this.calculateScores(startResults,scoringFilters);

    // TOP info detail //

    //get scoring totals by team
    let scoreTotals = this.getScoringTotals(results);
    //populate score, avg time, spread
    this.raceInfo = this.populateRaceInfo(scoringInfo,scoreTotals);
    //get scoring keys in order by place
    this.scoringKeys = this.getScoringKeys(this.raceInfo); 

    this.results = results;
  }

  getScoringKeys(raceInfo){
    return Object.keys(raceInfo)
    .filter(key=>{
      return raceInfo[key].count >= 5;
    })
    .sort(function(a,b){
      return raceInfo[a].score < raceInfo[b].score ? -1 : 1;
    });
  }

  populateRaceInfo(info,scoreTotals){
    let scoringInfo = JSON.parse(JSON.stringify(info));
    Object.keys(scoreTotals).map(key=>{
      scoringInfo[key].score = scoreTotals[key].score;
      scoringInfo[key].spread = this.getSpread(scoringInfo[key].scoringTimes);
      scoringInfo[key].average = this.getAverage(scoringInfo[key].scoringTimes);
    });  
    return scoringInfo;
  }

  //Determine runners scores
  calculateScores(passedInResults,scoringFilters){
    let results = JSON.parse(JSON.stringify(passedInResults));
    let teamCount = {};
    results.filter((result,index)=>{
      result['PL'] = index+1;
      if(!teamCount[result['TEAM']]){
        teamCount[result['TEAM']] = 0;
      }
      teamCount[result['TEAM']] += 1;
      return scoringFilters.indexOf(result['TEAM']) === -1 && teamCount[result['TEAM']] <= 7 /*&& (result['TEAM'] === 'BYU' ||result['TEAM'] === "Oregon")*/; //duel meet calculations
    })
    .reduce((teamObj,result,i)=>{
      if(!teamObj[result['TEAM']]){
        teamObj[result['TEAM']] = 0;
      }
      teamObj[result['TEAM']] += 1;
      if(teamObj[result['TEAM']] <= 5){
        result['SCORE'] = i+1;
      }
      return teamObj;
    },{});
    return results;
  }

  getScoringTotals(results){
    return results.reduce((scoreObj,result)=>{
      if(!scoreObj[result['TEAM']]){
        scoreObj[result['TEAM']] = {
          score:0,
          count:0
        }
      }
      let infoRef = scoreObj[result['TEAM']];
      infoRef.count += 1;
      if(infoRef.count <= 5){
        infoRef.score += result['SCORE'];
      }
      return scoreObj
    },{});
  }

  //scoring filters teams under 5 participants and populate average and spread
  buildScoringFilters(scoringInfo){
    return Object.keys(scoringInfo).reduce((scoringFilters,team)=>{
      if(scoringInfo[team].count < 5){
        scoringFilters.push(team);
      }
      return scoringFilters;
    },[]);
  }

  //order,totaltime,scoringTimes
  buildScoringInfo(results){
    return results.reduce((sInfo,result,i)=>{
      if(!sInfo[result['TEAM']]){
        sInfo[result['TEAM']] = {
          count:0,
          SCORE:0,
          order:[],
          totalTime:new Date('1/1/1'),
          scoringTimes:[]
        };
      }
      let infoRef = sInfo[result['TEAM']];
      if(infoRef.count < 5){
        infoRef.count += 1;
        //infoRef.score += result['PL']; // may not be needed could be processed on the fly
        infoRef.order.push(result['PL']);
        this.addTime(result['TIME'],infoRef.totalTime); // may not be needed could be processed on the fly
        infoRef.scoringTimes.push(result['TIME']);
      }
      return sInfo;
    },{});
  }

  addTime(time:string,elapsedTime:Date,subtract?:boolean){
    let timeInfo = time.split(':');
    let minutes = parseInt(timeInfo[0]),
        seconds = parseFloat(timeInfo[1]),
        milliseconds = (seconds%1)*1000;
    seconds = Math.floor(seconds);

    if(subtract){
      minutes*=-1;
      seconds*=-1;
      milliseconds*=-1;
    }

    elapsedTime.setMinutes(elapsedTime.getMinutes()+minutes);
    elapsedTime.setSeconds(elapsedTime.getSeconds()+seconds);
    elapsedTime.setMilliseconds(elapsedTime.getMilliseconds()+milliseconds);
  }

  getSpread(scoringTimes){
    let a = new Date('1/1/1');
    if(scoringTimes.length && scoringTimes.length > 1){
      this.addTime(scoringTimes[scoringTimes.length-1],a);
      this.addTime(scoringTimes[0],a,true); 
      return a;
    }
  }

  getAverage(scoringTimes){
    let average = 0,
    a;
    scoringTimes.map((time,i)=>{
      a = new Date('1/1/1');
      this.addTime(scoringTimes[i],a);
      average += a.getTime();
    });
    average = average/scoringTimes.length;
    a.setTime(average);
    return a;
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


  grouping: string;

  openDialog(team): void {
    const dialogRef = this.dialog.open(GroupingDialog, {
      width: '250px',
      data: {team: team, grouping: this.grouping}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.grouping){
        console.log('The dialog was closed');
        alert(result.grouping + ' ' + result.team);
      }
    });
  }

}

@Component({
  selector: 'grouping-dialog',
  templateUrl: 'groupingDialogue/groupingDialogue.html',
})
export class GroupingDialog {
  constructor(
    public dialogRef: MatDialogRef<GroupingDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
