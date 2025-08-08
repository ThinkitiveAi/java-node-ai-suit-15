import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProviderRegistrationComponent } from './components/provider-registration/provider-registration.component';
import { ProviderDashboardComponent } from './components/provider-dashboard/provider-dashboard.component';
import { ProviderLoginComponent } from './components/provider-login/provider-login.component';
import { ProviderProfileComponent } from './components/provider-profile/provider-profile.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { PatientsComponent } from './components/patients/patients.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'register', component: ProviderRegistrationComponent },
  { path: 'login', component: ProviderLoginComponent },
  { path: 'dashboard', component: ProviderDashboardComponent },
  { path: 'profile', component: ProviderProfileComponent },
  { path: 'appointments', component: AppointmentsComponent },
  { path: 'patients', component: PatientsComponent },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 