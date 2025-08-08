import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  AvailabilitySlot,
  ProviderSchedule,
  DaySchedule,
  TimezoneInfo,
  SlotConflict,
  ValidationRule
} from '../models/scheduling.models';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {
  private readonly apiUrl = `${environment.apiUrl}/availability`;
  private readonly providersUrl = `${environment.apiUrl}/providers`;

  private currentTimezoneSubject = new BehaviorSubject<string>('UTC');
  public currentTimezone$ = this.currentTimezoneSubject.asObservable();

  private availableTimezones: TimezoneInfo[] = [
    { name: 'UTC', offset: '+00:00', abbreviation: 'UTC', is_dst: false },
    { name: 'America/New_York', offset: '-05:00', abbreviation: 'EST', is_dst: false },
    { name: 'America/Chicago', offset: '-06:00', abbreviation: 'CST', is_dst: false },
    { name: 'America/Denver', offset: '-07:00', abbreviation: 'MST', is_dst: false },
    { name: 'America/Los_Angeles', offset: '-08:00', abbreviation: 'PST', is_dst: false },
    { name: 'Europe/London', offset: '+00:00', abbreviation: 'GMT', is_dst: false },
    { name: 'Europe/Paris', offset: '+01:00', abbreviation: 'CET', is_dst: false },
    { name: 'Asia/Tokyo', offset: '+09:00', abbreviation: 'JST', is_dst: false },
    { name: 'Asia/Shanghai', offset: '+08:00', abbreviation: 'CST', is_dst: false },
    { name: 'Australia/Sydney', offset: '+10:00', abbreviation: 'AEST', is_dst: false }
  ];

  constructor(private http: HttpClient) {
    this.detectUserTimezone();
  }

  /**
   * Get provider's availability schedule
   */
  getProviderAvailability(providerId: string): Observable<ProviderSchedule> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<ProviderSchedule>(`${this.providersUrl}/${providerId}/availability`, { headers });
  }

  /**
   * Update provider's availability schedule
   */
  updateProviderAvailability(providerId: string, schedule: ProviderSchedule): Observable<ProviderSchedule> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.put<ProviderSchedule>(`${this.providersUrl}/${providerId}/availability`, schedule, { headers });
  }

  /**
   * Get available time slots for a specific date
   */
  getAvailableTimeSlots(providerId: string, date: string, timezone?: string): Observable<string[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    let url = `${this.providersUrl}/${providerId}/available-slots?date=${date}`;
    if (timezone) {
      url += `&timezone=${timezone}`;
    }

    return this.http.get<string[]>(url, { headers });
  }

  /**
   * Check if a time slot is available
   */
  checkSlotAvailability(providerId: string, date: string, startTime: string, endTime: string): Observable<boolean> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    const checkData = { date, start_time: startTime, end_time: endTime };

    return this.http.post<{ available: boolean }>(`${this.providersUrl}/${providerId}/check-availability`, checkData, { headers })
      .pipe(map(response => response.available));
  }

  /**
   * Get timezone information
   */
  getTimezoneInfo(timezone: string): TimezoneInfo | undefined {
    return this.availableTimezones.find(tz => tz.name === timezone);
  }

  /**
   * Get all available timezones
   */
  getAvailableTimezones(): TimezoneInfo[] {
    return [...this.availableTimezones];
  }

  /**
   * Convert time between timezones
   */
  convertTime(time: string, fromTimezone: string, toTimezone: string): string {
    // This is a simplified conversion - in a real app, you'd use a library like moment-timezone
    const date = new Date(`2000-01-01T${time}:00`);
    
    // Get timezone offsets (simplified)
    const fromOffset = this.getTimezoneOffset(fromTimezone);
    const toOffset = this.getTimezoneOffset(toTimezone);
    
    // Calculate difference
    const offsetDiff = toOffset - fromOffset;
    const convertedDate = new Date(date.getTime() + (offsetDiff * 60 * 1000));
    
    return convertedDate.toTimeString().slice(0, 5);
  }

  /**
   * Validate slot data
   */
  validateSlot(slotData: Partial<AvailabilitySlot>): ValidationRule[] {
    const errors: ValidationRule[] = [];

    // Required fields
    if (!slotData.date) {
      errors.push({ field: 'date', required: true, errorMessage: 'Date is required' });
    }

    if (!slotData.start_time) {
      errors.push({ field: 'start_time', required: true, errorMessage: 'Start time is required' });
    }

    if (!slotData.end_time) {
      errors.push({ field: 'end_time', required: true, errorMessage: 'End time is required' });
    }

    // Time validation
    if (slotData.start_time && slotData.end_time) {
      if (slotData.start_time >= slotData.end_time) {
        errors.push({ 
          field: 'time_range', 
          required: false, 
          errorMessage: 'End time must be after start time' 
        });
      }
    }

    // Duration validation
    if (slotData.slot_duration) {
      if (slotData.slot_duration < 15 || slotData.slot_duration > 60) {
        errors.push({ 
          field: 'slot_duration', 
          required: false, 
          minValue: 15, 
          maxValue: 60, 
          errorMessage: 'Slot duration must be between 15 and 60 minutes' 
        });
      }
    }

    if (slotData.break_duration) {
      if (slotData.break_duration < 5 || slotData.break_duration > 30) {
        errors.push({ 
          field: 'break_duration', 
          required: false, 
          minValue: 5, 
          maxValue: 30, 
          errorMessage: 'Break duration must be between 5 and 30 minutes' 
        });
      }
    }

    // Max appointments validation
    if (slotData.max_appointments) {
      if (slotData.max_appointments < 1 || slotData.max_appointments > 10) {
        errors.push({ 
          field: 'max_appointments', 
          required: false, 
          minValue: 1, 
          maxValue: 10, 
          errorMessage: 'Max appointments must be between 1 and 10' 
        });
      }
    }

    // Location validation for physical appointments
    if (slotData.location?.type === 'physical' && !slotData.location?.address) {
      errors.push({ 
        field: 'location.address', 
        required: true, 
        errorMessage: 'Address is required for physical appointments' 
      });
    }

    return errors;
  }

  /**
   * Check for slot conflicts
   */
  checkSlotConflicts(providerId: string, slotData: Partial<AvailabilitySlot>): Observable<SlotConflict[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.post<SlotConflict[]>(`${this.providersUrl}/${providerId}/check-conflicts`, slotData, { headers });
  }

  /**
   * Generate time slots based on schedule
   */
  generateTimeSlots(startTime: string, endTime: string, slotDuration: number, breakDuration: number): string[] {
    const slots: string[] = [];
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    
    let current = new Date(start);
    
    while (current < end) {
      slots.push(current.toTimeString().slice(0, 5));
      
      // Add slot duration
      current.setMinutes(current.getMinutes() + slotDuration);
      
      // Add break duration if not the last slot
      if (current < end) {
        current.setMinutes(current.getMinutes() + breakDuration);
      }
    }
    
    return slots;
  }

  /**
   * Set current timezone
   */
  setCurrentTimezone(timezone: string): void {
    this.currentTimezoneSubject.next(timezone);
  }

  /**
   * Get current timezone
   */
  getCurrentTimezone(): string {
    return this.currentTimezoneSubject.value;
  }

  /**
   * Detect user's timezone
   */
  private detectUserTimezone(): void {
    try {
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      this.setCurrentTimezone(userTimezone);
    } catch (error) {
      console.warn('Could not detect user timezone, using UTC');
      this.setCurrentTimezone('UTC');
    }
  }

  /**
   * Get timezone offset in minutes
   */
  private getTimezoneOffset(timezone: string): number {
    const timezoneMap: { [key: string]: number } = {
      'UTC': 0,
      'America/New_York': -300,
      'America/Chicago': -360,
      'America/Denver': -420,
      'America/Los_Angeles': -480,
      'Europe/London': 0,
      'Europe/Paris': 60,
      'Asia/Tokyo': 540,
      'Asia/Shanghai': 480,
      'Australia/Sydney': 600
    };
    
    return timezoneMap[timezone] || 0;
  }

  /**
   * Get authentication token
   */
  private getToken(): string | null {
    return localStorage.getItem('provider_token');
  }
} 