import { Routes } from '@angular/router';
import { PatientRegistrationComponent } from './components/patient-registration/patient-registration.component';

export const routes: Routes = [
  { path: '', redirectTo: '/register', pathMatch: 'full' },
  { path: 'register', component: PatientRegistrationComponent }
];
