import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FileSelectorComponent } from './file-selector/file-selector.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { ToasterComponent } from './toaster/toaster.component';
import { InsensitiveSearch } from './insensitive-search/insensitive-search.pipe';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { CommandsService } from './services/commands.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    // components
    ToasterComponent,
    PageHeaderComponent,
    FileSelectorComponent,
    // pipes
    InsensitiveSearch
  ],
  declarations: [
    // components
    ToasterComponent,
    PageHeaderComponent,
    FileSelectorComponent,
    // pipes
    InsensitiveSearch
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [CommandsService]
    };
  }
  static forChild() {
    return {
      ngModule: SharedModule
    };
  }
}
