import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Provider, ProviderRegistrationResponse, ProviderLoginRequest, ProviderLoginResponse, ProviderProfile, ProviderDashboard, Appointment, Patient } from '../models/provider.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  private readonly baseUrl = environment.apiUrl;
  private readonly providerUrl = `${this.baseUrl}/providers`;

  constructor(private http: HttpClient) { }

  /**
   * Register a new provider
   */
  registerProvider(providerData: Provider): Observable<ProviderRegistrationResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<ProviderRegistrationResponse>(`${this.providerUrl}/register`, providerData, { headers });
  }

  /**
   * Login provider
   */
  loginProvider(loginData: ProviderLoginRequest): Observable<ProviderLoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<ProviderLoginResponse>(`${this.providerUrl}/login`, loginData, { headers });
  }

  /**
   * Get provider profile
   */
  getProviderProfile(providerId: string): Observable<ProviderProfile> {
    return this.http.get<ProviderProfile>(`${this.providerUrl}/${providerId}/profile`);
  }

  /**
   * Update provider profile
   */
  updateProviderProfile(providerId: string, profileData: Partial<Provider>): Observable<ProviderProfile> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put<ProviderProfile>(`${this.providerUrl}/${providerId}/profile`, profileData, { headers });
  }

  /**
   * Get provider dashboard data
   */
  getProviderDashboard(providerId: string): Observable<ProviderDashboard> {
    return this.http.get<ProviderDashboard>(`${this.providerUrl}/${providerId}/dashboard`);
  }

  /**
   * Get provider appointments
   */
  getProviderAppointments(providerId: string, status?: string, date?: string): Observable<Appointment[]> {
    let url = `${this.providerUrl}/${providerId}/appointments`;
    const params: string[] = [];
    
    if (status) {
      params.push(`status=${status}`);
    }
    if (date) {
      params.push(`date=${date}`);
    }
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return this.http.get<Appointment[]>(url);
  }

  /**
   * Update appointment status
   */
  updateAppointmentStatus(appointmentId: string, status: string, notes?: string): Observable<Appointment> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const updateData = { status, notes };
    return this.http.put<Appointment>(`${this.baseUrl}/appointments/${appointmentId}`, updateData, { headers });
  }

  /**
   * Get provider patients
   */
  getProviderPatients(providerId: string): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.providerUrl}/${providerId}/patients`);
  }

  /**
   * Get patient details
   */
  getPatientDetails(patientId: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.baseUrl}/patients/${patientId}`);
  }

  /**
   * Check email availability
   */
  checkEmailAvailability(email: string): Observable<any> {
    return this.http.get(`${this.providerUrl}/check-email?email=${encodeURIComponent(email)}`);
  }

  /**
   * Get specializations
   */
  getSpecializations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.providerUrl}/specializations`);
  }

  /**
   * Get insurance providers
   */
  getInsuranceProviders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.providerUrl}/insurance-providers`);
  }

  /**
   * Get states
   */
  getStates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.providerUrl}/states`);
  }
} 