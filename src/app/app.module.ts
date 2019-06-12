import { PagesModule } from './pages/pages.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HarService } from './har.service';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app.routing.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    SharedModule.forRoot(),
    FormsModule,
    PagesModule,
    AppRoutingModule
  ],
  providers: [HarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
