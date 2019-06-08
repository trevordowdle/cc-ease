import { Component, Input, Inject } from '@angular/core';
import {MatButtonModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

import { RaceLogic } from "./script/RaceLogic";

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

raceData:string = `1	YOUNG, Clayton	126	BYU	--	23:42.4	---
2	LINKLETTER, Rory	119	BYU	--	23:43.4	0:01.4
3	MCMILLAN, Connor	121	BYU	--	23:44.0	0:02.0
4	CLINGER, Casey	115	BYU	--	23:46.9	0:04.9
5	GILBERT, Colby	313	Washington	--	23:47.4	0:05.4
6	OSTBERG, Alex	275	Stanford	--	23:48.8	0:06.8
7	CARNEY, Daniel	114	BYU	--	23:49.4	0:07.5
8	MCLELLAND, Brayden	120	BYU	--	23:50.4	0:08.4
9	TEARE, Cooper	216	Oregon	--	23:52.3	0:10.3
10	HARPER, Jonathan	117	BYU	--	23:53.3	0:11.3
11	PRAKEL, Sam	213	Oregon	--	23:53.9	0:11.9
12	ANDERSON, Tanner	206	Oregon	--	23:54.7	0:12.7
13	HULL, Talon	315	Washington	--	23:54.8	0:12.8
14	BOLGER, Callum	267	Stanford	--	23:56.6	0:14.6
15	MOUSSA, Mahmoud	317	Washington	--	23:59.7	0:17.7
16	HURLOCK, Blair	273	Stanford	--	24:00.6	0:18.6
17	HANSON, Spencer	116	BYU	--	24:01.3	0:19.3
18	FRALEY, Troy	164	Gonzaga	--	24:03.2	0:21.2
19	FAHY, Steven	271	Stanford	--	24:03.9	0:21.9
20	DINGER, Tai	270	Stanford	--	24:05.3	0:23.3
21	BOYAL, Swarnjit	139	Cal Poly	--	24:06.3	0:24.3
22	MORTON, Kramer	122	BYU	--	24:07.4	0:25.4
23	NEUMAN, Travis	212	Oregon	--	24:07.8	0:25.8
24	HANEY, Blake	210	Oregon	--	24:07.9	0:26.0
25	OWENS, Matt	123	BYU	--	24:08.4	0:26.4
26	SHUMWAY, Clayson	125	BYU	--	24:09.1	0:27.1
27	GARDNER, Andrew	333	Washington	--	24:09.8	0:27.8
28	ORNDORF, Logan	253	Portland	--	24:09.9	0:27.9
29	PARSONS, Alek	276	Stanford	--	24:10.8	0:28.8
30	TAMAGNO, Austin	215	Oregon	--	24:11.4	0:29.4
31	PERRIN, Jake	172	Gonzaga	--	24:13.2	0:31.2
32	CORTES, Isaac	268	Stanford	--	24:16.8	0:34.9
33	STEVENS, Johnathan	321	Washington	--	24:17.1	0:35.1
34	BROWN, Reed	207	Oregon	--	24:18.2	0:36.2
35	PROCTOR, Tibebu	319	Washington	--	24:18.4	0:36.4
36	LANE, Connor	274	Stanford	--	24:18.6	0:36.6
37	VERNAU, Michael	278	Stanford	--	24:19.0	0:37.0
38	BARRINGER, Charlie	309	Washington	--	24:19.4	0:37.4
39	KADERABEK, Max	169	Gonzaga	--	24:20.1	0:38.1
40	YEARIAN, Jack	218	Oregon	--	24:20.7	0:38.7
41	MESTLER, Jackson	211	Oregon	--	24:21.3	0:39.3
42	HOGAN, Peter	168	Gonzaga	--	24:24.1	0:42.1
43	LOZANO, Isaiah	293	UC Santa Barbara	--	24:25.3	0:43.3
44	GAGNON, Bennett	165	Gonzaga	--	24:25.3	0:43.3
45	MCDERMOTT, Sean	146	Cal Poly	--	24:27.0	0:45.0
46	STUCKER, Dwain	195	Idaho	--	24:27.2	0:45.2
47	HAUGHEY, Gabriel	249	Portland	--	24:27.3	0:45.3
48	CHAVEZ-KILLINGER, Cobie	247	Portland	--	24:27.6	0:45.6
49	SNYDER, Andy	320	Washington	--	24:27.8	0:45.8
50	DIEHR, Julius	311	Washington	--	24:28.7	0:46.7
51	HOREN, Joe	250	Portland	--	24:28.7	0:46.7
52	STROME, David	322	Washington	--	24:29.4	0:47.4
53	STANOVSEK, Mick	214	Oregon	--	24:29.6	0:47.6
54	OSEN, Riley	254	Portland	--	24:32.0	0:50.0
55	BEAMER, Nathaniel	310	Washington	--	24:32.6	0:50.7
56	MERDER, Alex	147	Cal Poly	--	24:33.2	0:51.2
57	QUINTANA, Dillon	173	Gonzaga	--	24:33.5	0:51.5
58	CARDENAS, Fabian	187	Idaho	--	24:35.4	0:53.4
59	PELOQUIN, Tristan	255	Portland	--	24:38.6	0:56.6
60	FISHBURN, Phillip	163	Gonzaga	--	24:39.7	0:57.7
61	GREGORY, Ryan	314	Washington	--	24:40.9	0:58.9
62	PARPART, Gavin	318	Washington	--	24:41.0	0:59.0
63	CLARK, Connor	208	Oregon	--	24:41.5	0:59.5
64	GIGUERE, Mikey	143	Cal Poly	--	24:42.7	1:00.7
65	OLLAR, Grayson	191	Idaho	--	24:43.0	1:01.0
66	NOBBS, Thomas	329	Unattached7	--	24:43.2	1:01.2
67	HUTCHINS, Clayton	144	Cal Poly	--	24:43.8	1:01.8
68	MARSHALL, Logan	145	Cal Poly	--	24:44.2	1:02.2
69	FERNANDEZ, Bryan	209	Oregon	--	24:45.3	1:03.3
70	MIGLIOZZI, Garrett	148	Cal Poly	--	24:46.8	1:04.8
71	RITTER, Jake	149	Cal Poly	--	24:48.8	1:06.8
72	MANLEY, Kellen	171	Gonzaga	--	24:49.7	1:07.7
73	DELCOURT, Tim	188	Idaho	--	24:51.0	1:09.0
74	SCHULZ, Brian	295	UC Santa Barbara	--	24:51.8	1:09.8
75	COMEAUX, Ethan	140	Cal Poly	--	24:52.6	1:10.6
76	KOPCZYNSKI, Scott	170	Gonzaga	--	24:53.5	1:11.5
77	BOURKE, Patrick	291	UC Santa Barbara	--	24:54.5	1:12.5
78	GREEN, Issac	326	Unattached4	--	24:57.0	1:15.0
79	BAIER, George	290	UC Santa Barbara	--	24:58.6	1:16.6
80	LACCINOLE, Nicholas	316	Washington	--	24:59.3	1:17.4
81	BADDOUR, Yousef	289	UC Santa Barbara	--	25:00.1	1:18.1
82	COOK, Chas	141	Cal Poly	--	25:03.4	1:21.4
83	SILVA, Evert	330	Unattached8	--	25:03.8	1:21.8
84	OVNICEK, Skylar	192	Idaho	--	25:03.9	1:21.9
85	CHINN, Jarett	292	UC Santa Barbara	--	25:08.1	1:26.1
86	COYLE, Thomas	269	Stanford	--	25:09.4	1:27.4
87	HEFFELFINGER, Alex	166	Gonzaga	--	25:09.9	1:27.9
88	TRUAX, Sammy	174	Gonzaga	--	25:11.4	1:29.4
89	COTSIRILOS, Peter	142	Cal Poly	--	25:12.6	1:30.6
90	WIMS, Zach	150	Cal Poly	--	25:13.7	1:31.7
91	LOMAX, Sam	252	Portland	--	25:15.9	1:33.9
92	FRED, Austin	189	Idaho	--	25:17.2	1:35.2
93	SCHULTZ, Drew	193	Idaho	--	25:18.3	1:36.4
94	ALLEGRE, Peter	246	Portland	--	25:20.1	1:38.1
95	WULFF, Devin	256	Portland	--	25:21.3	1:39.3
96	RANDAZZO, Nick	294	UC Santa Barbara	--	25:27.3	1:45.3
97	SEELY, Caleb	194	Idaho	--	25:29.8	1:47.8
98	HOGAN, Ben	167	Gonzaga	--	25:32.3	1:50.3
99	GODFREY, William	190	Idaho	--	25:34.8	1:52.8
100	GUERMALI, Said	248	Portland	--	25:35.9	1:53.9
101	WILFERT, Thomas	296	UC Santa Barbara	--	25:37.6	1:55.7
102	EQUALL, Chase	324	Unattached2	--	25:49.7	2:07.7
103	JOHNSTON, Conor	251	Portland	--	26:18.2	2:36.2
-	KIRK, Devan	327	Unattached5	--	DNF	---
-	HESLINGTON, Jacob	118	BYU	--	DNF	---
-	PERRIER, Patrick	277	Stanford	--	DNF	---`;


 @Input() title: string;

  constructor(public dialog: MatDialog){
    let raceLogic = new RaceLogic();
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
