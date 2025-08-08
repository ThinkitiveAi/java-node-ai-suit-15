import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProviderService } from '../../services/provider.service';
import { ProviderProfile } from '../../models/provider.model';

@Component({
  selector: 'app-provider-profile',
  templateUrl: './provider-profile.component.html',
  styleUrls: ['./provider-profile.component.scss']
})
export class ProviderProfileComponent implements OnInit {
  profileForm: FormGroup;
  profile: ProviderProfile | null = null;
  isLoading = true;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private providerService: ProviderService
  ) {
    this.profileForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required]],
      specialization: ['', [Validators.required]],
      license_number: ['', [Validators.required]],
      practice_name: [''],
      practice_address: [''],
      practice_phone: [''],
      practice_website: ['']
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const providerId = localStorage.getItem('provider_id');
    if (!providerId) {
      this.errorMessage = 'Provider ID not found. Please login again.';
      this.isLoading = false;
      return;
    }

    this.providerService.getProviderProfile(providerId).subscribe(
      (data) => {
        this.profile = data;
        this.profileForm.patchValue({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone_number: data.phone_number,
          specialization: data.specialization,
          license_number: data.license_number,
          practice_name: data.practice_name || ''
        });
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load profile.';
        this.isLoading = false;
        console.error('Profile error:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const providerId = localStorage.getItem('provider_id');
      if (!providerId) {
        this.errorMessage = 'Provider ID not found. Please login again.';
        return;
      }

      const profileData = this.profileForm.value;
      
      this.providerService.updateProviderProfile(providerId, profileData).subscribe(
        (updatedProfile) => {
          this.profile = updatedProfile;
          this.successMessage = 'Profile updated successfully!';
          this.errorMessage = '';
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        (error) => {
          this.errorMessage = 'Failed to update profile. Please try again.';
          console.error('Profile update error:', error);
        }
      );
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) return `${fieldName.replace('_', ' ')} is required`;
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['minlength']) return `${fieldName.replace('_', ' ')} must be at least ${field.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }
} 