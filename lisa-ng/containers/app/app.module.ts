import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { AppRoutingModule }     from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

//============= import components ================//
import { AppComponent }         from './app.component';
import { ConstructsComponent } from './constructs/constructs.component';
import { SearchHomeComponent } from './search-home/search-home.component';
import { IconsComponent } from './icons/icons.component';
import { IconsHomeComponent } from './icons-home/icons-home.component';
import { SlidesComponent } from './slides/slides.component';
import { FooterComponent } from './footer/footer.component';
import { FeedbackformComponent } from './feedbackform/feedbackform.component';
import { UploadHomeComponent } from './upload-home/upload-home.component';

//=========== import services =================//
import { ConstructService } from './services/construct.service';
import { SearchService } from './services/search.service';
import { IconService } from './services/icon.service';
import { AuthService } from './services/auth.service';

//=========== import helpers =====================//
import { CookieService } from 'ngx-cookie-service';

import { KeyValuePipe } from './upload-home/upload-home.component';
import { MetricsComponent } from './metrics/metrics.component';

@NgModule({ 
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule
  ],
  declarations: [
    AppComponent,
    ConstructsComponent,
    SearchHomeComponent,
    IconsComponent,
    IconsHomeComponent,
    SlidesComponent,
    FooterComponent,
    FeedbackformComponent,
    UploadHomeComponent,
    KeyValuePipe,
    MetricsComponent
  ],
  providers: [
    ConstructService,
    SearchService,
    IconService,
    AuthService,
    CookieService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }