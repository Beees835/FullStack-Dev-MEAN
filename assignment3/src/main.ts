import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';  // New way to provide HttpClient
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';

// Firebase imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCQlSBJw2zmP41mbyxrhveQ-S3UKnZeW5w",
  authDomain: "fit2095-101ff.firebaseapp.com",
  projectId: "fit2095-101ff",
  storageBucket: "fit2095-101ff.appspot.com",
  messagingSenderId: "174561911847",
  appId: "1:174561911847:web:4ca3cb9a568aa75d685a02",
  measurementId: "G-23TDJNWJR2"
};

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    // Firebase providers
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth())
  ]
}).catch(err => console.error(err));
