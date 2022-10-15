import { Component, OnInit, Input, AfterContentChecked } from '@angular/core';
import { LocalStorageUtilService } from '../utils/local-storage-util-service';

@Component({
  selector: 'app-scoresheet',
  templateUrl: './scoresheet.component.html',
  styleUrls: ['./scoresheet.component.scss']
})
export class ScoresheetComponent implements OnInit, AfterContentChecked {

  @Input() hasEnded = false;
  totalGames: string|number;
  averageScore: string|number;

  constructor(private readonly localStorageService: LocalStorageUtilService) {
    this.averageScore = 0;
    this.totalGames = 0;
  }

  ngOnInit(): void {
    this.averageScore = this.localStorageService.averageScores();
    this.totalGames = this.localStorageService.getTotalGames();
  }

  ngAfterContentChecked(): void {
    if(this.hasEnded) {
    this.averageScore = this.localStorageService.averageScores();
    this.totalGames = this.localStorageService.getTotalGames();
    }
  }
}
