import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PatientSearchFilter {
  name?: string;
  email?: string;
  phone?: string;
  insurance_provider?: string;
  status?: string;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  record_type: string;
  date: string;
  provider_name: string;
  diagnosis?: string;
  treatment?: string;
  medications?: string[];
  notes?: string;
  attachments?: string[];
  created_at: string;
  updated_at: string;
}

export interface MedicalRecordCreate {
  patient_id: string;
  record_type: string;
  date: string;
  diagnosis?: string;
  treatment?: string;
  medications?: string[];
  notes?: string;
}

export interface PatientStats {
  total_patients: number;
  active_patients: number;
  new_patients_this_month: number;
  patients_with_appointments: number;
  patients_with_medical_records: number;
}

export interface PatientSearchResult {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  gender: string;
  insurance_provider?: string;
  last_appointment?: string;
  medical_records_count: number;
}

@Injectable({
  providedIn: 'root'
})
export class PatientManagementService {
  private readonly apiUrl = `${environment.apiUrl}/patients`;
  private readonly providersUrl = `${environment.apiUrl}/providers`;

  constructor(private http: HttpClient) { }

  /**
   * Search patients
   */
  searchPatients(filters?: PatientSearchFilter): Observable<PatientSearchResult[]> {
    let url = `${this.apiUrl}/search`;
    const params: string[] = [];
    
    if (filters) {
      if (filters.name) params.push(`name=${filters.name}`);
      if (filters.email) params.push(`email=${filters.email}`);
      if (filters.phone) params.push(`phone=${filters.phone}`);
      if (filters.insurance_provider) params.push(`insurance_provider=${filters.insurance_provider}`);
      if (filters.status) params.push(`status=${filters.status}`);
    }
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<PatientSearchResult[]>(url, { headers });
  }

  /**
   * Get patient details
   */
  getPatientDetails(patientId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<any>(`${this.apiUrl}/${patientId}`, { headers });
  }

  /**
   * Get patient medical records
   */
  getPatientMedicalRecords(patientId: string): Observable<MedicalRecord[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<MedicalRecord[]>(`${this.apiUrl}/${patientId}/medical-records`, { headers });
  }

  /**
   * Create medical record
   */
  createMedicalRecord(recordData: MedicalRecordCreate): Observable<MedicalRecord> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.post<MedicalRecord>(`${this.apiUrl}/medical-records`, recordData, { headers });
  }

  /**
   * Update medical record
   */
  updateMedicalRecord(recordId: string, recordData: Partial<MedicalRecord>): Observable<MedicalRecord> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.put<MedicalRecord>(`${this.apiUrl}/medical-records/${recordId}`, recordData, { headers });
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
   * Delete medical record
   */
  deleteMedicalRecord(recordId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.delete<any>(`${this.apiUrl}/medical-records/${recordId}`, { headers });
  }

  /**
   * Get provider's patient statistics
   */
  getPatientStats(providerId: string): Observable<PatientStats> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<PatientStats>(`${this.providersUrl}/${providerId}/patient-stats`, { headers });
  }

  /**
   * Get patient appointment history
   */
  getPatientAppointmentHistory(patientId: string): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<any[]>(`${this.apiUrl}/${patientId}/appointment-history`, { headers });
  }

  /**
   * Get patient insurance information
   */
  getPatientInsurance(patientId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<any>(`${this.apiUrl}/${patientId}/insurance`, { headers });
  }

  /**
   * Update patient insurance information
   */
  updatePatientInsurance(patientId: string, insuranceData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.put<any>(`${this.apiUrl}/${patientId}/insurance`, insuranceData, { headers });
  }

  /**
   * Get patient emergency contact
   */
  getPatientEmergencyContact(patientId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<any>(`${this.apiUrl}/${patientId}/emergency-contact`, { headers });
  }

  /**
   * Update patient emergency contact
   */
  updatePatientEmergencyContact(patientId: string, contactData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.put<any>(`${this.apiUrl}/${patientId}/emergency-contact`, contactData, { headers });
  }

  /**
   * Export patient data
   */
  exportPatientData(patientId: string, format: 'pdf' | 'csv' = 'pdf'): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<any>(`${this.apiUrl}/${patientId}/export?format=${format}`, { headers });
  }

  /**
   * Get authentication token
   */
  private getToken(): string | null {
    return localStorage.getItem('provider_token');
  }
} 