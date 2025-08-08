import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProviderRegistrationComponent } from './components/provider-registration/provider-registration.component';
import { ProviderDashboardComponent } from './components/provider-dashboard/provider-dashboard.component';
import { ProviderLoginComponent } from './components/provider-login/provider-login.component';
import { ProviderProfileComponent } from './components/provider-profile/provider-profile.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { PatientsComponent } from './components/patients/patients.component';

@NgModule({
  declarations: [
    AppComponent,
    ProviderRegistrationComponent,
    ProviderDashboardComponent,
    ProviderLoginComponent,
    ProviderProfileComponent,
    AppointmentsComponent,
    PatientsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { } 