# Backend Setup

## Overview

This backend is built with Python and FastAPI. It connects to PostgreSQL using SQLAlchemy and exposes APIs for request management, admin approval, analytics, and timeline tracking.

## Prerequisites

- Python 3.10 or higher
- PostgreSQL installed and running
- `pip` package manager
- A `.env` file in the backend folder containing the database connection and auth settings

## Environment

Create a `.env` file in `backend/` with:

```env
DATABASE_URL=postgresql://postgres:123456@localhost/employee_access_portal
SECRET_KEY=mysecretkey
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Adjust the `DATABASE_URL` value to match your PostgreSQL credentials and database name.

## Install Dependencies

From the `backend` folder:

```bash
pip install -r requirements.txt
```

## Run the Server

From the `backend` folder:

```bash
uvicorn app.main:app --reload
```

By default, the API server will run at `http://127.0.0.1:8000`.

## Notes

- The backend automatically uses SQLAlchemy models to create and manage the database schema at runtime.
- The app reads configuration from `.env` using `python-dotenv`.
- If you need to rebuild the database, drop and recreate the PostgreSQL database used in `DATABASE_URL`.
