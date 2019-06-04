import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ToasterComponent } from './toaster/toaster.component';
import { InsensitiveSearch } from './insensitive-search/insensitive-search.pipe';

@NgModule({
  imports: [CommonModule],
  exports: [ToasterComponent, InsensitiveSearch],
  declarations: [ToasterComponent, InsensitiveSearch],
  providers: []
})
export class SharedModule { }
