import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

import { defineCustomElements } from "@ionic/pwa-elements/loader";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch((err) => console.log(err));


// This weirdness from: https://capacitor.ionicframework.com/docs/pwa-elements/

// Call the element loader after the platform has been bootstrapped
defineCustomElements(window);