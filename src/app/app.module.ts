import { PagesModule } from './pages/pages.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HarService } from './har.service';
import { HelpToolsComponent } from './help-tools/help-tools.component';
import { MD5cONVERTERComponent } from './help-tools/components/md5-converter/md5-converter.component';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app.routing.module';

@NgModule({
  declarations: [
    AppComponent,
    HelpToolsComponent,
    MD5cONVERTERComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    SharedModule,
    FormsModule,
    PagesModule,
    AppRoutingModule
  ],
  providers: [HarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
