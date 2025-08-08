import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Appointment {
  id?: string;
  patient_id: string;
  provider_id: string;
  appointment_date: string;
  appointment_time: string;
  duration: number;
  reason: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AppointmentRequest {
  provider_id: string;
  appointment_date: string;
  appointment_time: string;
  duration: number;
  reason: string;
  notes?: string;
}

export interface Provider {
  id: string;
  first_name: string;
  last_name: string;
  specialization: string;
  practice_name?: string;
  availability: Availability[];
}

export interface Availability {
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface AppointmentResponse {
  success: boolean;
  message: string;
  appointment?: Appointment;
  errors?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private readonly apiUrl = `${environment.apiUrl}/appointments`;
  private readonly providersUrl = `${environment.apiUrl}/providers`;

  constructor(private http: HttpClient) { }

  /**
   * Book a new appointment
   */
  bookAppointment(appointmentData: AppointmentRequest): Observable<AppointmentResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.post<AppointmentResponse>(`${this.apiUrl}/book`, appointmentData, { headers });
  }

  /**
   * Get patient appointments
   */
  getPatientAppointments(patientId: string, status?: string): Observable<Appointment[]> {
    let url = `${this.apiUrl}/patient/${patientId}`;
    if (status) {
      url += `?status=${status}`;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<Appointment[]>(url, { headers });
  }

  /**
   * Get appointment details
   */
  getAppointmentDetails(appointmentId: string): Observable<Appointment> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<Appointment>(`${this.apiUrl}/${appointmentId}`, { headers });
  }

  /**
   * Cancel appointment
   */
  cancelAppointment(appointmentId: string, reason?: string): Observable<AppointmentResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    const cancelData = { reason };
    return this.http.put<AppointmentResponse>(`${this.apiUrl}/${appointmentId}/cancel`, cancelData, { headers });
  }

  /**
   * Reschedule appointment
   */
  rescheduleAppointment(appointmentId: string, newDate: string, newTime: string): Observable<AppointmentResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    const rescheduleData = {
      appointment_date: newDate,
      appointment_time: newTime
    };

    return this.http.put<AppointmentResponse>(`${this.apiUrl}/${appointmentId}/reschedule`, rescheduleData, { headers });
  }

  /**
   * Get available providers
   */
  getAvailableProviders(specialization?: string): Observable<Provider[]> {
    let url = `${this.providersUrl}/available`;
    if (specialization) {
      url += `?specialization=${specialization}`;
    }

    return this.http.get<Provider[]>(url);
  }

  /**
   * Get provider availability
   */
  getProviderAvailability(providerId: string, date?: string): Observable<Availability[]> {
    let url = `${this.providersUrl}/${providerId}/availability`;
    if (date) {
      url += `?date=${date}`;
    }

    return this.http.get<Availability[]>(url);
  }

  /**
   * Get available time slots for a provider
   */
  getAvailableTimeSlots(providerId: string, date: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.providersUrl}/${providerId}/available-slots?date=${date}`);
  }

  /**
   * Get authentication token
   */
  private getToken(): string | null {
    return localStorage.getItem('patient_token');
  }
} 