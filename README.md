# DB Hub

DB Hub is a full-stack database application for working with GitHub Archive data. The project uses a React frontend, a Python/FastAPI backend, and Redis for data storage.

The application currently supports CRUD operations for GitHub commit data. MongoDB support and additional data-analysis features will be added as the project develops.

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Python
- FastAPI
- Uvicorn
- redis-py
- python-dotenv
- Pydantic

### Database
- Redis
- MongoDB — planned

## Current Features

- Create GitHub commit records in Redis
- Read commit records by commit SHA
- Update existing commit records
- Delete commit records
- Redis connection status endpoint
- React interface for Redis CRUD operations
- FastAPI request validation
- HTTP error handling
- Interactive FastAPI API documentation

## Project Structure

```text
db-hub-proj/
├── backend/
│   ├── main.py
│   ├── redis_client.py
│   ├── redis_service.py
│   └── test_redis_service.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ApiResponse.jsx
│   │   │   └── RedisCrudCard.jsx
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
│
├── data/
│   └── GitHub Archive dataset (local only)
│
├── .gitignore
└── README.md
```

## Prerequisites

Before running the application, install:

- Python 3
- Node.js and npm
- Redis
- Git

This project was developed with Redis running through WSL/Ubuntu on Windows.

## 1. Clone the Repository

```bash
git clone https://github.com/UBSDFS/db-hub-proj.git
cd db-hub-proj
```

## 2. Set Up the Python Backend

Navigate to the backend directory:

```powershell
cd backend
```

Create a Python virtual environment:

```powershell
py -m venv .venv
```

Activate it in Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

Install the backend dependencies:

```powershell
pip install fastapi uvicorn redis python-dotenv
```

## 3. Configure Redis

Redis must be running before starting the backend.

The development environment for this project uses Redis inside WSL/Ubuntu.

Start or restart Redis:

```bash
sudo service redis-server start
```

Verify Redis is running:

```bash
redis-cli ping
```

If authentication is enabled, authenticate using the password configured for your Redis installation.

### Environment Variables

Create a file named `.env` inside the `backend` directory:

```text
backend/.env
```

Add the following variables:

```env
REDIS_HOST=YOUR_REDIS_HOST
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=YOUR_REDIS_PASSWORD
```

Do not commit the `.env` file to GitHub.

If Redis is running in WSL, the WSL IP address can be found with:

```bash
hostname -I
```

Use the appropriate address as `REDIS_HOST`.

## 4. Start the FastAPI Backend

From the `backend` directory with the virtual environment activated:

```powershell
uvicorn main:app --reload
```

The API will normally run at:

```text
http://127.0.0.1:8000
```

FastAPI interactive documentation is available at:

```text
http://127.0.0.1:8000/docs
```

You can verify the Redis connection through:

```text
GET /redis/status
```

## 5. Set Up the React Frontend

Open a second terminal and navigate to the frontend:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Start the Vite development server:

```powershell
npm run dev
```

Vite will display the local frontend URL in the terminal.

For example:

```text
http://localhost:5174
```

Open the displayed URL in a browser.

> The FastAPI CORS configuration must allow the port being used by the Vite development server.

## Running the Full Application

The application requires three pieces to be running:

```text
WSL / Ubuntu
└── Redis
       ↑
Windows
└── FastAPI Backend
       ↑
Browser
└── React Frontend
```

A typical development session uses:

### Terminal 1 — Redis / WSL

```bash
sudo service redis-server start
redis-cli ping
```

### Terminal 2 — FastAPI

```powershell
cd backend
.venv\Scripts\Activate.ps1
uvicorn main:app --reload
```

### Terminal 3 — React

```powershell
cd frontend
npm run dev
```

Then open the Vite URL displayed in Terminal 3.

## Redis CRUD API

| Method | Endpoint | Description |
|---|---|---|
| POST | `/commits` | Create a commit |
| GET | `/commits/{commit_sha}` | Retrieve a commit |
| PUT | `/commits/{commit_sha}` | Update a commit |
| DELETE | `/commits/{commit_sha}` | Delete a commit |
| GET | `/redis/status` | Check Redis connection |

Commit records are stored as Redis hashes using keys structured as:

```text
commit:<commit_sha>
```

Example:

```text
commit:00001793511cc31df0d5050d6c6092d82dc60a68
```

## Testing

The Redis service layer can be tested with:

```powershell
cd backend
python test_redis_service.py
```

The FastAPI endpoints can also be tested interactively through:

```text
http://127.0.0.1:8000/docs
```

## Dataset

The project uses GitHub Archive JSON data.

The dataset is intentionally excluded from this repository because several source files exceed GitHub's file-size limits.

Place the dataset locally under:

```text
data/GitHubArchive-Dataset/
```

The dataset includes commit, repository, language, file, content, and license information that will be used for CRUD and analytical features.



## Architecture

```text
React
   |
   | HTTP / JSON
   v
FastAPI
   |
   | Python service layer
   v
Redis
   |
   └── MongoDB (planned)
```

Separating the frontend, API, service layer, and database connections allows additional databases to be added without rewriting the entire application.
