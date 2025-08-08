import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Components
import { AvailabilityCalendarComponent } from './availability-calendar/availability-calendar.component';
import { SlotFormComponent } from './slot-form/slot-form.component';
import { SlotListComponent } from './slot-list/slot-list.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { TimezoneConverterComponent } from './timezone-converter/timezone-converter.component';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';
import { SlotDetailsComponent } from './slot-details/slot-details.component';
import { RecurringSlotFormComponent } from './recurring-slot-form/recurring-slot-form.component';
import { BookingConfirmationComponent } from './booking-confirmation/booking-confirmation.component';

// Services
import { SchedulingService } from './services/scheduling.service';
import { AvailabilityService } from './services/availability.service';
import { BookingService } from './services/booking.service';
import { TimezoneService } from './services/timezone.service';

// Directives
import { TimezoneDirective } from './directives/timezone.directive';
import { ValidationDirective } from './directives/validation.directive';

// Pipes
import { TimezonePipe } from './pipes/timezone.pipe';
import { DurationPipe } from './pipes/duration.pipe';

@NgModule({
  declarations: [
    AvailabilityCalendarComponent,
    SlotFormComponent,
    SlotListComponent,
    SearchResultsComponent,
    TimezoneConverterComponent,
    CalendarViewComponent,
    SlotDetailsComponent,
    RecurringSlotFormComponent,
    BookingConfirmationComponent,
    TimezoneDirective,
    ValidationDirective,
    TimezonePipe,
    DurationPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      { path: 'calendar', component: AvailabilityCalendarComponent },
      { path: 'slots', component: SlotListComponent },
      { path: 'slots/new', component: SlotFormComponent },
      { path: 'slots/:id', component: SlotDetailsComponent },
      { path: 'slots/:id/edit', component: SlotFormComponent },
      { path: 'recurring', component: RecurringSlotFormComponent },
      { path: 'search', component: SearchResultsComponent },
      { path: 'booking/:slotId', component: BookingConfirmationComponent },
      { path: '', redirectTo: 'calendar', pathMatch: 'full' }
    ])
  ],
  providers: [
    SchedulingService,
    AvailabilityService,
    BookingService,
    TimezoneService
  ],
  exports: [
    AvailabilityCalendarComponent,
    SlotFormComponent,
    SearchResultsComponent,
    TimezoneConverterComponent
  ]
})
export class SchedulingModule { } 