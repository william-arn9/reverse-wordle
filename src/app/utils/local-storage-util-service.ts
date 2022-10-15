export class LocalStorageUtilService {

  constructor() { }

  patchScore(score: any) : void {
    let scoreString = localStorage.getItem('score');
    if(!scoreString) {
      scoreString = '[]';
    }
    let userScore = JSON.parse(scoreString);
    userScore.push(score);
    localStorage.setItem('score', JSON.stringify(userScore));
  }

  checkForScoreToday() : any {
    let scoreString = localStorage.getItem('score');
    if(!scoreString) {
      scoreString = '[]';
    }
    let userScore = (JSON.parse(scoreString) as Array<any>);
    
    if(userScore.filter((score) => score.date === (new Date()).toDateString()).length > 0) {
      return userScore.filter((score) => score.date === (new Date()).toDateString())[0].score;
    }
    return false;
  }

  pushGuess(guess: any) : void {
    let scoreString = localStorage.getItem('guess');
    if(!scoreString) {
      scoreString = '[]';
    }
    let userScore = JSON.parse(scoreString);
    userScore.push(guess);
    localStorage.setItem('guess', JSON.stringify(userScore));
  }

  getGuesses() : Array<any> {
    let scoreString = localStorage.getItem('guess');
    if(!scoreString) {
      scoreString = '[]';
    }
    let userScore = (JSON.parse(scoreString) as Array<any>);
    
    return userScore;
  }

  clearGuesses() : void {
    localStorage.removeItem('guess');
  }

  averageScores() : number|string {
    let totalScore = 0;
    let scoreString = localStorage.getItem('score');
    if(!scoreString) {
      return '-';
    }
    let userScore = (JSON.parse(scoreString) as Array<any>);
    userScore.forEach((scoreOnDay) => {
      if(scoreOnDay.score === 0 || scoreOnDay.score) {
        totalScore += scoreOnDay.score;
      }
      else {
        totalScore += scoreOnDay;
      }
    })

    const avgScore = totalScore / userScore.length;

    return avgScore.toFixed(2);
  }

  getTotalGames(): number|string {
    let scoreString = localStorage.getItem('score');
    if(!scoreString) {
      return '-';
    }
    let userScore = (JSON.parse(scoreString) as Array<any>);
    return userScore.length;
  }
}