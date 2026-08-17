import React, { useState, useEffect } from "react";

const EMPTY_FORM = { title: "", description: "", priority: "Medium" };

/**
 * TaskForm handles both creating a new task and editing an existing one.
 * When `editingTask` is provided, the form is pre-filled and switches to
 * "update" mode; otherwise it behaves as the "create task" form.
 */
export default function TaskForm({ editingTask, onCreate, onUpdate, onCancelEdit }) {
  const [formValues, setFormValues] = useState(EMPTY_FORM);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (editingTask) {
      setFormValues({
        title: editingTask.title,
        description: editingTask.description || "",
        priority: editingTask.priority,
      });
    } else {
      setFormValues(EMPTY_FORM);
    }
    setValidationError("");
  }, [editingTask]);

  function handleChange(field, value) {
    setFormValues((previous) => ({ ...previous, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Frontend validation mirrors the backend rule: title is required.
    if (!formValues.title.trim()) {
      setValidationError("Title must not be empty");
      return;
    }
    setValidationError("");

    if (editingTask) {
      onUpdate(editingTask.id, formValues);
    } else {
      onCreate(formValues);
      setFormValues(EMPTY_FORM);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3 style={{ marginTop: 0 }}>{editingTask ? "Edit Task" : "New Task"}</h3>

      {validationError && <div className="error-banner">{validationError}</div>}

      <div className="form-row">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          value={formValues.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="e.g. Write project report"
        />
      </div>

      <div className="form-row">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={formValues.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Optional details..."
        />
      </div>

      <div className="form-row">
        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          value={formValues.priority}
          onChange={(e) => handleChange("priority", e.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {editingTask ? "Save Changes" : "Add Task"}
        </button>
        {editingTask && (
          <button type="button" className="btn-secondary" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
