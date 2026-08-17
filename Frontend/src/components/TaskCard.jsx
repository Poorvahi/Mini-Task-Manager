import React from "react";

function formatTimestamp(isoString) {
  if (!isoString) return "—";
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/**
 * TaskCard renders a single task's details plus its action buttons
 * (Complete, Edit, Delete). All actions are delegated back up to App.jsx
 * via callback props, keeping this component purely presentational.
 */
export default function TaskCard({ task, onEdit, onComplete, onDelete }) {
  const isCompleted = task.status === "Completed";

  function handleDeleteClick() {
    const confirmed = window.confirm(`Delete "${task.title}"? This cannot be undone.`);
    if (confirmed) {
      onDelete(task.id);
    }
  }

  return (
    <div className={`task-card priority-${task.priority} status-${task.status}`}>
      <div className="task-card-header">
        <div>
          <h4 className={`task-title ${isCompleted ? "completed" : ""}`}>{task.title}</h4>
          <span className={`badge badge-priority-${task.priority}`}>{task.priority}</span>
          <span className={`badge badge-status-${task.status}`}>{task.status}</span>
        </div>
      </div>

      {task.description && <p className="task-description">{task.description}</p>}

      <div className="task-meta">
        Created: {formatTimestamp(task.created_at)} · Updated: {formatTimestamp(task.updated_at)}
      </div>

      <div className="task-actions">
        {!isCompleted && (
          <button className="btn-success" onClick={() => onComplete(task.id)}>
            Complete
          </button>
        )}
        <button className="btn-secondary" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="btn-danger" onClick={handleDeleteClick}>
          Delete
        </button>
      </div>
    </div>
  );
}
