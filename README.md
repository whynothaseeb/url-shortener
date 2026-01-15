## URL Shortener – DevOps Project

### Overview

This project is a **full-stack URL Shortener web application** built with **Node.js (Express)** and **React (Vite + TailwindCSS)**. It allows users to shorten long URLs, view recently shortened links, and manage them conveniently.

The application is **containerized using Docker**, orchestrated with **Docker Compose**, and integrated with **Jenkins** for Continuous Integration and Deployment (CI/CD). It demonstrates real-world **DevOps practices** and **modern full-stack development**.

### Architecture

The project follows a **modular, service-oriented architecture** consisting of two main services:

#### 1. **Frontend (React + TailwindCSS)**

- Built with **Vite** for fast development and optimized builds.
- Implements a clean, responsive UI styled with TailwindCSS.
- Communicates with the backend via REST API endpoints.
- Includes a collapsible sidebar for recent links.

#### 2. **Backend (Node.js + Express + SQLite)**

- Provides REST API endpoints for creating and retrieving short URLs.
- Stores data in **SQLite** (file-based database stored as `urls.db`).
- Each short URL maps to an original URL with a unique short ID and click counter.
- Uses **Express Router** for route management and **CORS** for frontend-backend communication.

#### 3. **DevOps & Deployment**

- **Dockerized frontend and backend** for consistency across environments.
- **Docker Compose** orchestrates multi-container setup.
- **Jenkins** automates builds and deployment pipelines.
- Integrated **GitHub SSH authentication** for secure code fetches.
- Supports **automatic CI/CD pipelines** triggered on code pushes.

### File Structure

```
url-shortener/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   ├── urls.db
│   └── .dockerignore
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── index.html
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── components/
│   │       └── ShortenForm.jsx
│   └── .dockerignore
│
├── docker-compose.yml
├── Jenkinsfile
├── .gitignore
└── README.md
```

### Technologies Used

| Category            | Technologies                                              |
| ------------------- | --------------------------------------------------------- |
| **Frontend**        | React, Vite, TailwindCSS, Axios                           |
| **Backend**         | Node.js, Express, SQLite                                  |
| **DevOps**          | Docker, Docker Compose, Jenkins, GitHub (SSH Integration) |
| **Version Control** | Git                                                       |
| **CI/CD**           | Jenkins Pipeline                                          |

### Jenkins CI/CD Pipeline

The Jenkins pipeline automates:

1. **GitHub repository clone via SSH**
2. **Docker image build** for both frontend and backend
3. **Container orchestration** using `docker-compose`
4. **Automated deployment** on successful builds

### Running the Project Locally

#### Prerequisites

- Node.js and npm installed
- Docker and Docker Compose installed

#### Steps

1. Clone the repository:

   ```bash
   git clone git@github.com:whynothaseeb/url-shortener.git
   cd url-shortener
   ```

2. Start the containers:

   ```bash
   docker compose up --build
   ```

3. Visit:

   - **Frontend:** [http://localhost:5173](http://localhost:5173)
   - **Backend API:** [http://localhost:4000](http://localhost:4000)

The application will automatically recreate the `urls.db` SQLite file if it doesn’t exist.

### Data Storage

All URL data is stored in a **SQLite database file (`urls.db`)** located inside the `backend` directory.
Each entry includes:

- `id`: unique short identifier
- `original_url`: the full URL
- `clicks`: number of times the short link was accessed

When running in Docker, this file is persisted through a **Docker volume**, ensuring data remains intact across container restarts.

### Security Considerations

- SSH key-based GitHub integration in Jenkins (no plaintext passwords)
- `.env` files excluded from version control via `.gitignore`
- CORS configuration for controlled frontend access

### Future Improvements

- Add analytics dashboard for link tracking
- Implement user accounts with JWT authentication
- Replace SQLite with a scalable database like PostgreSQL for production use

**Abdul Haseeb Ul Hasan**
GitHub: [whynothaseeb](https://github.com/whynothaseeb)
