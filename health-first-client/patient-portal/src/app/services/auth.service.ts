import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface PatientLoginRequest {
  email: string;
  password: string;
}

export interface PatientLoginResponse {
  success: boolean;
  message: string;
  token?: string;
  patient?: any;
  errors?: string[];
}

export interface PatientProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  gender: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  insurance_provider?: string;
  insurance_policy_number?: string;
  medical_history?: string;
  emergency_contact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/patients`;
  private currentPatientSubject = new BehaviorSubject<PatientProfile | null>(null);
  public currentPatient$ = this.currentPatientSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredPatient();
  }

  /**
   * Patient login
   */
  login(loginData: PatientLoginRequest): Observable<PatientLoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<PatientLoginResponse>(`${this.apiUrl}/login`, loginData, { headers })
      .pipe(
        map(response => {
          if (response.success && response.token) {
            localStorage.setItem('patient_token', response.token);
            if (response.patient) {
              this.currentPatientSubject.next(response.patient);
              localStorage.setItem('patient_profile', JSON.stringify(response.patient));
            }
          }
          return response;
        })
      );
  }

  /**
   * Patient logout
   */
  logout(): void {
    localStorage.removeItem('patient_token');
    localStorage.removeItem('patient_profile');
    this.currentPatientSubject.next(null);
  }

  /**
   * Check if patient is logged in
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('patient_token');
  }

  /**
   * Get current patient profile
   */
  getCurrentPatient(): PatientProfile | null {
    return this.currentPatientSubject.value;
  }

  /**
   * Get patient profile from API
   */
  getPatientProfile(patientId: string): Observable<PatientProfile> {
    return this.http.get<PatientProfile>(`${this.apiUrl}/${patientId}/profile`);
  }

  /**
   * Update patient profile
   */
  updatePatientProfile(patientId: string, profileData: Partial<PatientProfile>): Observable<PatientProfile> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.put<PatientProfile>(`${this.apiUrl}/${patientId}/profile`, profileData, { headers });
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return localStorage.getItem('patient_token');
  }

  /**
   * Load stored patient data
   */
  private loadStoredPatient(): void {
    const storedProfile = localStorage.getItem('patient_profile');
    if (storedProfile) {
      try {
        const patient = JSON.parse(storedProfile);
        this.currentPatientSubject.next(patient);
      } catch (error) {
        console.error('Error parsing stored patient profile:', error);
        localStorage.removeItem('patient_profile');
      }
    }
  }
} 