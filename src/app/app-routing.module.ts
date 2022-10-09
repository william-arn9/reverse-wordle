import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LetterboardComponent } from './letterboard/letterboard.component';

const routes: Routes = [
  {
    path: 'reversle', component: LetterboardComponent
  },
  {
    path: '', redirectTo: '/reversle', pathMatch: 'full' //default
  },
  {
    path: '**', redirectTo: '/reversle'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
