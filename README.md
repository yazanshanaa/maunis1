# Synapse Risk-Coach Pro

This repository contains an early prototype of the Synapse Risk-Coach Pro project.

## Project Structure

```
backend/   # Flask API and database models
frontend/  # React PWA sources
```

### Backend

- Flask application entry point at `backend/main.py`.
- API routes live under `backend/src/routes`.
- Database models live under `backend/src/models`.

To run the backend locally:

```bash
python backend/main.py
```

### Frontend

Frontend source files are stored under `frontend/`. The project currently contains a minimal React setup and PWA manifest.

### Testing

A placeholder npm test script is provided. Run it with:

```bash
npm test
```

