import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ToasterComponent } from './toaster/toaster.component';
import { HarService } from './har.service';
import { HelpToolsComponent } from './help-tools/help-tools.component';
import { MD5cONVERTERComponent } from './help-tools/components/md5-converter/md5-converter.component';

@NgModule({
  declarations: [
    AppComponent,
    ToasterComponent,
    HelpToolsComponent,
    MD5cONVERTERComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [HarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
