import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PatientDashboard {
  total_appointments: number;
  upcoming_appointments: number;
  completed_appointments: number;
  cancelled_appointments: number;
  recent_appointments: AppointmentSummary[];
  upcoming_appointments_list: AppointmentSummary[];
  medical_records_count: number;
  insurance_status: InsuranceStatus;
  recent_activities: Activity[];
}

export interface AppointmentSummary {
  id: string;
  provider_name: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  reason: string;
}

export interface InsuranceStatus {
  provider: string;
  policy_number: string;
  status: 'active' | 'expired' | 'pending';
  expiry_date?: string;
}

export interface Activity {
  id: string;
  type: 'appointment' | 'profile_update' | 'medical_record' | 'payment';
  description: string;
  timestamp: string;
  details?: any;
}

export interface MedicalRecord {
  id: string;
  record_type: string;
  date: string;
  provider_name: string;
  description: string;
  attachments?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly apiUrl = `${environment.apiUrl}/patients`;

  constructor(private http: HttpClient) { }

  /**
   * Get patient dashboard data
   */
  getPatientDashboard(patientId: string): Observable<PatientDashboard> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<PatientDashboard>(`${this.apiUrl}/${patientId}/dashboard`, { headers });
  }

  /**
   * Get patient medical records
   */
  getMedicalRecords(patientId: string): Observable<MedicalRecord[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<MedicalRecord[]>(`${this.apiUrl}/${patientId}/medical-records`, { headers });
  }

  /**
   * Get medical record details
   */
  getMedicalRecordDetails(recordId: string): Observable<MedicalRecord> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<MedicalRecord>(`${this.apiUrl}/medical-records/${recordId}`, { headers });
  }

  /**
   * Get patient insurance information
   */
  getInsuranceInfo(patientId: string): Observable<InsuranceStatus> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<InsuranceStatus>(`${this.apiUrl}/${patientId}/insurance`, { headers });
  }

  /**
   * Update insurance information
   */
  updateInsuranceInfo(patientId: string, insuranceData: Partial<InsuranceStatus>): Observable<InsuranceStatus> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.put<InsuranceStatus>(`${this.apiUrl}/${patientId}/insurance`, insuranceData, { headers });
  }

  /**
   * Get patient activity history
   */
  getActivityHistory(patientId: string, limit?: number): Observable<Activity[]> {
    let url = `${this.apiUrl}/${patientId}/activities`;
    if (limit) {
      url += `?limit=${limit}`;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<Activity[]>(url, { headers });
  }

  /**
   * Get patient statistics
   */
  getPatientStats(patientId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<any>(`${this.apiUrl}/${patientId}/stats`, { headers });
  }

  /**
   * Get authentication token
   */
  private getToken(): string | null {
    return localStorage.getItem('patient_token');
  }
} 