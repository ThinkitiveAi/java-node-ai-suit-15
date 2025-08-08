import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { PatientRegistrationComponent } from './components/patient-registration/patient-registration.component';
import { routes } from './app-routing.module';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    AppComponent,
    PatientRegistrationComponent
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
