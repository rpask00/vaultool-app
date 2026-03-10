import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appReducer } from './store/app.reducers';
import { AppEffects } from './store/app.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore({ app: appReducer }),
    provideEffects([AppEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
  ],
};
