import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scoresheet',
  templateUrl: './scoresheet.component.html',
  styleUrls: ['./scoresheet.component.scss']
})
export class ScoresheetComponent implements OnInit {

  totalGames = 0;
  averageScore = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
