# DB Hub

DB Hub is a full-stack database application for working with GitHub Archive data. The project uses a React frontend, a Python/FastAPI backend, and Redis for data storage.

The application reads GitHub Archive JSON data, imports commit records into Redis, and allows users to create, read, update, delete, and search commit information. MongoDB support will be added during the next phase of the project.

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
- MongoDB — planned for Week 2

## Current Features

- Import GitHub Archive commit data from JSON into Redis
- Store commit records as Redis hashes
- Create GitHub commit records
- Read commit records by commit SHA
- Update existing commit records
- Delete commit records
- Search commits by repository name
- Search commits by author name
- Search commits by author email
- Search commit subjects by keyword
- Redis Sets used to index searchable commit information
- Redis connection status endpoint
- React interface for CRUD operations
- React interface for searching GitHub Archive data
- Formatted search results
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
│   ├── import_data.py
│   ├── test_redis_service.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ApiResponse.jsx
│   │   │   ├── CommitSearchCard.jsx
│   │   │   ├── CommitSearchResults.jsx
│   │   │   └── RedisCrudCard.jsx
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
│
├── data/
│   └── GitHubArchive-Dataset/
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

This project was developed on Windows with Redis running through WSL/Ubuntu.

## 1. Clone the Repository

```bash
git clone https://github.com/UBSDFS/db-hub-proj.git
cd db-hub-proj
```

> **Course submission note:** The submitted ZIP contains the GitHub Archive dataset used by the application. The dataset is excluded from the GitHub repository because several source files exceed GitHub's file-size limits.

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

Install the required Python dependencies:

```powershell
pip install -r requirements.txt
```

The `requirements.txt` file contains the Python packages and versions used by the backend.

## 3. Configure Redis

Redis must be running before starting the backend.

The development environment for this project uses Redis inside WSL/Ubuntu.

Start Redis:

```bash
sudo service redis-server start
```

Verify that Redis is running:

```bash
redis-cli ping
```

A successful connection should return:

```text
PONG
```

If authentication is enabled, use the password configured for your Redis installation.

### Environment Variables

The backend uses environment variables to configure the Redis connection.

An example configuration file is provided at:

```text
backend/.env.example
```

Create your local `.env` file by copying the example:

```powershell
Copy-Item .env.example .env
```

Then update `.env` with the settings for your Redis installation:

```env
REDIS_HOST=YOUR_REDIS_HOST
REDIS_PORT=6379
REDIS_DB=0
REDIS_PASSWORD=YOUR_REDIS_PASSWORD
```

The `.env` file contains machine-specific configuration and should not be committed to GitHub.

If Redis is running through WSL, the WSL IP address can be found with:

```bash
hostname -I
```

Use the appropriate address as `REDIS_HOST`.

## 4. GitHub Archive Dataset

The project uses JSON-formatted data from the GitHub Archive dataset.

The dataset should be placed inside the project's `data` directory. The current importer uses:

```text
data/
└── GitHubArchive-Dataset/
    └── GitHubArchive-Dataset/
        └── Sample_Commits.json
```

The GitHub Archive files use JSON Lines format, meaning each line contains an individual JSON record.

The dataset is excluded from the public GitHub repository because several source files exceed GitHub's file-size limits.

For the course submission, the dataset is included in the submitted ZIP so the application can be tested with the provided data.

## 5. Import GitHub Commit Data

Before searching the provided GitHub Archive data, import commit records into Redis.

From the `backend` directory with the virtual environment activated:

```powershell
python import_data.py
```

The importer reads records from `Sample_Commits.json` and stores selected commit information in Redis.

Commit records are stored using the commit SHA as the primary identifier.

The importer also creates indexes that allow records to be searched by:

- Repository name
- Author name
- Author email

Subject keywords can also be searched through the application.

## 6. Start the FastAPI Backend

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

The Redis connection can be checked through:

```text
GET /redis/status
```

## 7. Set Up the React Frontend

Open another terminal and navigate to the frontend:

```powershell
cd frontend
```

Install the frontend dependencies:

```powershell
npm install
```

Start the Vite development server:

```powershell
npm run dev
```

Vite will display the local frontend address in the terminal, typically:

```text
http://localhost:5173
```

or:

```text
http://localhost:5174
```

Open the displayed address in a browser.

> The FastAPI CORS configuration must allow the port being used by the Vite development server.

## Running the Full Application

A normal development session uses three terminals:

### Terminal 1 — Redis / WSL

```bash
sudo service redis-server start
redis-cli ping
```

### Terminal 2 — FastAPI Backend

```powershell
cd backend
.venv\Scripts\Activate.ps1
uvicorn main:app --reload
```

### Terminal 3 — React Frontend

```powershell
cd frontend
npm run dev
```

Then open the Vite address displayed in Terminal 3.

The application flow is:

```text
GitHub Archive JSON
        |
        v
Python Importer
        |
        v
Redis
        |
        v
FastAPI
        |
        v
React
```

## Redis API

| Method | Endpoint                | Description                 |
| ------ | ----------------------- | --------------------------- |
| POST   | `/commits`              | Create a commit             |
| GET    | `/commits/{commit_sha}` | Retrieve a commit by SHA    |
| PUT    | `/commits/{commit_sha}` | Update a commit             |
| DELETE | `/commits/{commit_sha}` | Delete a commit             |
| GET    | `/commits/search`       | Search imported commit data |
| GET    | `/redis/status`         | Check Redis connection      |

### Searching Commit Data

The `/commits/search` endpoint supports searches using:

```text
repo_name
author_name
author_email
subject
```

For example:

```text
GET /commits/search?repo_name=torvalds/linux
```

Searches can also be performed through the React interface.

## Redis Data Structure

Commit records are stored as Redis hashes using keys structured as:

```text
commit:<commit_sha>
```

Example:

```text
commit:00001793511cc31df0d5050d6c6092d82dc60a68
```

Redis Sets are also used to create indexes for repository names, author names, and author email addresses.

Examples:

```text
index:repo:torvalds/linux

index:author_name:Author Name

index:author_email:author@example.com
```

These indexes allow users to locate commits without already knowing the commit SHA.

## Testing

The Redis service layer can be tested with:

```powershell
cd backend
python test_redis_service.py
```

FastAPI endpoints can also be tested through the interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

The React interface can be used to test CRUD operations and searches through the browser.

## Dataset

The GitHub Archive dataset contains commit, repository, language, file, content, and license information.

During Week 1, DB Hub primarily uses commit information from:

```text
Sample_Commits.json
```

The Python importer reads the JSON data and stores selected fields in Redis for retrieval and searching.

Because several dataset files exceed GitHub's file-size limits, the dataset is not stored in the public GitHub repository. It is included separately with the course project submission.

## Architecture

```text
React Frontend
      |
      | HTTP / JSON
      v
FastAPI Backend
      |
      | Python service layer
      v
Redis
```

The project separates the frontend, API, service layer, and database connection. This structure allows additional database technologies to be added without rebuilding the entire application.

MongoDB integration is planned for Week 2.
