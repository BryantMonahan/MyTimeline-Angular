import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import axios from 'axios';

// allows for sending the JWT token to the server
axios.defaults.withCredentials = true

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
