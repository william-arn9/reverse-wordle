import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ApiHttpService } from './http/api-http.service';
import { LetterboardComponent } from './letterboard/letterboard.component';
import { LocalStorageUtilService } from './utils/local-storage-util-service';
import { ScoresheetComponent } from './scoresheet/scoresheet.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LetterboardComponent,
    ScoresheetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [ ApiHttpService, LocalStorageUtilService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
