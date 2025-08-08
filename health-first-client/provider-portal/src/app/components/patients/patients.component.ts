import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../../services/provider.service';
import { Patient } from '../../models/provider.model';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private providerService: ProviderService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    const providerId = localStorage.getItem('provider_id');
    if (!providerId) {
      this.errorMessage = 'Provider ID not found. Please login again.';
      this.isLoading = false;
      return;
    }

    this.providerService.getProviderPatients(providerId).subscribe(
      (data) => {
        this.patients = data;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load patients.';
        this.isLoading = false;
        console.error('Patients error:', error);
      }
    );
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
} 