# Frontend Setup

## Overview

This frontend is built with React, Vite, and Material UI. It provides the internal employee access management portal user experience, including login, request creation, request dashboards, and request details.

## Prerequisites

- Node.js 18 or higher
- npm or yarn

## Install Dependencies

From the `frontend` folder:

```bash
npm install
```

## Run the App

From the `frontend` folder:

```bash
npm run dev
```

The local development server will typically start at `http://localhost:5173`.

## Notes

- The frontend consumes the backend API, so ensure the backend server is running before using the UI.
- API base URL is configured in `frontend/src/services/config.js` or via `VITE_API_BASE_URL` in Vite environment settings.
- If you need to change the backend host, update the environment variable or config file accordingly.
