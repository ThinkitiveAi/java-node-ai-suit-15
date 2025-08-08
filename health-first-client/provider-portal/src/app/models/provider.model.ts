export interface Provider {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  
  // Professional Information
  license_number: string;
  specialization: string;
  years_of_experience: number;
  education: Education[];
  certifications: Certification[];
  
  // Address
  street: string;
  city: string;
  state: string;
  zip: string;
  
  // Practice Information
  practice_name?: string;
  practice_address?: string;
  practice_phone?: string;
  practice_website?: string;
  
  // Availability
  availability: Availability[];
  
  // Insurance and Billing
  accepted_insurance: string[];
  billing_info?: BillingInfo;
  
  // Medical History
  medical_history?: string;
  languages_spoken: string[];
  
  // Status
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export interface Education {
  degree: string;
  institution: string;
  graduation_year: number;
  field_of_study: string;
}

export interface Certification {
  name: string;
  issuing_organization: string;
  issue_date: string;
  expiry_date?: string;
  credential_id?: string;
}

export interface Availability {
  day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface BillingInfo {
  tax_id?: string;
  npi_number?: string;
  billing_address?: string;
  billing_phone?: string;
  billing_email?: string;
}

export interface ProviderRegistrationResponse {
  success: boolean;
  message: string;
  provider_id?: string;
  errors?: string[];
}

export interface ProviderLoginRequest {
  email: string;
  password: string;
}

export interface ProviderLoginResponse {
  success: boolean;
  message: string;
  token?: string;
  provider?: Provider;
  errors?: string[];
}

export interface ProviderProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  specialization: string;
  license_number: string;
  practice_name?: string;
  status: string;
  avatar?: string;
}

export interface ProviderDashboard {
  total_patients: number;
  appointments_today: number;
  pending_appointments: number;
  completed_appointments: number;
  revenue_this_month: number;
  recent_activities: Activity[];
}

export interface Activity {
  id: string;
  type: 'appointment' | 'patient_registration' | 'payment' | 'message';
  description: string;
  timestamp: string;
  patient_name?: string;
  amount?: number;
}

export interface Appointment {
  id: string;
  patient_id: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  appointment_date: string;
  appointment_time: string;
  duration: number;
  reason: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Patient {
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
  created_at: string;
  updated_at: string;
} 