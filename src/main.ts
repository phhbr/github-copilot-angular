import { defineCustomElements } from '@public-ui/components/loader';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Define KoliBri custom elements
defineCustomElements(window);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
