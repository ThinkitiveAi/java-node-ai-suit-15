export interface AvailabilitySlot {
  id?: string;
  provider_id: string;
  date: string;
  start_time: string;
  end_time: string;
  timezone: string;
  appointment_type: AppointmentType;
  slot_duration: number; // minutes
  break_duration: number; // minutes
  max_appointments: number;
  current_bookings: number;
  location: Location;
  pricing: Pricing;
  notes?: string;
  tags: string[];
  is_recurring: boolean;
  recurrence_pattern?: RecurrencePattern;
  status: 'available' | 'booked' | 'cancelled' | 'expired';
  created_at?: string;
  updated_at?: string;
}

export interface AppointmentType {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  color: string;
  category: 'consultation' | 'follow-up' | 'emergency' | 'routine' | 'specialized';
}

export interface Location {
  type: 'physical' | 'virtual' | 'hybrid';
  name: string;
  address?: string;
  room?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  virtual_meeting_url?: string;
  instructions?: string;
}

export interface Pricing {
  fee: number;
  currency: string;
  insurance_accepted: boolean;
  insurance_providers?: string[];
  self_pay_discount?: number;
  cancellation_fee?: number;
  deposit_required?: boolean;
  deposit_amount?: number;
}

export interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number;
  days_of_week?: number[]; // 0=Sunday, 1=Monday, etc.
  end_date?: string;
  max_occurrences?: number;
  exceptions?: string[]; // dates to exclude
}

export interface BookingRequest {
  slot_id: string;
  patient_id: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  reason: string;
  insurance_provider?: string;
  insurance_policy_number?: string;
  special_requirements?: string;
  emergency_contact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface Booking {
  id?: string;
  slot_id: string;
  patient_id: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  appointment_date: string;
  appointment_time: string;
  timezone: string;
  reason: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'no_show';
  insurance_provider?: string;
  insurance_policy_number?: string;
  special_requirements?: string;
  emergency_contact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  provider_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SearchFilters {
  date_range?: {
    start_date: string;
    end_date: string;
  };
  specialization?: string;
  location?: string;
  appointment_type?: string;
  insurance_provider?: string;
  max_price?: number;
  timezone?: string;
  availability?: 'morning' | 'afternoon' | 'evening' | 'any';
}

export interface ProviderSearchResult {
  id: string;
  name: string;
  specialization: string;
  experience_years: number;
  rating: number;
  review_count: number;
  clinic_info: {
    name: string;
    address: string;
    phone: string;
  };
  available_slots: AvailabilitySlot[];
  insurance_accepted: string[];
  languages: string[];
  education: string[];
  certifications: string[];
}

export interface TimezoneInfo {
  name: string;
  offset: string;
  abbreviation: string;
  is_dst: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  color: string;
  slot: AvailabilitySlot;
  is_booked: boolean;
  booking_count: number;
}

export interface ValidationRule {
  field: string;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  pattern?: string;
  customValidation?: (value: any) => boolean;
  errorMessage: string;
}

export interface SlotConflict {
  type: 'overlap' | 'break_violation' | 'max_appointments' | 'timezone_mismatch';
  message: string;
  conflicting_slot?: AvailabilitySlot;
}

export interface RecurringSlotRequest {
  base_slot: Partial<AvailabilitySlot>;
  recurrence: RecurrencePattern;
  exceptions?: string[];
}

export interface SlotUpdateRequest {
  slot_id: string;
  updates: Partial<AvailabilitySlot>;
  reason?: string;
  notify_patients?: boolean;
}

export interface BookingConfirmation {
  booking_id: string;
  slot: AvailabilitySlot;
  booking: Booking;
  confirmation_code: string;
  qr_code?: string;
  calendar_invite?: {
    ics_url: string;
    google_calendar_url: string;
    outlook_url: string;
  };
  reminders?: {
    email_24h: boolean;
    email_1h: boolean;
    sms_1h: boolean;
  };
}

export interface AvailabilityStats {
  total_slots: number;
  available_slots: number;
  booked_slots: number;
  cancelled_slots: number;
  upcoming_bookings: number;
  today_bookings: number;
  revenue_this_month: number;
  average_booking_rate: number;
}

export interface NotificationSettings {
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  booking_confirmations: boolean;
  booking_reminders: boolean;
  cancellation_notifications: boolean;
  availability_updates: boolean;
}

export interface ProviderSchedule {
  provider_id: string;
  weekdays: {
    monday: DaySchedule;
    tuesday: DaySchedule;
    wednesday: DaySchedule;
    thursday: DaySchedule;
    friday: DaySchedule;
    saturday: DaySchedule;
    sunday: DaySchedule;
  };
  timezone: string;
  default_slot_duration: number;
  default_break_duration: number;
  working_hours: {
    start_time: string;
    end_time: string;
  };
}

export interface DaySchedule {
  is_working_day: boolean;
  start_time?: string;
  end_time?: string;
  break_start?: string;
  break_end?: string;
  appointment_types?: string[];
  max_appointments?: number;
} 