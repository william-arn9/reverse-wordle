import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterboardComponent } from './letterboard.component';

describe('LetterboardComponent', () => {
  let component: LetterboardComponent;
  let fixture: ComponentFixture<LetterboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LetterboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LetterboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
