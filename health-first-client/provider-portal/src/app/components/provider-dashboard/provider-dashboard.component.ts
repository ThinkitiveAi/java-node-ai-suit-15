import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../../services/provider.service';
import { ProviderDashboard, Activity } from '../../models/provider.model';

@Component({
  selector: 'app-provider-dashboard',
  templateUrl: './provider-dashboard.component.html',
  styleUrls: ['./provider-dashboard.component.scss']
})
export class ProviderDashboardComponent implements OnInit {
  dashboardData: ProviderDashboard | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(private providerService: ProviderService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    const providerId = localStorage.getItem('provider_id');
    if (!providerId) {
      this.errorMessage = 'Provider ID not found. Please login again.';
      this.isLoading = false;
      return;
    }

    this.providerService.getProviderDashboard(providerId).subscribe(
      (data) => {
        this.dashboardData = data;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load dashboard data.';
        this.isLoading = false;
        console.error('Dashboard error:', error);
      }
    );
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'appointment':
        return '📅';
      case 'patient_registration':
        return '👤';
      case 'payment':
        return '💰';
      case 'message':
        return '💬';
      default:
        return '📋';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
} 