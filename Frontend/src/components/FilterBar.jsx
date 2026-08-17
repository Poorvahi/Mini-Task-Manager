import React from "react";

/**
 * FilterBar renders the live-search input plus the priority/status
 * dropdown filters. It is a controlled component: all state lives in
 * the parent (App.jsx) and is passed down as props.
 */
export default function FilterBar({
  searchTerm,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
  statusFilter,
  onStatusFilterChange,
}) {
  return (
    <div className="filter-bar card">
      <div className="form-row" style={{ flex: 1 }}>
        <label htmlFor="search">Search by title</label>
        <input
          id="search"
          type="text"
          placeholder="Type to search..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="form-row">
        <label htmlFor="priority-filter">Priority</label>
        <select
          id="priority-filter"
          value={priorityFilter}
          onChange={(e) => onPriorityFilterChange(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="status-filter">Status</label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
    </div>
  );
}
