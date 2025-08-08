import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PatientRegistration } from '../models/patient-registration.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientRegistrationService {
  private readonly apiUrl = `${environment.apiUrl}/patients`;

  constructor(private http: HttpClient) { }

  /**
   * Register a new patient
   * @param patientData - Patient registration data
   * @returns Observable of the registration response
   */
  registerPatient(patientData: PatientRegistration): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/register`, patientData, { headers });
  }

  /**
   * Check if email is already registered
   * @param email - Email to check
   * @returns Observable of the email availability response
   */
  checkEmailAvailability(email: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/check-email?email=${encodeURIComponent(email)}`, { headers });
  }

  /**
   * Get patient registration form validation rules
   * @returns Observable of validation rules
   */
  getValidationRules(): Observable<any> {
    return this.http.get(`${this.apiUrl}/validation-rules`);
  }

  /**
   * Get list of insurance providers
   * @returns Observable of insurance providers
   */
  getInsuranceProviders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/insurance-providers`);
  }

  /**
   * Get list of states for address form
   * @returns Observable of states
   */
  getStates(): Observable<any> {
    return this.http.get(`${this.apiUrl}/states`);
  }
} 