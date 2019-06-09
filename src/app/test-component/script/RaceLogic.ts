 export class RaceLogic {

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
  //order,totaltime,scoringTimes
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
  //scoring filters teams under 5 participants and populate average and spread
  buildScoringFilters(scoringInfo){
    return Object.keys(scoringInfo).reduce((scoringFilters,team)=>{
      if(scoringInfo[team].count < 5){
        scoringFilters.push(team);
      }
      return scoringFilters;
    },[]);
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
  populateRaceInfo(info,scoreTotals){
    let scoringInfo = JSON.parse(JSON.stringify(info));
    Object.keys(scoreTotals).map(key=>{
      scoringInfo[key].score = scoreTotals[key].score;
      scoringInfo[key].spread = this.getSpread(scoringInfo[key].scoringTimes);
      scoringInfo[key].average = this.getAverage(scoringInfo[key].scoringTimes);
    });  
    return scoringInfo;
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
  getScoringKeys(raceInfo){
    return Object.keys(raceInfo)
    .filter(key=>{
      return raceInfo[key].count >= 5;
    })
    .sort(function(a,b){
      return raceInfo[a].score < raceInfo[b].score ? -1 : 1;
    });
  }
}
