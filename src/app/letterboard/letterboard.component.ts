import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApiHttpService } from '../http/api-http.service';
import { AppUtils } from '../utils/app-utils';
import { LocalStorageUtilService } from '../utils/local-storage-util-service';

@Component({
  selector: 'app-letterboard',
  templateUrl: './letterboard.component.html',
  styleUrls: ['./letterboard.component.scss', './controlboard.component.scss']
})
export class LetterboardComponent implements OnInit, AfterViewInit {


  readonly userGuessWords = [
    {
      enabled: true,
      expected: '',
      lettersGuessed: [''],
      shuffledWord: '',
      shuffleIndex: 0,
      won: false
    },
    {
      enabled: false,
      expected: '',
      lettersGuessed: [''],
      shuffledWord: '',
      shuffleIndex: 0,
      won: false
    },
    {
      enabled: false,
      expected: '',
      lettersGuessed: [''],
      shuffledWord: '',
      shuffleIndex: 0,
      won: false
    }
  ];

  // Index of statement coorelates to score (0-3)
  readonly statements = [
    'Better luck tomorrow!',
    'See you tomorrow',
    'Good work!',
    'Great job today!'
  ];

  // Controlboard meta
  public letter = 'A';
  public gameHasBegun = false;
  public gameHasEnded = false;
  public score = 0;

  constructor(
    public readonly httpService: ApiHttpService,
    public readonly localStorageUtilService: LocalStorageUtilService
  ) { }

  ngOnInit(): void {
    const scoreFromStorage = this.localStorageUtilService.checkForScoreToday();
    // if user has played today
    if(scoreFromStorage === 0 || scoreFromStorage) {
      this.gameHasBegun = true;
      this.gameHasEnded = true;
      
      this.userGuessWords.forEach((word) => {
        word.enabled = false;
      });
      this.score = scoreFromStorage;
    }
    else {
      // get three wordle words
      this.getEachWord(0);
      this.getEachWord(1);
      this.getEachWord(2);
    }
  }

  ngAfterViewInit() {
    const scoreFromStorage = this.localStorageUtilService.checkForScoreToday();
    //if user has played today
    if(scoreFromStorage === 0 || scoreFromStorage) {
      this.replaceStoredGuesses();
    }
    else {
      this.localStorageUtilService.clearGuesses();
    }
  }

  placeLetter(wordIndex: number, event: any, charIndex: number) {
    if(!this.isLetterEmptyAndEnabled(wordIndex, charIndex)) {
      return;
    }
    this.placeInWord(wordIndex, event, this.letter, charIndex);

    // if this letter makes it a full word
    if(AppUtils.validateIndexesAreFilled(this.userGuessWords[wordIndex].lettersGuessed, 4)) {
      this.userGuessWords[wordIndex].enabled = false;
      if(this.checkForSuccess(AppUtils.buildString(this.userGuessWords[wordIndex].lettersGuessed), wordIndex)) {
        this.localStorageUtilService.pushGuess({won: true, guess: AppUtils.buildString(this.userGuessWords[wordIndex].lettersGuessed)});
        this.userGuessWords[wordIndex].won = true;
        this.score++;
      }
      else {
        this.localStorageUtilService.pushGuess({won: false, guess: AppUtils.buildString(this.userGuessWords[wordIndex].lettersGuessed)});
      }
      // setup next word
      if(wordIndex < 2) {
        this.userGuessWords[wordIndex + 1].enabled = true;
        this.changeLetter(wordIndex + 1);
      }
      else {
        this.gameHasEnded = true;
        const score = { date: (new Date()).toDateString(), score: this.score };
        this.localStorageUtilService.patchScore(score);
        this.changeLetter(wordIndex);
      }
    }
    else {
      this.changeLetter(wordIndex);
    }
  }

  isLetterEmptyAndEnabled(wordIndex: number, charIndex: number): boolean {
    if(!this.gameHasBegun || !this.userGuessWords[wordIndex].enabled ||
      (this.userGuessWords[wordIndex].lettersGuessed[charIndex] &&
      this.userGuessWords[wordIndex].lettersGuessed[charIndex].length > 0)) {
      return false;
    }
    return true;
  }

  placeInWord(wordIndex: number, event: any, letter: string, charIndex: number) {
    if(!this.userGuessWords[wordIndex].lettersGuessed[charIndex] || this.userGuessWords[wordIndex].lettersGuessed[charIndex].length < 1) {
      event.target.value = this.letter;
      this.userGuessWords[wordIndex].lettersGuessed[charIndex] = letter;
    }
  }

  changeLetter(index: number) {
    // shuffle the word if not already done
    if(this.userGuessWords[index].shuffledWord.length < 1) {
      const word = this.userGuessWords[index].expected;
      this.userGuessWords[index].shuffledWord = AppUtils.shuffleString(word);
    }
    // advance letter in shuffled word
    this.letter = this.userGuessWords[index].shuffledWord[this.userGuessWords[index].shuffleIndex];
    this.userGuessWords[index].shuffleIndex++;
  }

  replaceStoredGuesses() {
    const guesses = this.localStorageUtilService.getGuesses();
    guesses.forEach((guessObj, index) => {
      if(guessObj.guess) {
        this.userGuessWords[index].won = guessObj.won;
        //if(guessObjthis.userGuessWords[index]){}
        for (var i = 0; i < guessObj.guess.length; i++) {
          this.userGuessWords[index].lettersGuessed[i] = guessObj.guess.charAt(i);
          (document.getElementById(`word${index}${i}`) as HTMLInputElement).value = guessObj.guess.charAt(i);
        }
      }
      else {
        for (var i = 0; i < guessObj.length; i++) {
          this.userGuessWords[index].lettersGuessed[i] = guessObj.charAt(i);
          (document.getElementById(`word${index}${i}`) as HTMLInputElement).value = guessObj.charAt(i);
        }
      }
    });
  }

  getEachWord(index: number) {
    this.httpService.get('https://thatwordleapi.azurewebsites.net/get/').subscribe((res: any) => {
      this.userGuessWords[index].expected = (res.Response as string).toUpperCase();
      if(index === 0) {
        this.changeLetter(0);
      }
    },
    (err) => {
      console.error(err);
    });
  }

  // check if word is real
  checkForSuccess(word: string, wordIndex: number): boolean {
    const wIndex = wordIndex;
    if(this.userGuessWords[wIndex].expected === word) {
      return true;
    }
    this.httpService.get(`https://thatwordleapi.azurewebsites.net/ask/?word=${word.toLowerCase()}`).subscribe((res: any) => {
      if(res.Response) {
        this.localStorageUtilService.pushGuess({won: true, guess: AppUtils.buildString(this.userGuessWords[wIndex].lettersGuessed)});
        this.score++;
      }
      this.userGuessWords[wIndex].won = res.Response;
      return (res.Response as boolean);
    },
    (err) => {
      console.error(err);
    });
    return false;
  }
}
