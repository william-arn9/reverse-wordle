export class LocalStorageUtilService {

  constructor() { }

  patchScore(score: any) {
    let scoreString = localStorage.getItem('score');
    if(!scoreString) {
      scoreString = '[]';
    }
    let userScore = JSON.parse(scoreString);
    userScore.push(score);
    localStorage.setItem('score', JSON.stringify(userScore));
  }

  checkForScoreToday(): any {
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

  pushGuess(guess: string) {
    let scoreString = localStorage.getItem('guess');
    if(!scoreString) {
      scoreString = '[]';
    }
    let userScore = JSON.parse(scoreString);
    userScore.push(guess);
    localStorage.setItem('guess', JSON.stringify(userScore));
  }

  getGuesses(): Array<any> {
    let scoreString = localStorage.getItem('guess');
    if(!scoreString) {
      scoreString = '[]';
    }
    let userScore = (JSON.parse(scoreString) as Array<any>);
    
    return userScore;
  }
}