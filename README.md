# Support Ticket Management System

A full-stack web application for managing customer support tickets and service workflows.

This project provides a role-based support platform where users can create tickets, track progress, update ticket status, and view support activity through dedicated dashboards.

## Key Features

- User signup and login
- Role-based access control
- Ticket creation and tracking
- Ticket status and priority management
- Internal support notes
- Customer, agent, supervisor, QA, case manager, and analytics views
- Dashboard-style support reporting

## Technology Used

- React
- Node.js
- Express
- MongoDB
- Mongoose
- JWT authentication
- Tailwind CSS

## Project Layout

```text
support-ticket-system/
|-- backend/     API, database models, authentication, and ticket logic
|-- frontend/    React user interface
|-- README.md    Project documentation
```

## How To Run

### 1. Start the backend

```bash
cd backend
npm install
npm run dev
```

### 2. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm start
```

The frontend runs locally in the browser, and the backend runs as the API server.

## Deployment

This project can be deployed using common hosting services such as Render, Railway, Vercel, Netlify, or similar platforms.

Recommended setup:

- Deploy the backend as a Node.js web service.
- Deploy the frontend as a static React application.
- Use a hosted MongoDB database.
- Store all private values in the hosting provider's environment variable settings.

### Backend Environment Variables

```env
PORT=your_port
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret
NODE_ENV=production
FRONTEND_URL=your_live_frontend_url
```

### Frontend Environment Variables

```env
REACT_APP_API_URL=your_live_backend_api_url
```

The frontend API URL should include the backend `/api` path.

Example format:

```text
https://your-backend-domain.com/api
```

## Environment Setup

The backend requires an environment configuration file for local development.

Create a `.env` file inside the `backend` folder using your own local values:

```env
PORT=your_port
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret
NODE_ENV=development
FRONTEND_URL=your_frontend_url
```

Do not commit real environment values, passwords, tokens, database credentials, or private keys.

## User Roles

The system supports multiple user roles:

- Customer
- Agent
- Supervisor
- Case Manager
- QA
- Analytics

Each role has access to different parts of the ticket workflow.

## Notes

- Keep `.env` files private.
- Use strong secrets for authentication.
- Do not publish real database connection strings.
- Do not include real user credentials in documentation.

## Status

Version: `1.0.0`
