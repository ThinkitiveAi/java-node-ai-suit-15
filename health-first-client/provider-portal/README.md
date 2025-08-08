# Provider Portal - Health First

This is the provider portal for the Health First healthcare application. It allows healthcare providers to manage their practice, appointments, and patient information.

## Features

- **Provider Registration**: Complete registration form with professional information
- **Provider Login**: Secure authentication system
- **Dashboard**: Overview of practice statistics and recent activities
- **Appointments Management**: View and manage patient appointments
- **Patient Management**: View patient information and medical history
- **Profile Management**: Update provider profile and practice information

## Technology Stack

- **Frontend**: Angular 11
- **Styling**: SCSS with modern design system
- **HTTP Client**: Angular HttpClient for API communication
- **Forms**: Reactive Forms with validation
- **Routing**: Angular Router for navigation

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- Angular CLI (version 11 or higher)

### Installation

1. Navigate to the provider portal directory:
   ```bash
   cd provider-portal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:4200`

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── provider-registration/
│   │   ├── provider-login/
│   │   ├── provider-dashboard/
│   │   ├── provider-profile/
│   │   ├── appointments/
│   │   └── patients/
│   ├── models/
│   │   └── provider.model.ts
│   ├── services/
│   │   └── provider.service.ts
│   ├── app.component.ts
│   ├── app.module.ts
│   └── app-routing.module.ts
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
├── assets/
├── styles.scss
├── main.ts
└── index.html
```

## API Integration

The application integrates with the Health First backend API. The base URL is configured in the environment files:

- **Development**: `http://192.168.10.105:8081/api`
- **Production**: `https://api.healthfirst.com/api`

## Key Components

### Provider Registration
- Comprehensive registration form with validation
- Professional information collection
- Education and certification tracking
- Availability management

### Provider Dashboard
- Practice statistics overview
- Recent activities feed
- Quick access to key functions

### Appointments Management
- View all appointments with filtering
- Update appointment status
- Patient information display

### Patient Management
- Patient list with search and filtering
- Detailed patient information
- Medical history tracking

## Styling

The application uses a modern design system with:
- Responsive design
- Clean and professional UI
- Consistent color scheme
- Modern typography (Inter font)
- Smooth animations and transitions

## Development

### Code Style
- Follow Angular style guide
- Use TypeScript strict mode
- Implement proper error handling
- Write unit tests for components and services

### Testing
```bash
npm test
```

### Linting
```bash
npm run lint
```

## Deployment

The application can be deployed to any static hosting service. The build process creates optimized production files in the `dist/` directory.

## Support

For support and questions, please contact the development team. 