# Health First - Healthcare Management System

A comprehensive healthcare management system with separate portals for patients and healthcare providers, built with Angular.

## Project Overview

Health First is a modern healthcare management system that provides two distinct portals:

1. **Patient Portal** - For patient registration and management
2. **Provider Portal** - For healthcare providers to manage their practice

## Project Structure

```
health-first-client/
├── patient-portal/
│   └── patient-registration/
│       ├── src/
│       │   ├── app/
│       │   │   ├── components/
│       │   │   ├── models/
│       │   │   ├── services/
│       │   │   └── shared/
│       │   ├── assets/
│       │   └── environments/
│       ├── package.json
│       ├── angular.json
│       └── README.md
├── provider-portal/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── provider-registration/
│   │   │   │   ├── provider-login/
│   │   │   │   ├── provider-dashboard/
│   │   │   │   ├── provider-profile/
│   │   │   │   ├── appointments/
│   │   │   │   └── patients/
│   │   │   ├── models/
│   │   │   ├── services/
│   │   │   └── shared/
│   │   ├── assets/
│   │   └── environments/
│   ├── package.json
│   ├── angular.json
│   └── README.md
└── README.md
```

## Features

### Patient Portal Features
- **Patient Registration**: Comprehensive registration form with validation
- **Personal Information Management**: Store and manage patient details
- **Medical History Tracking**: Record and track medical history
- **Insurance Information**: Manage insurance provider details
- **Emergency Contact**: Store emergency contact information

### Provider Portal Features
- **Provider Registration**: Complete registration with professional information
- **Provider Login**: Secure authentication system
- **Dashboard**: Practice statistics and recent activities overview
- **Appointments Management**: View and manage patient appointments
- **Patient Management**: Access patient information and medical history
- **Profile Management**: Update provider profile and practice information

## Technology Stack

- **Frontend Framework**: Angular 11
- **Styling**: SCSS with modern design system
- **HTTP Client**: Angular HttpClient for API communication
- **Forms**: Reactive Forms with comprehensive validation
- **Routing**: Angular Router for navigation
- **State Management**: Local storage and service-based state management

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- Angular CLI (version 11 or higher)
- Git

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd health-first-client
   ```

2. **Install Patient Portal Dependencies**:
   ```bash
   cd patient-portal/patient-registration
   npm install
   ```

3. **Install Provider Portal Dependencies**:
   ```bash
   cd ../../provider-portal
   npm install
   ```

### Running the Applications

#### Patient Portal
```bash
cd patient-portal/patient-registration
npm start
```
Navigate to `http://localhost:4200`

#### Provider Portal
```bash
cd provider-portal
npm start
```
Navigate to `http://localhost:4200`

## API Integration

Both portals integrate with the Health First backend API:

- **Development**: `http://192.168.10.105:8081/api`
- **Production**: `https://api.healthfirst.com/api`

### API Endpoints

#### Patient Portal Endpoints
- `POST /api/patients/register` - Patient registration
- `GET /api/patients/check-email` - Email availability check
- `GET /api/patients/validation-rules` - Form validation rules
- `GET /api/patients/insurance-providers` - Insurance providers list
- `GET /api/patients/states` - States list

#### Provider Portal Endpoints
- `POST /api/providers/register` - Provider registration
- `POST /api/providers/login` - Provider login
- `GET /api/providers/{id}/profile` - Provider profile
- `PUT /api/providers/{id}/profile` - Update provider profile
- `GET /api/providers/{id}/dashboard` - Provider dashboard
- `GET /api/providers/{id}/appointments` - Provider appointments
- `GET /api/providers/{id}/patients` - Provider patients
- `PUT /api/appointments/{id}` - Update appointment status

## Key Components

### Patient Portal Components
- **PatientRegistrationComponent**: Main registration form
- **PatientService**: API communication service
- **PatientRegistrationModel**: Data models and interfaces

### Provider Portal Components
- **ProviderRegistrationComponent**: Provider registration form
- **ProviderLoginComponent**: Login functionality
- **ProviderDashboardComponent**: Dashboard overview
- **AppointmentsComponent**: Appointment management
- **PatientsComponent**: Patient management
- **ProviderProfileComponent**: Profile management
- **ProviderService**: API communication service

## Design System

Both portals use a consistent design system:

- **Colors**: Modern color palette with primary blue (#3b82f6)
- **Typography**: Inter font family
- **Layout**: Responsive grid system
- **Components**: Reusable UI components
- **Animations**: Smooth transitions and hover effects

## Development Guidelines

### Code Style
- Follow Angular style guide
- Use TypeScript strict mode
- Implement proper error handling
- Write comprehensive unit tests
- Use meaningful variable and function names

### File Structure
- Organize components by feature
- Separate models, services, and components
- Use consistent naming conventions
- Maintain clean and readable code

### Testing
```bash
# Patient Portal
cd patient-portal/patient-registration
npm test

# Provider Portal
cd provider-portal
npm test
```

### Linting
```bash
# Patient Portal
cd patient-portal/patient-registration
npm run lint

# Provider Portal
cd provider-portal
npm run lint
```

## Building for Production

### Patient Portal
```bash
cd patient-portal/patient-registration
npm run build
```

### Provider Portal
```bash
cd provider-portal
npm run build
```

## Deployment

Both applications can be deployed to any static hosting service:

- **Netlify**: Drag and drop the `dist/` folder
- **Vercel**: Connect GitHub repository
- **AWS S3**: Upload build artifacts
- **Azure Static Web Apps**: Deploy from GitHub

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests for new functionality
5. Submit a pull request

## Support

For support and questions:
- Check the individual portal README files
- Review the API documentation
- Contact the development team

## License

This project is licensed under the MIT License. 