import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';

// importing modules
import { SharedModule } from './../shared/shared.module';

// importing components
import { PagePasswordComponent } from './password/page-password.component';
import { HelpToolsComponent } from './../help-tools/help-tools.component';
import { CommandsComponent } from './commands/commands.component';
import { WikiComponent } from './wiki/wiki.component';
import { MD5cONVERTERComponent } from '../help-tools/components/md5-converter/md5-converter.component';

@NgModule({
  imports: [
    CommonModule,
    ClipboardModule,
    FormsModule,
    SharedModule.forChild()
  ],
  exports: [
    PagePasswordComponent,
    CommandsComponent,
    PagePasswordComponent,
    WikiComponent
  ],
  declarations: [
    PagePasswordComponent,
    CommandsComponent,
    MD5cONVERTERComponent,
    HelpToolsComponent,
    WikiComponent
  ],
  providers: [],
})
export class PagesModule { }
