import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// // Load runtime config trước khi bootstrap
// fetch('/assets/config.json')
//   .then((response) => response.json())
//   .then((config) => {
//     (window as any).env = config;
//     return bootstrapApplication(App, appConfig);
//   })
//   .catch((err) => console.error(err));

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
