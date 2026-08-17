# Task Manager

A full-stack task manager built with a **FastAPI + SQLite** backend and a
**React (Vite)** frontend.

## Prerequisites

- Python 3.10 or newer
- Node.js 18 or newer (includes npm)
- No external database or paid services required — SQLite is a local file
  that is created automatically.

## How to run the backend (step by step)

1. Open a terminal and move into the backend folder:
   ```bash
   cd task-manager/backend
   ```
2. (Recommended) create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate      # on Windows: venv\Scripts\activate
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the API server:
   ```bash
   uvicorn main:app --reload
   ```
5. The API is now running at `http://localhost:8000`. On first run it
   automatically creates a `tasks.db` SQLite file in the `backend/` folder —
   no manual database setup needed.
6. You can view interactive API docs at `http://localhost:8000/docs`.

## How to run the frontend (step by step)

1. Open a **second** terminal and move into the frontend folder:
   ```bash
   cd task-manager/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open the URL shown in the terminal — by default
   `http://localhost:5173`.

Make sure the backend (step above) is running at the same time, since the
frontend calls `http://localhost:8000` for all data.

## How to use the app

- **Add a task**: fill in the "New Task" form (title is required) and click
  **Add Task**.
- **View tasks**: all tasks are listed below the form, newest first, showing
  title, priority, status, and timestamps.
- **Search**: type into the "Search by title" box to live-filter tasks as
  you type.
- **Filter**: use the Priority and Status dropdowns to narrow the list.
- **Edit a task**: click **Edit** on a task card, change any field in the
  form, then click **Save Changes**.
- **Complete a task**: click **Complete** on a task card to mark it done
  (status turns to `Completed`, and the card is greyed out with a
  strikethrough title).
- **Delete a task**: click **Delete** and confirm in the popup — deletion is
  permanent.

## Assumptions made

- "Filter by status" was interpreted as Pending vs. Completed only, matching
  the two allowed status values.
- Search and filtering happen entirely on the frontend against the already
  fetched task list (as specified), rather than as backend query
  parameters — this keeps the search instant/live with no extra API calls.
- Editing a task allows changing title, description, priority, **and**
  status (so a completed task can be reverted to Pending from the edit
  form, in addition to the one-click Complete button).
- `index.html` is placed at the frontend project root (`frontend/index.html`)
  because Vite requires its entry HTML file there; a copy is also kept at
  `frontend/public/index.html` to match the requested folder layout, but the
  root copy is the one Vite actually serves.
- No authentication/user accounts were implemented — the spec describes a
  single-user local task manager.

## AI tools used and how
ChatGPT — used to draft the initial project roadmap: breaking the spec down into a build order (backend schema → API routes → frontend components → validation → docs) and sequencing the features before any code was written.
Antigravity — used to improve the frontend's visual design: refining layout, spacing, and styling choices in the React components (task cards, filter bar, form).
Claude (Anthropic) — used to write and enhance the backend API implementation: the FastAPI routes, SQLAlchemy models, Pydantic validation schemas, and the CRUD data-access layer.