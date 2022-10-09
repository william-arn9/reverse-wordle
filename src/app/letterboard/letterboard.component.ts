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


  readonly words = [
    {
      enabled: true,
      expected: '',
      letters: [''],
      shuffled: '',
      shuffleIndex: 0,
      won: false
    },
    {
      enabled: false,
      expected: '',
      letters: [''],
      shuffled: '',
      shuffleIndex: 0,
      won: false
    },
    {
      enabled: false,
      expected: '',
      letters: [''],
      shuffled: '',
      shuffleIndex: 0,
      won: false
    }
  ];

  readonly statements = [
    'Better luck tomorrow!',
    'See you tomorrow',
    'Good work!',
    'Great job today!'
  ];

  // Controlboard meta
  public letter = 'A';
  public hasBegun = false;
  public hasEnded = false;
  public score = 0;

  constructor(public readonly httpService: ApiHttpService, public readonly sessionStorageUtilService: LocalStorageUtilService) { }

  ngOnInit(): void {
    if(this.sessionStorageUtilService.checkForScoreToday() === 0 || this.sessionStorageUtilService.checkForScoreToday()) {
      this.hasBegun = true;
      this.hasEnded = true;
      
      this.words.forEach((word, index) => {
        word.enabled = false;
      });
      this.score = this.sessionStorageUtilService.checkForScoreToday();
    }
    this.getEachWord(0);
    this.getEachWord(1);
    this.getEachWord(2);
  }

  ngAfterViewInit() {
    if(this.sessionStorageUtilService.checkForScoreToday() === 0 || this.sessionStorageUtilService.checkForScoreToday()) {
      this.replaceGuesses();
    }
  }

  placeLetter(wordIndex: number, event: any, charIndex: number) {
    if(!this.hasBegun || !this.words[wordIndex].enabled) {
      return;
    }
    this.placeInWord(wordIndex, event, this.letter, charIndex);

    // if its a full word
    if(AppUtils.validateIndexesAreFilled(this.words[wordIndex].letters, 4)) {
      this.sessionStorageUtilService.pushGuess(AppUtils.buildString(this.words[wordIndex].letters));
      this.words[wordIndex].enabled = false;
      if(this.checkForSuccess(AppUtils.buildString(this.words[wordIndex].letters), wordIndex)) {
        this.words[wordIndex].won = true;
        this.score++;
      }
      if(wordIndex < 2) {
        this.words[wordIndex + 1].enabled = true;
        this.changeLetter(wordIndex + 1);
      }
      else {
        this.hasEnded = true;
        const score = { date: (new Date()).toDateString(), score: this.score };
        this.sessionStorageUtilService.patchScore(score);
      }
    }
    else {
      this.changeLetter(wordIndex);
    }
  }

  placeInWord(wordIndex: number, event: any, letter: string, charIndex: number) {
    if(!this.words[wordIndex].letters[charIndex] || this.words[wordIndex].letters[charIndex].length < 1) {
      event.target.value = this.letter;
      this.words[wordIndex].letters[charIndex] = letter;
    }
  }

  changeLetter(index: number) {
    if(this.words[index].shuffled.length < 5) {
      const word = this.words[index].expected;
      this.words[index].shuffled = AppUtils.shuffleString(word);
    }
    this.letter = this.words[index].shuffled[this.words[index].shuffleIndex];
    this.words[index].shuffleIndex++;
  }

  replaceGuesses() {
    const guesses = this.sessionStorageUtilService.getGuesses();
    guesses.forEach((guess, index) => {
      for (var i = 0; i < guess.length; i++) {
        this.words[index].letters[i] = guess.charAt(i);
        (document.getElementById(`word${index}${i}`) as HTMLInputElement).value = guess.charAt(i);
      }
    });
  }

  checkForSuccess(word: string, wordIndex: number): boolean {
    if(this.words[wordIndex].expected === word) {
      return true;
    }
    this.httpService.get(`https://thatwordleapi.azurewebsites.net/ask/?word=${word}`).subscribe((res: any) => {
      return (res.Response as boolean);
    },
    (err) => {
      console.error(err);
    });
    return false;
  }

  getEachWord(index: number) {
    this.httpService.get('https://thatwordleapi.azurewebsites.net/get/').subscribe((res: any) => {
      this.words[index].expected = (res.Response as string).toUpperCase();
      if(index === 0) {
        this.changeLetter(0);
      }
    },
    (err) => {
      console.error(err);
    });
  }
}
