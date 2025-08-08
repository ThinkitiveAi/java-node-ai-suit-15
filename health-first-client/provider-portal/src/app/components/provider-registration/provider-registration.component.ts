import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ProviderService } from '../../services/provider.service';
import { Provider, Education, Certification, Availability } from '../../models/provider.model';

@Component({
  selector: 'app-provider-registration',
  templateUrl: './provider-registration.component.html',
  styleUrls: ['./provider-registration.component.scss']
})
export class ProviderRegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  specializations: any[] = [];
  insuranceProviders: any[] = [];
  states: any[] = [];

  constructor(
    private fb: FormBuilder,
    private providerService: ProviderService
  ) {
    this.registrationForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadFormData();
  }

  createForm(): FormGroup {
    return this.fb.group({
      // Personal Information
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-()]+$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', [Validators.required]],
      date_of_birth: ['', [Validators.required]],
      gender: ['', [Validators.required]],

      // Professional Information
      license_number: ['', [Validators.required]],
      specialization: ['', [Validators.required]],
      years_of_experience: ['', [Validators.required, Validators.min(0), Validators.max(50)]],
      
      // Education
      education: this.fb.array([]),
      
      // Certifications
      certifications: this.fb.array([]),
      
      // Address
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zip: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]],
      
      // Practice Information
      practice_name: [''],
      practice_address: [''],
      practice_phone: [''],
      practice_website: [''],
      
      // Availability
      availability: this.fb.array([]),
      
      // Insurance and Billing
      accepted_insurance: this.fb.array([]),
      
      // Languages
      languages_spoken: this.fb.array([]),
      
      // Medical History
      medical_history: ['']
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirm_password');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  loadFormData(): void {
    this.providerService.getSpecializations().subscribe(
      data => this.specializations = data,
      error => console.error('Error loading specializations:', error)
    );

    this.providerService.getInsuranceProviders().subscribe(
      data => this.insuranceProviders = data,
      error => console.error('Error loading insurance providers:', error)
    );

    this.providerService.getStates().subscribe(
      data => this.states = data,
      error => console.error('Error loading states:', error)
    );

    this.initializeAvailability();
  }

  initializeAvailability(): void {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const availabilityArray = this.registrationForm.get('availability') as FormArray;
    
    days.forEach(day => {
      availabilityArray.push(this.fb.group({
        day_of_week: [day],
        start_time: ['09:00'],
        end_time: ['17:00'],
        is_available: [day !== 'saturday' && day !== 'sunday']
      }));
    });
  }

  get educationArray(): FormArray {
    return this.registrationForm.get('education') as FormArray;
  }

  get certificationsArray(): FormArray {
    return this.registrationForm.get('certifications') as FormArray;
  }

  get availabilityArray(): FormArray {
    return this.registrationForm.get('availability') as FormArray;
  }

  get acceptedInsuranceArray(): FormArray {
    return this.registrationForm.get('accepted_insurance') as FormArray;
  }

  get languagesSpokenArray(): FormArray {
    return this.registrationForm.get('languages_spoken') as FormArray;
  }

  addEducation(): void {
    const educationGroup = this.fb.group({
      degree: ['', Validators.required],
      institution: ['', Validators.required],
      graduation_year: ['', [Validators.required, Validators.min(1950), Validators.max(new Date().getFullYear())]],
      field_of_study: ['', Validators.required]
    });
    
    this.educationArray.push(educationGroup);
  }

  removeEducation(index: number): void {
    this.educationArray.removeAt(index);
  }

  addCertification(): void {
    const certificationGroup = this.fb.group({
      name: ['', Validators.required],
      issuing_organization: ['', Validators.required],
      issue_date: ['', Validators.required],
      expiry_date: [''],
      credential_id: ['']
    });
    
    this.certificationsArray.push(certificationGroup);
  }

  removeCertification(index: number): void {
    this.certificationsArray.removeAt(index);
  }

  addLanguage(): void {
    this.languagesSpokenArray.push(this.fb.control('', Validators.required));
  }

  removeLanguage(index: number): void {
    this.languagesSpokenArray.removeAt(index);
  }

  toggleInsurance(insuranceId: string): void {
    const insuranceArray = this.acceptedInsuranceArray;
    const index = insuranceArray.value.indexOf(insuranceId);
    
    if (index > -1) {
      insuranceArray.removeAt(index);
    } else {
      insuranceArray.push(this.fb.control(insuranceId));
    }
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.isLoading = true;
      this.successMessage = '';
      this.errorMessage = '';

      const formData = this.registrationForm.value;
      
      // Transform the data to match the API expectations
      const providerData: Provider = {
        ...formData,
        education: formData.education || [],
        certifications: formData.certifications || [],
        availability: formData.availability || [],
        accepted_insurance: formData.accepted_insurance || [],
        languages_spoken: formData.languages_spoken || []
      };

      this.providerService.registerProvider(providerData).subscribe(
        (response) => {
          this.isLoading = false;
          if (response.success) {
            this.successMessage = 'Provider registration successful! Please check your email for verification.';
            this.registrationForm.reset();
            this.initializeAvailability();
          } else {
            this.errorMessage = response.message || 'Registration failed. Please try again.';
          }
        },
        (error) => {
          this.isLoading = false;
          this.errorMessage = 'An error occurred during registration. Please try again.';
          console.error('Registration error:', error);
        }
      );
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.registrationForm.controls).forEach(key => {
      const control = this.registrationForm.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched();
      } else {
        control?.markAsTouched();
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registrationForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.registrationForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) return `${fieldName.replace('_', ' ')} is required`;
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['minlength']) return `${fieldName.replace('_', ' ')} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['pattern']) return `Please enter a valid ${fieldName.replace('_', ' ')}`;
      if (field.errors['passwordMismatch']) return 'Passwords do not match';
    }
    return '';
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }
} 