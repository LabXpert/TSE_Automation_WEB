# TSE_Automation_WEB

**Automation platform to streamline TSE operations**  

This project aims to digitalize and automate operational workflows for the Turkish Standards Institution (TSE).  
It provides a modern **web-based interface** and **API server** for managing companies, personnel, machines, tests, reports, and notifications.  

---

## Table of Contents

- [Features](#features)  
- [Technologies](#technologies)  
- [System Architecture](#system-architecture)  
- [Installation](#installation)  
- [Environment Variables](#environment-variables)  
- [Contributing](#contributing)

---

## Features

- Authentication with JWT, password hashing (bcrypt)  
- Role-based access control (Admin / User)  
- Company, Machine, Personnel management (CRUD operations)  
- Test & Calibration modules with advanced filters  
- Reporting & Dashboard with charts (Recharts)  
- Excel import/export support (ExcelJS)  
- Automated email reports (Nodemailer + Node-Cron)  
- Responsive UI with React + TypeScript  
- Dockerized PostgreSQL database support (SQLite for dev mode)  

---

## Technologies

| Layer       | Technology |
|-------------|------------|
| Frontend    | React, TypeScript, Vite |
| Backend     | Node.js, Express |
| Database    | PostgreSQL (production), SQLite (development) |
| Other Tools | Docker, ExcelJS, Nodemailer, Node-Cron, ESLint |

---

## System Architecture

- **Frontend (React + TS + Vite):** Provides the UI, connects to backend API via Axios.  
- **Backend (Node.js + Express):** Exposes REST API endpoints, handles authentication, data validation, and business logic.  
- **Database:**  
  - SQLite (default for quick local development).  
  - PostgreSQL (recommended for production, supported via Docker).  
- **Deployment:** Docker / Docker Compose (Postgres + PGAdmin).  

---

## Installation

### 1. Clone the repository
  ```bash
 git clone https://github.com/LabXpert/TSE_Automation_WEB.git
 cd TSE_Automation_WEB
```

### 2. Setup environment variables

See Environment Variables.
Create .env in project root and server/.env inside the server folder.

### 3. Backend setup
  ```bash
cd server
npm install
npm run dev
```
Backend will start on default port (e.g. http://localhost:5000).

### 4. Frontend setup
  ```bash
cd ../frontend
npm install
npm run dev
```
Frontend will start on http://localhost:5173.


---

## Environment Variables
Root .env

```bash
# Database Configuration
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
PGADMIN_DEFAULT_EMAIL=
PGADMIN_DEFAULT_PASSWORD=
DATABASE_URL=

# CORS
CORS_ORIGIN=http://localhost:5173

# Frontend
VITE_API_BASE_URL=http://localhost:5000
```

Server .env

```bash
# TSE Automation API - Environment Variables
DB_DRIVER=sqlite
SQLITE_PATH=./data/tse.db
```

## Contributing
Contributions are welcome!

1. Fork the repository
2. Create a feature branch (git checkout -b feature/my-feature)
3. Commit your changes (git commit -m "Add new feature")
4. Push to your fork and create a Pull Request








