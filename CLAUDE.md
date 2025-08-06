# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- **Start Development Server**: `npm start` - Runs the app on http://localhost:3000 with proxy to backend
- **Build Production**: `npm run build` - Creates optimized production build in `build/` directory
- **Run Tests**: `npm test` - Runs test suite with react-scripts
- **Deploy to S3**: `npm run deploy` - Syncs build to s3://surebankstores.ng (requires AWS credentials)

### Important Notes
- No linting command is configured - consider adding ESLint
- No type checking configured - project uses JavaScript without TypeScript
- Tests use react-scripts test runner (Jest under the hood)

## Architecture Overview

### Tech Stack
- **Framework**: React 17.0.2 with Create React App
- **UI Library**: Chakra UI 1.8.8 with custom theme
- **Routing**: React Router DOM v5.3.0
- **State Management**: Redux with Redux Thunk + React Context API
- **Data Fetching**: React Query v3 + Axios
- **Form Handling**: React Hook Form v7
- **Charts**: ApexCharts with react-apexcharts

### Project Structure
```
src/
├── assets/         # Static assets (images, CSS)
├── components/     # Reusable UI components
├── contexts/       # React Context providers (Auth, App, Sidebar)
├── layouts/        # Page layouts (admin, auth, home)
├── theme/          # Chakra UI theme configuration
├── utils/          # Utilities (axios service, helpers, HOCs)
└── views/          # Page components organized by feature
    ├── admin/      # Admin dashboard pages
    ├── auth/       # Authentication pages
    └── landing/    # Public pages
```

### Key Architectural Patterns

1. **Authentication Flow**
   - JWT-based authentication stored in localStorage
   - Auth context provides login/logout/signup methods
   - Protected routes using `withAuth` HOC
   - Auto-logout after 15 minutes of inactivity

2. **API Communication**
   - Centralized axios instance in `utils/axiosService.js`
   - Base URL: https://7jvk31k960.execute-api.us-east-1.amazonaws.com/v1
   - Automatic token injection via axios interceptors
   - Auth error handling redirects to login

3. **Routing Structure**
   - Role-based route access (superAdmin, admin, manager, userReps)
   - Routes defined in `src/routes.js` with role restrictions
   - Three main layouts: `/admin`, `/auth`, `/home`

4. **State Management**
   - Redux store configured but minimally used
   - Primary state management through React Context (AuthContext, AppContext)
   - React Query for server state management

5. **Component Organization**
   - Modular components in `components/` directory
   - Feature-based organization in `views/`
   - Shared UI components like modals, tables, cards

### Key Features
- Multi-branch banking system with staff management
- Customer account management (Daily Savings, Surebank packages)
- Transaction processing (deposits, withdrawals, transfers)
- Product catalog and ordering system
- Accounting and expenditure tracking
- SMS messaging capabilities
- Role-based access control

### Import Paths
- Absolute imports configured with `jsconfig.json`
- Use `import Component from 'components/...'` instead of relative paths
- Base URL is set to `src/` directory