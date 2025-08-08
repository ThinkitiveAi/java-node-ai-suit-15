import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProviderService } from '../../services/provider.service';

@Component({
  selector: 'app-provider-login',
  templateUrl: './provider-login.component.html',
  styleUrls: ['./provider-login.component.scss']
})
export class ProviderLoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private providerService: ProviderService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginData = this.loginForm.value;

      this.providerService.loginProvider(loginData).subscribe(
        (response) => {
          this.isLoading = false;
          if (response.success && response.token) {
            // Store token in localStorage
            localStorage.setItem('provider_token', response.token);
            localStorage.setItem('provider_id', response.provider?.id || '');
            
            // Navigate to dashboard
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = response.message || 'Login failed. Please try again.';
          }
        },
        (error) => {
          this.isLoading = false;
          this.errorMessage = 'An error occurred during login. Please try again.';
          console.error('Login error:', error);
        }
      );
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email address';
    }
  }
}