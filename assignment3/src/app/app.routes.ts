import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomePageComponent } from './home-page/home-page.component';
import { InvalidDataComponent } from './invalid-data/invalid-data.component';
import { AddDriverComponent } from './add-driver/add-driver.component';
import { ListDriversComponent } from './list-drivers/list-drivers.component';
import { DeleteDriverComponent } from './delete-driver/delete-driver.component';
import { UpdateDriverComponent } from './update-driver/update-driver.component';
import { AddPackageComponent } from './add-package/add-package.component';
import { ListPackagesComponent } from './list-packages/list-packages.component';
import { DeletePackageComponent } from './delete-package/delete-package.component';
import { UpdatePackageComponent } from './update-package/update-package.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { TranslateDescriptionComponent } from './translate-description/translate-description.component';
import { TextToSpeechComponent } from './text-to-speech/text-to-speech.component';
import { GenerativeAIComponent } from './generative-ai/generative-ai.component';

// Import new signin/signup components
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

// Import the Auth Guard
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  // Unprotected routes
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // Protected routes (require authentication)
  { path: 'home', component: HomePageComponent, canActivate: [AuthGuard] },
  { path: 'invalid-data', component: InvalidDataComponent, canActivate: [AuthGuard] },
  { path: 'add-driver', component: AddDriverComponent, canActivate: [AuthGuard] },
  { path: 'list-drivers', component: ListDriversComponent, canActivate: [AuthGuard] },
  { path: 'delete-driver', component: DeleteDriverComponent, canActivate: [AuthGuard] },
  { path: 'update-driver', component: UpdateDriverComponent, canActivate: [AuthGuard] },
  { path: 'add-package', component: AddPackageComponent, canActivate: [AuthGuard] },
  { path: 'list-packages', component: ListPackagesComponent, canActivate: [AuthGuard] },
  { path: 'delete-package', component: DeletePackageComponent, canActivate: [AuthGuard] },
  { path: 'update-package', component: UpdatePackageComponent, canActivate: [AuthGuard] },
  { path: 'statistics', component: StatisticsComponent, canActivate: [AuthGuard] },
  { path: 'translate-description', component: TranslateDescriptionComponent, canActivate: [AuthGuard] },
  { path: 'text-to-speech', component: TextToSpeechComponent, canActivate: [AuthGuard] },
  { path: 'generative-ai', component: GenerativeAIComponent, canActivate: [AuthGuard] },

  // Redirect to home if no route is matched
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Redirect unknown paths to page-not-found
  { path: '**', redirectTo: 'page-not-found', pathMatch: 'full' },
  { path: 'page-not-found', component: PageNotFoundComponent }
];
