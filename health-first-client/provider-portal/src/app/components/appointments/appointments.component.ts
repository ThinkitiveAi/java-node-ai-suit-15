import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../../services/provider.service';
import { Appointment } from '../../models/provider.model';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  isLoading = true;
  errorMessage = '';
  selectedStatus = 'all';
  selectedDate = '';

  constructor(private providerService: ProviderService) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    const providerId = localStorage.getItem('provider_id');
    if (!providerId) {
      this.errorMessage = 'Provider ID not found. Please login again.';
      this.isLoading = false;
      return;
    }

    this.providerService.getProviderAppointments(providerId, this.selectedStatus, this.selectedDate).subscribe(
      (data) => {
        this.appointments = data;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load appointments.';
        this.isLoading = false;
        console.error('Appointments error:', error);
      }
    );
  }

  updateAppointmentStatus(appointmentId: string, status: string): void {
    this.providerService.updateAppointmentStatus(appointmentId, status).subscribe(
      (updatedAppointment) => {
        // Update the appointment in the list
        const index = this.appointments.findIndex(apt => apt.id === appointmentId);
        if (index !== -1) {
          this.appointments[index] = updatedAppointment;
        }
      },
      (error) => {
        console.error('Error updating appointment status:', error);
        this.errorMessage = 'Failed to update appointment status.';
      }
    );
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'scheduled':
        return 'status-scheduled';
      case 'confirmed':
        return 'status-confirmed';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      case 'no_show':
        return 'status-no-show';
      default:
        return 'status-default';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(timeString: string): string {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  onStatusChange(): void {
    this.loadAppointments();
  }

  onDateChange(): void {
    this.loadAppointments();
  }
} 