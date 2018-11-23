import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

/*
* launch() 		this launch() function is used to call the page's platform. 
              It's initialized implicitly when a platform is created via a platform factory (e.g. platformBrowserDynamic).
*/ 
function launch() {
  const platform = platformBrowserDynamic();
  platform.bootstrapModule(AppModule).catch(err => console.log("Launch Error:", err));
}

launch();