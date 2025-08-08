import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  AvailabilitySlot,
  BookingRequest,
  Booking,
  SlotUpdateRequest,
  RecurringSlotRequest,
  AvailabilityStats,
  CalendarEvent,
  SlotConflict
} from '../models/scheduling.models';

@Injectable({
  providedIn: 'root'
})
export class SchedulingService {
  private readonly apiUrl = `${environment.apiUrl}/scheduling`;
  private readonly providersUrl = `${environment.apiUrl}/providers`;
  
  private slotsSubject = new BehaviorSubject<AvailabilitySlot[]>([]);
  public slots$ = this.slotsSubject.asObservable();

  private selectedSlotSubject = new BehaviorSubject<AvailabilitySlot | null>(null);
  public selectedSlot$ = this.selectedSlotSubject.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Get provider's availability slots
   */
  getProviderSlots(providerId: string, filters?: any): Observable<AvailabilitySlot[]> {
    let url = `${this.providersUrl}/${providerId}/slots`;
    const params: string[] = [];
    
    if (filters) {
      if (filters.date) params.push(`date=${filters.date}`);
      if (filters.status) params.push(`status=${filters.status}`);
      if (filters.appointment_type) params.push(`appointment_type=${filters.appointment_type}`);
    }
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<AvailabilitySlot[]>(url, { headers })
      .pipe(
        tap(slots => this.slotsSubject.next(slots))
      );
  }

  /**
   * Create a new availability slot
   */
  createSlot(slotData: Partial<AvailabilitySlot>): Observable<AvailabilitySlot> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.post<AvailabilitySlot>(`${this.apiUrl}/slots`, slotData, { headers })
      .pipe(
        tap(slot => {
          const currentSlots = this.slotsSubject.value;
          this.slotsSubject.next([...currentSlots, slot]);
        })
      );
  }

  /**
   * Update an availability slot
   */
  updateSlot(slotId: string, updates: Partial<AvailabilitySlot>): Observable<AvailabilitySlot> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.put<AvailabilitySlot>(`${this.apiUrl}/slots/${slotId}`, updates, { headers })
      .pipe(
        tap(updatedSlot => {
          const currentSlots = this.slotsSubject.value;
          const updatedSlots = currentSlots.map(slot => 
            slot.id === slotId ? updatedSlot : slot
          );
          this.slotsSubject.next(updatedSlots);
        })
      );
  }

  /**
   * Delete an availability slot
   */
  deleteSlot(slotId: string, reason: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    const deleteData = { reason };

    return this.http.delete<any>(`${this.apiUrl}/slots/${slotId}`, { 
      headers, 
      body: deleteData 
    }).pipe(
      tap(() => {
        const currentSlots = this.slotsSubject.value;
        const filteredSlots = currentSlots.filter(slot => slot.id !== slotId);
        this.slotsSubject.next(filteredSlots);
      })
    );
  }

  /**
   * Create recurring slots
   */
  createRecurringSlots(recurringRequest: RecurringSlotRequest): Observable<AvailabilitySlot[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.post<AvailabilitySlot[]>(`${this.apiUrl}/slots/recurring`, recurringRequest, { headers })
      .pipe(
        tap(newSlots => {
          const currentSlots = this.slotsSubject.value;
          this.slotsSubject.next([...currentSlots, ...newSlots]);
        })
      );
  }

  /**
   * Get slot details
   */
  getSlotDetails(slotId: string): Observable<AvailabilitySlot> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<AvailabilitySlot>(`${this.apiUrl}/slots/${slotId}`, { headers });
  }

  /**
   * Check for slot conflicts
   */
  checkSlotConflicts(slotData: Partial<AvailabilitySlot>): Observable<SlotConflict[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.post<SlotConflict[]>(`${this.apiUrl}/slots/check-conflicts`, slotData, { headers });
  }

  /**
   * Get availability statistics
   */
  getAvailabilityStats(providerId: string): Observable<AvailabilityStats> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<AvailabilityStats>(`${this.providersUrl}/${providerId}/availability-stats`, { headers });
  }

  /**
   * Get calendar events for a date range
   */
  getCalendarEvents(providerId: string, startDate: string, endDate: string): Observable<CalendarEvent[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<CalendarEvent[]>(`${this.providersUrl}/${providerId}/calendar-events?start_date=${startDate}&end_date=${endDate}`, { headers });
  }

  /**
   * Book an appointment
   */
  bookAppointment(bookingRequest: BookingRequest): Observable<Booking> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.post<Booking>(`${this.apiUrl}/bookings`, bookingRequest, { headers });
  }

  /**
   * Get slot bookings
   */
  getSlotBookings(slotId: string): Observable<Booking[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<Booking[]>(`${this.apiUrl}/slots/${slotId}/bookings`, { headers });
  }

  /**
   * Update booking status
   */
  updateBookingStatus(bookingId: string, status: string, notes?: string): Observable<Booking> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    const updateData = { status, notes };
    return this.http.put<Booking>(`${this.apiUrl}/bookings/${bookingId}`, updateData, { headers });
  }

  /**
   * Cancel booking
   */
  cancelBooking(bookingId: string, reason: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    const cancelData = { reason };
    return this.http.put<any>(`${this.apiUrl}/bookings/${bookingId}/cancel`, cancelData, { headers });
  }

  /**
   * Get provider's schedule
   */
  getProviderSchedule(providerId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<any>(`${this.providersUrl}/${providerId}/schedule`, { headers });
  }

  /**
   * Update provider's schedule
   */
  updateProviderSchedule(providerId: string, scheduleData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.put<any>(`${this.providersUrl}/${providerId}/schedule`, scheduleData, { headers });
  }

  /**
   * Set selected slot
   */
  setSelectedSlot(slot: AvailabilitySlot | null): void {
    this.selectedSlotSubject.next(slot);
  }

  /**
   * Get authentication token
   */
  private getToken(): string | null {
    return localStorage.getItem('provider_token');
  }
} 