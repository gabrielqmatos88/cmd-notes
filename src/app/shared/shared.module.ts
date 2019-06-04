import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ToasterComponent } from './toaster/toaster.component';

@NgModule({
  imports: [CommonModule],
  exports: [ToasterComponent],
  declarations: [ToasterComponent],
  providers: [],
})
export class SharedModule { }
