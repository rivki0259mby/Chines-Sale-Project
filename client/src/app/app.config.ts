import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { withInterceptors} from '@angular/common/http';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { authInerceptor } from './auth/auth.iterceptor';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import Aura from '@primeng/themes/aura'; 


export const appConfig: ApplicationConfig = {
  providers: [
    providePrimeNG({
      theme:{
        preset: Aura, options: { darkModeSelector: '.p-dark' }
      }
    }),
    MessageService,
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInerceptor])), 
   
  ]
};
