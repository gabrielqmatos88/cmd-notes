import { PageHeaderComponent } from './page-header/page-header.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ToasterComponent } from './toaster/toaster.component';
import { InsensitiveSearch } from './insensitive-search/insensitive-search.pipe';

@NgModule({
  imports: [CommonModule],
  exports: [
    // components
    ToasterComponent,
    PageHeaderComponent,
    // pipes
    InsensitiveSearch
  ],
  declarations: [
    // components
    ToasterComponent,
    PageHeaderComponent,
    // pipes
    InsensitiveSearch
  ],
  providers: []
})
export class SharedModule { }
