# HandoverHub – Digital Project Handover Management System

HandoverHub is a web-based project handover management system designed to help teams manage projects, track progress, and transfer project ownership between team members.

The application provides a central place where team members can create projects, monitor project progress, send handover requests, and accept project takeovers.

## Features

* User registration and login
* Secure password hashing
* User-based project ownership
* Create and manage projects
* Track project progress
* Project priority and status
* Team project overview
* Send project handover requests
* View pending takeovers
* Accept project takeovers
* Automatically update project ownership after takeover
* Handover activity tracking
* Overdue project tracking
* Dashboard statistics
* PostgreSQL database storage
* REST API communication between React and ASP.NET Core

## Project Workflow

### 1. Login

Users log in using their registered email address and password.

### 2. Dashboard

The dashboard provides a read-only overview of team activity, including:

* Active Projects
* Active Handovers
* Projects Waiting for Takeover
* Overdue Projects
* Team Projects
* Recent Handover Activity

### 3. My Projects

Users can create and manage projects they own.
Users can update the progress of their projects or start a handover.

### 4. Project Handover
A project owner can select another team member and send a handover request.

### 5. Takeover
The selected team member can view pending takeover requests.
When the team member accepts the takeover:
* The handover status changes to `Accepted`
* The project owner is updated
* The project appears under the new owner's **My Projects**

## Technology Stack
### Frontend

* React
* JavaScript
* HTML5
* CSS3
* Vite

### Backend
* C#
* ASP.NET Core
* REST API
* Entity Framework Core

### Database
* PostgreSQL
* Npgsql

### Development Tools
* Visual Studio Code
* Git
* GitHub
* pgAdmin
* .NET CLI

## Architecture
The application uses a frontend and backend architecture:
The React frontend communicates with the ASP.NET Core API using HTTP requests. The API handles application logic and database operations through Entity Framework Core.


## Database
The application uses PostgreSQL to store users, projects, and handover information.

## Getting Started
* .NET SDK
* Node.js
* PostgreSQL
* pgAdmin
* Git

## Key Development Concepts

* REST API development
* CRUD operations
* React component development
* React state and lifecycle management
* API integration using `fetch`
* ASP.NET Core Minimal APIs
* Entity Framework Core
* PostgreSQL database operations
* Database migrations
* User authentication
* Password hashing
* Project ownership
* Workflow-based application logic
* Error handling
* Form validation
* Git and GitHub development workflow

## Future Improvements
Possible future improvements include:

* Role-based access control
* Email notifications for handover requests
* Project comments and activity history
* File attachments for project handovers
* Search and filtering
* Advanced project reporting
* Audit logging
* Production authentication using JWT or ASP.NET Core Identity
* Deployment to a cloud hosting environment

## run
cd HandoverHub.API
        dotnet run
cd frontend
        npm run dev

Test Login 
krish@gmail.com
Kris123!

image-1.png
image-2.png
image-3.png
image-4.png
image-5.png
image-6.png
image.png
