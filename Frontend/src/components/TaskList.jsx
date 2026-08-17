import React from "react";
import TaskCard from "./TaskCard.jsx";

/**
 * TaskList renders the filtered/searched list of tasks, or an empty-state
 * message when there is nothing to show.
 */
export default function TaskList({ tasks, onEdit, onComplete, onDelete }) {
  if (tasks.length === 0) {
    return <div className="empty-state">No tasks match your search or filters.</div>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onComplete={onComplete}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
