gn# Health First - Setup Guide

This guide will help you set up and run the Health First healthcare management system.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (version 14 or higher)
- **Angular CLI** (version 11 or higher)
- **Git**

### Installing Prerequisites

1. **Install Node.js**:
   - Download from [nodejs.org](https://nodejs.org/)
   - Choose the LTS version

2. **Install Angular CLI**:
   ```bash
   npm install -g @angular/cli@11
   ```

## Project Structure

```
health-first-client/
├── patient-portal/           # Patient registration and management
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
├── provider-portal/          # Healthcare provider management
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
├── package.json
├── README.md
└── SETUP.md
```

## Installation

### Option 1: Install All Dependencies (Recommended)

From the root directory, run:

```bash
npm run install:all
```

This will install dependencies for both the patient and provider portals.

### Option 2: Install Dependencies Separately

1. **Install Patient Portal Dependencies**:
   ```bash
   cd patient-portal/patient-registration
   npm install
   ```

2. **Install Provider Portal Dependencies**:
   ```bash
   cd ../../provider-portal
   npm install
   ```

## Running the Applications

### Option 1: Run from Root Directory

1. **Start Patient Portal**:
   ```bash
   npm run start:patient
   ```
   Navigate to `http://localhost:4200`

2. **Start Provider Portal** (in a new terminal):
   ```bash
   npm run start:provider
   ```
   Navigate to `http://localhost:4200` (or the next available port)

### Option 2: Run Separately

1. **Patient Portal**:
   ```bash
   cd patient-portal/patient-registration
   npm start
   ```

2. **Provider Portal**:
   ```bash
   cd provider-portal
   npm start
   ```

## Application Features

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

## API Configuration

Both applications are configured to connect to the Health First backend API:

- **Development**: `http://192.168.10.105:8081/api`
- **Production**: `https://api.healthfirst.com/api`

### Environment Configuration

You can modify the API endpoints in the environment files:

- **Patient Portal**: `patient-portal/patient-registration/src/environments/environment.ts`
- **Provider Portal**: `provider-portal/src/environments/environment.ts`

## Development

### Code Structure

- **Components**: Feature-based organization
- **Services**: API communication and business logic
- **Models**: TypeScript interfaces and data models
- **Styles**: SCSS with modern design system

### Key Commands

```bash
# Build applications
npm run build:all

# Run tests
npm run test:all

# Lint code
cd patient-portal/patient-registration && npm run lint
cd provider-portal && npm run lint
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**:
   - Angular will automatically use the next available port
   - Check the terminal output for the correct URL

2. **Dependencies Issues**:
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

3. **Angular CLI Version**:
   - Ensure you're using Angular CLI version 11
   - Run `ng version` to check

4. **API Connection Issues**:
   - Verify the backend server is running
   - Check the API URL in environment files
   - Ensure CORS is properly configured

### Getting Help

- Check the individual portal README files
- Review the Angular documentation
- Contact the development team

## Deployment

### Building for Production

1. **Patient Portal**:
   ```bash
   npm run build:patient
   ```

2. **Provider Portal**:
   ```bash
   npm run build:provider
   ```

### Deployment Options

- **Netlify**: Drag and drop the `dist/` folder
- **Vercel**: Connect GitHub repository
- **AWS S3**: Upload build artifacts
- **Azure Static Web Apps**: Deploy from GitHub

## Support

For additional support:

1. Check the main README.md file
2. Review the individual portal documentation
3. Contact the development team
4. Check the API documentation

## License

This project is licensed under the MIT License. 