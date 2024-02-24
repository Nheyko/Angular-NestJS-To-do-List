import { ApplicationConfig } from '@angular/core';
import { PreloadAllModules, provideRouter, withDebugTracing, withPreloading } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { loggerInterceptor } from './logger.interceptor';
import { errorInterceptor } from './error.interceptor';
import { csrfInterceptor } from './csrf.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes,
    withPreloading(PreloadAllModules),
    // withDebugTracing(),
    ),
  provideHttpClient(
    withInterceptors([
      loggerInterceptor,
      errorInterceptor,
      csrfInterceptor
  ]))]
};
