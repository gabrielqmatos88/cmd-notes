import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const theme = localStorage.getItem('theme');
if (!theme) {
  localStorage.setItem('theme', 'light');
}
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

