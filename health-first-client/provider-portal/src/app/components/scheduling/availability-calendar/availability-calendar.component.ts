import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, Observable, combineLatest } from 'rxjs';
import { takeUntil, map, switchMap } from 'rxjs/operators';
import { SchedulingService } from '../services/scheduling.service';
import { AvailabilityService } from '../services/availability.service';
import {
  AvailabilitySlot,
  CalendarEvent,
  AvailabilityStats,
  ProviderSchedule,
  TimezoneInfo
} from '../models/scheduling.models';

@Component({
  selector: 'app-availability-calendar',
  templateUrl: './availability-calendar.component.html',
  styleUrls: ['./availability-calendar.component.scss']
})
export class AvailabilityCalendarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Calendar state
  currentDate = new Date();
  selectedDate: Date | null = null;
  viewMode: 'week' | 'month' = 'week';
  
  // Data
  slots$: Observable<AvailabilitySlot[]>;
  calendarEvents$: Observable<CalendarEvent[]>;
  stats$: Observable<AvailabilityStats>;
  schedule$: Observable<ProviderSchedule>;
  timezones$: Observable<TimezoneInfo[]>;
  
  // Forms
  filterForm: FormGroup;
  quickSlotForm: FormGroup;
  
  // UI state
  isLoading = false;
  showQuickSlotForm = false;
  showSlotDetails = false;
  selectedSlot: AvailabilitySlot | null = null;
  
  // Calendar navigation
  weekStart: Date;
  weekEnd: Date;
  monthStart: Date;
  monthEnd: Date;

  constructor(
    private schedulingService: SchedulingService,
    private availabilityService: AvailabilityService,
    private fb: FormBuilder
  ) {
    this.initializeForms();
    this.initializeCalendarDates();
  }

  ngOnInit(): void {
    this.loadData();
    this.setupSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize forms
   */
  private initializeForms(): void {
    this.filterForm = this.fb.group({
      date: [this.currentDate],
      status: ['all'],
      appointment_type: ['all'],
      timezone: [this.availabilityService.getCurrentTimezone()]
    });

    this.quickSlotForm = this.fb.group({
      date: [''],
      start_time: [''],
      end_time: [''],
      appointment_type: [''],
      slot_duration: [30],
      break_duration: [15],
      max_appointments: [1],
      location_type: ['virtual'],
      notes: ['']
    });
  }

  /**
   * Initialize calendar dates
   */
  private initializeCalendarDates(): void {
    this.updateCalendarDates();
  }

  /**
   * Load initial data
   */
  private loadData(): void {
    const providerId = this.getCurrentProviderId();
    
    this.slots$ = this.schedulingService.getProviderSlots(providerId);
    this.stats$ = this.schedulingService.getAvailabilityStats(providerId);
    this.schedule$ = this.availabilityService.getProviderAvailability(providerId);
    this.timezones$ = this.availabilityService.getAvailableTimezones();
    
    this.calendarEvents$ = this.slots$.pipe(
      map(slots => this.convertSlotsToEvents(slots))
    );
  }

  /**
   * Setup subscriptions
   */
  private setupSubscriptions(): void {
    // Filter form changes
    this.filterForm.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(filters => {
      this.applyFilters(filters);
    });

    // Selected slot changes
    this.schedulingService.selectedSlot$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(slot => {
      this.selectedSlot = slot;
      this.showSlotDetails = !!slot;
    });
  }

  /**
   * Convert slots to calendar events
   */
  private convertSlotsToEvents(slots: AvailabilitySlot[]): CalendarEvent[] {
    return slots.map(slot => ({
      id: slot.id || '',
      title: `${slot.appointment_type.name} (${slot.current_bookings}/${slot.max_appointments})`,
      start: new Date(`${slot.date}T${slot.start_time}`),
      end: new Date(`${slot.date}T${slot.end_time}`),
      allDay: false,
      color: slot.appointment_type.color,
      slot: slot,
      is_booked: slot.current_bookings > 0,
      booking_count: slot.current_bookings
    }));
  }

  /**
   * Apply filters
   */
  private applyFilters(filters: any): void {
    this.isLoading = true;
    const providerId = this.getCurrentProviderId();
    
    this.schedulingService.getProviderSlots(providerId, filters).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.isLoading = false;
    });
  }

  /**
   * Navigation methods
   */
  previousWeek(): void {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.updateCalendarDates();
    this.loadData();
  }

  nextWeek(): void {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.updateCalendarDates();
    this.loadData();
  }

  previousMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.updateCalendarDates();
    this.loadData();
  }

  nextMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.updateCalendarDates();
    this.updateCalendarDates();
    this.loadData();
  }

  goToToday(): void {
    this.currentDate = new Date();
    this.updateCalendarDates();
    this.loadData();
  }

  /**
   * Update calendar date ranges
   */
  private updateCalendarDates(): void {
    if (this.viewMode === 'week') {
      this.updateWeekDates();
    } else {
      this.updateMonthDates();
    }
  }

  private updateWeekDates(): void {
    const start = new Date(this.currentDate);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    
    this.weekStart = new Date(start.setDate(diff));
    this.weekEnd = new Date(this.weekStart);
    this.weekEnd.setDate(this.weekEnd.getDate() + 6);
  }

  private updateMonthDates(): void {
    this.monthStart = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    this.monthEnd = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
  }

  /**
   * View mode changes
   */
  setViewMode(mode: 'week' | 'month'): void {
    this.viewMode = mode;
    this.updateCalendarDates();
    this.loadData();
  }

  /**
   * Date selection
   */
  selectDate(date: Date): void {
    this.selectedDate = date;
    this.quickSlotForm.patchValue({
      date: this.formatDate(date)
    });
  }

  /**
   * Slot selection
   */
  selectSlot(slot: AvailabilitySlot): void {
    this.schedulingService.setSelectedSlot(slot);
  }

  /**
   * Quick slot creation
   */
  showQuickSlotFormForDate(date: Date): void {
    this.selectDate(date);
    this.showQuickSlotForm = true;
    this.quickSlotForm.patchValue({
      date: this.formatDate(date)
    });
  }

  createQuickSlot(): void {
    if (this.quickSlotForm.valid) {
      const slotData = this.quickSlotForm.value;
      const providerId = this.getCurrentProviderId();
      
      this.isLoading = true;
      this.schedulingService.createSlot({
        ...slotData,
        provider_id: providerId,
        timezone: this.availabilityService.getCurrentTimezone()
      }).subscribe({
        next: () => {
          this.showQuickSlotForm = false;
          this.quickSlotForm.reset();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error creating slot:', error);
          this.isLoading = false;
        }
      });
    }
  }

  /**
   * Timezone changes
   */
  onTimezoneChange(timezone: string): void {
    this.availabilityService.setCurrentTimezone(timezone);
    this.filterForm.patchValue({ timezone });
  }

  /**
   * Utility methods
   */
  private getCurrentProviderId(): string {
    // In a real app, this would come from auth service
    return 'current-provider-id';
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Get week days
   */
  getWeekDays(): Date[] {
    const days: Date[] = [];
    const start = new Date(this.weekStart);
    
    for (let i = 0; i < 7; i++) {
      days.push(new Date(start));
      start.setDate(start.getDate() + 1);
    }
    
    return days;
  }

  /**
   * Get month days
   */
  getMonthDays(): Date[] {
    const days: Date[] = [];
    const start = new Date(this.monthStart);
    const end = new Date(this.monthEnd);
    
    // Add padding days from previous month
    const firstDay = start.getDay();
    for (let i = firstDay - 1; i >= 0; i--) {
      const paddingDate = new Date(start);
      paddingDate.setDate(paddingDate.getDate() - (i + 1));
      days.push(paddingDate);
    }
    
    // Add current month days
    while (start <= end) {
      days.push(new Date(start));
      start.setDate(start.getDate() + 1);
    }
    
    // Add padding days from next month
    const lastDay = end.getDay();
    for (let i = 1; i <= 6 - lastDay; i++) {
      const paddingDate = new Date(end);
      paddingDate.setDate(paddingDate.getDate() + i);
      days.push(paddingDate);
    }
    
    return days;
  }

  /**
   * Check if date is today
   */
  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  /**
   * Check if date is selected
   */
  isSelected(date: Date): boolean {
    return this.selectedDate?.toDateString() === date.toDateString();
  }

  /**
   * Check if date is in current view
   */
  isInCurrentView(date: Date): boolean {
    if (this.viewMode === 'week') {
      return date >= this.weekStart && date <= this.weekEnd;
    } else {
      return date >= this.monthStart && date <= this.monthEnd;
    }
  }
} 