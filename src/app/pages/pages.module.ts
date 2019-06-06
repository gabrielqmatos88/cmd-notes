import { HelpToolsComponent } from './../help-tools/help-tools.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';

// importing modules
import { SharedModule } from './../shared/shared.module';

// importing components
import { CommandsComponent } from './commands/commands.component';
import { WikiComponent } from './wiki/wiki.component';
import { MD5cONVERTERComponent } from '../help-tools/components/md5-converter/md5-converter.component';

@NgModule({
  imports: [
    CommonModule,
    ClipboardModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    CommandsComponent,
    WikiComponent
  ],
  declarations: [
    CommandsComponent,
    MD5cONVERTERComponent,
    HelpToolsComponent,
    WikiComponent
  ],
  providers: [],
})
export class PagesModule { }
