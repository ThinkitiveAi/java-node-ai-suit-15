export interface PatientRegistration {
  // Personal Information (required)
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';

  // Address (required)
  street: string;
  city: string;
  state: string;
  zip: string;

  // Emergency Contact (optional)
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;

  // Insurance Info (optional)
  insurance_provider?: string;
  insurance_policy_number?: string;

  // Medical History (optional)
  medical_history?: string;
}

export interface PatientRegistrationResponse {
  success: boolean;
  message: string;
  patient_id?: string;
  errors?: string[];
}

export interface ValidationRule {
  field: string;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  customValidation?: string;
}

export interface InsuranceProvider {
  id: string;
  name: string;
  code: string;
}

export interface State {
  code: string;
  name: string;
} 