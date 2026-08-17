import React, { useState, useEffect, useMemo, useCallback } from "react";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";
import FilterBar from "./components/FilterBar.jsx";
import { fetchTasks, createTask, updateTask, completeTask, deleteTask } from "./api.js";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [editingTask, setEditingTask] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchTasks();
      setTasks(data);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function handleCreateTask(formValues) {
    try {
      const newTask = await createTask(formValues);
      setTasks((previous) => [newTask, ...previous]);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleUpdateTask(taskId, formValues) {
    try {
      const updated = await updateTask(taskId, formValues);
      setTasks((previous) => previous.map((t) => (t.id === taskId ? updated : t)));
      setEditingTask(null);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleCompleteTask(taskId) {
    try {
      const updated = await completeTask(taskId);
      setTasks((previous) => previous.map((t) => (t.id === taskId ? updated : t)));
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleDeleteTask(taskId) {
    try {
      await deleteTask(taskId);
      setTasks((previous) => previous.filter((t) => t.id !== taskId));
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  // Live search + filtering happens entirely on the frontend, over the
  // already-fetched task list, per the spec.
  const visibleTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter;
      const matchesStatus = statusFilter === "All" || task.status === statusFilter;
      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [tasks, searchTerm, priorityFilter, statusFilter]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Task Manager</h1>
        <p>Create, track, and organize your tasks.</p>
      </header>

      {errorMessage && <div className="error-banner">{errorMessage}</div>}

      <TaskForm
        editingTask={editingTask}
        onCreate={handleCreateTask}
        onUpdate={handleUpdateTask}
        onCancelEdit={() => setEditingTask(null)}
      />

      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {isLoading ? (
        <p>Loading tasks...</p>
      ) : (
        <TaskList
          tasks={visibleTasks}
          onEdit={setEditingTask}
          onComplete={handleCompleteTask}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
}
