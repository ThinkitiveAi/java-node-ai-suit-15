import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AppointmentCreateRequest {
  patient_id: string;
  appointment_date: string;
  appointment_time: string;
  duration: number;
  reason: string;
  notes?: string;
}

export interface AppointmentUpdateRequest {
  appointment_date?: string;
  appointment_time?: string;
  duration?: number;
  reason?: string;
  notes?: string;
  status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
}

export interface AppointmentFilter {
  status?: string;
  date?: string;
  patient_name?: string;
  provider_id?: string;
}

export interface AppointmentStats {
  total_appointments: number;
  scheduled_appointments: number;
  confirmed_appointments: number;
  completed_appointments: number;
  cancelled_appointments: number;
  no_show_appointments: number;
  today_appointments: number;
  upcoming_appointments: number;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentManagementService {
  private readonly apiUrl = `${environment.apiUrl}/appointments`;
  private readonly providersUrl = `${environment.apiUrl}/providers`;

  constructor(private http: HttpClient) { }

  /**
   * Create a new appointment
   */
  createAppointment(appointmentData: AppointmentCreateRequest): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.post<any>(`${this.apiUrl}/create`, appointmentData, { headers });
  }

  /**
   * Update appointment
   */
  updateAppointment(appointmentId: string, updateData: AppointmentUpdateRequest): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.put<any>(`${this.apiUrl}/${appointmentId}`, updateData, { headers });
  }

  /**
   * Get appointments with filters
   */
  getAppointments(filters?: AppointmentFilter): Observable<any[]> {
    let url = `${this.apiUrl}`;
    const params: string[] = [];
    
    if (filters) {
      if (filters.status) params.push(`status=${filters.status}`);
      if (filters.date) params.push(`date=${filters.date}`);
      if (filters.patient_name) params.push(`patient_name=${filters.patient_name}`);
      if (filters.provider_id) params.push(`provider_id=${filters.provider_id}`);
    }
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<any[]>(url, { headers });
  }

  /**
   * Get appointment statistics
   */
  getAppointmentStats(providerId: string): Observable<AppointmentStats> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<AppointmentStats>(`${this.providersUrl}/${providerId}/appointment-stats`, { headers });
  }

  /**
   * Get today's appointments
   */
  getTodayAppointments(providerId: string): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<any[]>(`${this.providersUrl}/${providerId}/today-appointments`, { headers });
  }

  /**
   * Get upcoming appointments
   */
  getUpcomingAppointments(providerId: string, days?: number): Observable<any[]> {
    let url = `${this.providersUrl}/${providerId}/upcoming-appointments`;
    if (days) {
      url += `?days=${days}`;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<any[]>(url, { headers });
  }

  /**
   * Confirm appointment
   */
  confirmAppointment(appointmentId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.put<any>(`${this.apiUrl}/${appointmentId}/confirm`, {}, { headers });
  }

  /**
   * Complete appointment
   */
  completeAppointment(appointmentId: string, notes?: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    const completeData = { notes };
    return this.http.put<any>(`${this.apiUrl}/${appointmentId}/complete`, completeData, { headers });
  }

  /**
   * Cancel appointment
   */
  cancelAppointment(appointmentId: string, reason?: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    const cancelData = { reason };
    return this.http.put<any>(`${this.apiUrl}/${appointmentId}/cancel`, cancelData, { headers });
  }

  /**
   * Mark appointment as no-show
   */
  markNoShow(appointmentId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.put<any>(`${this.apiUrl}/${appointmentId}/no-show`, {}, { headers });
  }

  /**
   * Get appointment calendar
   */
  getAppointmentCalendar(providerId: string, month: string, year: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<any>(`${this.providersUrl}/${providerId}/calendar?month=${month}&year=${year}`, { headers });
  }

  /**
   * Get authentication token
   */
  private getToken(): string | null {
    return localStorage.getItem('provider_token');
  }
} 