import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { PatientRegistrationService } from '../../services/patient-registration.service';

// Mock service removed; using real PatientRegistrationService

@Component({
  selector: 'app-patient-registration',
  templateUrl: './patient-registration.component.html',
  styleUrls: ['./patient-registration.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class PatientRegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  isSubmitting = false;
  showPassword = false;
  showConfirmPassword = false;
  passwordStrength = {
    score: 0,
    message: '',
    color: ''
  };
  maxDate: string;

  genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
    { label: 'Prefer not to say', value: 'prefer_not_to_say' }
  ];
  
  constructor(
    private fb: FormBuilder,
    private patientService: PatientRegistrationService
  ) {
    this.registrationForm = this.createForm();
    // Set max date to today minus 13 years
    const today = new Date();
    const minAge = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
    this.maxDate = minAge.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.setupFormValidation();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      // Personal Information
      first_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      last_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, this.phoneValidator]],
      password: ['', [Validators.required, this.passwordValidator]],
      confirm_password: ['', [Validators.required]],
      date_of_birth: ['', [Validators.required, this.dateOfBirthValidator]],
      gender: ['', Validators.required],

      // Address
      street: ['', [Validators.required, Validators.maxLength(200)]],
      city: ['', [Validators.required, Validators.maxLength(100)]],
      state: ['', [Validators.required, Validators.maxLength(50)]],
      zip: ['', [Validators.required, this.zipValidator]],

      // Emergency Contact (optional)
      emergency_contact_name: ['', [Validators.maxLength(100)]],
      emergency_contact_phone: ['', this.phoneValidator],
      emergency_contact_relationship: ['', [Validators.maxLength(50)]],

      // Insurance Info (optional)
      insurance_provider: [''],
      insurance_policy_number: [''],

      // Medical History (optional)
      medical_history: ['']
    }, { validators: this.passwordMatchValidator });
  }

  private setupFormValidation(): void {
    // Password strength monitoring
    this.registrationForm.get('password')?.valueChanges.subscribe(password => {
      this.passwordStrength = this.calculatePasswordStrength(password);
    });

    // Confirm password validation
    this.registrationForm.get('confirm_password')?.valueChanges.subscribe(() => {
      this.registrationForm.get('confirm_password')?.updateValueAndValidity();
    });
  }

  private phoneValidator(control: AbstractControl): ValidationErrors | null {
    const phone = control.value;
    if (!phone) return null;
    
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Check if it's a valid phone number (10-15 digits)
    if (cleaned.length < 10 || cleaned.length > 15) {
      return { invalidPhone: true };
    }
    
    return null;
  }

  private zipValidator(control: AbstractControl): ValidationErrors | null {
    const zip = control.value;
    if (!zip) return null;
    
    // US ZIP code format: 12345 or 12345-6789
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(zip)) {
      return { invalidZip: true };
    }
    
    return null;
  }

  private dateOfBirthValidator(control: AbstractControl): ValidationErrors | null {
    const dob = control.value;
    if (!dob) return null;
    
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 13) {
      return { underAge: true };
    }
    
    if (birthDate >= today) {
      return { futureDate: true };
    }
    
    return null;
  }

  private passwordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    if (!password) return null;
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;
    
    const errors: ValidationErrors = {};
    
    if (!hasUpperCase) errors.missingUpperCase = true;
    if (!hasLowerCase) errors.missingLowerCase = true;
    if (!hasNumbers) errors.missingNumbers = true;
    if (!hasSpecialChar) errors.missingSpecialChar = true;
    if (!isLongEnough) errors.tooShort = true;
    
    return Object.keys(errors).length > 0 ? errors : null;
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirm_password');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    
    return null;
  }

  private calculatePasswordStrength(password: string): { score: number; message: string; color: string } {
    if (!password) return { score: 0, message: '', color: '' };
    
    let score = 0;
    let message = '';
    let color = '';
    
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    
    switch (score) {
      case 0:
      case 1:
        message = 'Very Weak';
        color = '#ff4444';
        break;
      case 2:
        message = 'Weak';
        color = '#ff8800';
        break;
      case 3:
        message = 'Fair';
        color = '#ffaa00';
        break;
      case 4:
        message = 'Good';
        color = '#00aa00';
        break;
      case 5:
        message = 'Strong';
        color = '#008800';
        break;
    }
    
    return { score, message, color };
  }

  formatPhoneNumber(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 0) {
      if (value.length <= 3) {
        value = `(${value}`;
      } else if (value.length <= 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
      } else {
        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
      }
    }
    event.target.value = value;
  }

  formatZipCode(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 5) {
      value = `${value.slice(0, 5)}-${value.slice(5, 9)}`;
    }
    event.target.value = value;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.isSubmitting = true;
      
      // Trim and sanitize all inputs
      const formData = this.registrationForm.value;
      Object.keys(formData).forEach(key => {
        if (typeof formData[key] === 'string') {
          formData[key] = formData[key].trim();
        }
      });
      
      this.patientService.registerPatient(formData).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          // Handle success (redirect, show message, etc.)
        },
        error: (error) => {
          console.error('Registration failed:', error);
          // Handle error
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registrationForm.controls).forEach(key => {
      const control = this.registrationForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.registrationForm.get(controlName);
    if (!control || !control.errors || !control.touched) return '';
    
    const errors = control.errors;
    
    if (errors['required']) return `${this.getFieldLabel(controlName)} is required`;
    if (errors['email']) return 'Please enter a valid email address';
    if (errors['minlength']) return `${this.getFieldLabel(controlName)} must be at least ${errors['minlength'].requiredLength} characters`;
    if (errors['maxlength']) return `${this.getFieldLabel(controlName)} must be no more than ${errors['maxlength'].requiredLength} characters`;
    if (errors['invalidPhone']) return 'Please enter a valid phone number';
    if (errors['invalidZip']) return 'Please enter a valid ZIP code';
    if (errors['underAge']) return 'You must be at least 13 years old to register';
    if (errors['futureDate']) return 'Date of birth cannot be in the future';
    if (errors['passwordMismatch']) return 'Passwords do not match';
    if (errors['missingUpperCase']) return 'Password must contain at least one uppercase letter';
    if (errors['missingLowerCase']) return 'Password must contain at least one lowercase letter';
    if (errors['missingNumbers']) return 'Password must contain at least one number';
    if (errors['missingSpecialChar']) return 'Password must contain at least one special character';
    if (errors['tooShort']) return 'Password must be at least 8 characters long';
    
    return 'Invalid input';
  }

  private getFieldLabel(controlName: string): string {
    const labels: { [key: string]: string } = {
      first_name: 'First name',
      last_name: 'Last name',
      email: 'Email',
      phone_number: 'Phone number',
      password: 'Password',
      confirm_password: 'Confirm password',
      date_of_birth: 'Date of birth',
      gender: 'Gender',
      street: 'Street address',
      city: 'City',
      state: 'State',
      zip: 'ZIP code',
      emergency_contact_name: 'Emergency contact name',
      emergency_contact_phone: 'Emergency contact phone',
      emergency_contact_relationship: 'Emergency contact relationship'
    };
    
    return labels[controlName] || controlName.replace(/_/g, ' ');
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.registrationForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }
} 