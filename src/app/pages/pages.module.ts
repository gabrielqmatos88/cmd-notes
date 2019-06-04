import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// importing modules
import { SharedModule } from './../shared/shared.module';

// importing components
import { CommandsComponent } from './commands/commands.component';
import { WikiComponent } from './wiki/wiki.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    CommandsComponent,
    WikiComponent
  ],
  declarations: [
    CommandsComponent,
    WikiComponent
  ],
  providers: [],
})
export class PagesModule { }
