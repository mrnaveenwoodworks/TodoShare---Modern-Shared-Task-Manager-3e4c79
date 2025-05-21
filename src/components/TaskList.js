import React, { useState, useEffect } from "react";
import { useTodoContext } from "../context/TodoContext";
import TaskItem from "./TaskItem";

const TaskList = ({ sharedView = false }) => {
  const { filteredTodos, setFilter, filter } = useTodoContext();
  const [sortBy, setSortBy] = useState("newest");
  const [sortedTodos, setSortedTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Apply sorting and filtering to todos
  useEffect(() => {
    let result = [...filteredTodos];

    // Apply search filter if query exists
    if (searchQuery.trim()) {
      result = result.filter(todo => 
        todo.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "alphabetical":
        result.sort((a, b) => a.text.localeCompare(b.text));
        break;
      case "priority":
        // Sort by priority (high > medium > low) and then by creation date (newest first)
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        result.sort((a, b) => {
          const priorityDiff = priorityWeight[b.priority || "medium"] - priorityWeight[a.priority || "medium"];
          return priorityDiff !== 0 ? priorityDiff : new Date(b.createdAt) - new Date(a.createdAt);
        });
        break;
      case "dueDate":
        // Sort by due date (closest first), with null/undefined values at the end
        result.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
        break;
      default:
        // Default to newest
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setSortedTodos(result);
  }, [filteredTodos, sortBy, searchQuery]);

  // Handle filter changes
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  // Count tasks by status
  const countTasks = (status) => {
    switch (status) {
      case "all":
        return filteredTodos.length;
      case "active":
        return filteredTodos.filter(todo => !todo.completed).length;
      case "completed":
        return filteredTodos.filter(todo => todo.completed).length;
      default:
        return 0;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {sharedView ? "Shared Tasks" : "My Tasks"}
        </h2>

        {/* Search and filter bar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          {/* Search input */}
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><rect x="48" y="120" width="88" height="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M208,188v12a8,8,0,0,1-8,8H180" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="208" y1="116" x2="208" y2="140" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M184,48h16a8,8,0,0,1,8,8V72" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="116" y1="48" x2="140" y2="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M48,76V56a8,8,0,0,1,8-8H68" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><line x1="160" y1="96" x2="96" y2="160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="96" y1="96" x2="160" y2="160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="priority">Priority</option>
                <option value="dueDate">Due Date</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><path d="M216,112V56a8,8,0,0,0-8-8H48a8,8,0,0,0-8,8v56c0,96,88,120,88,120S216,208,216,112Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="201.97 171.78 128 120 54.03 171.78" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex mb-5 border-b">
          <button
            onClick={() => handleFilterChange("all")}
            className={`px-4 py-2 font-medium text-sm relative ${
              filter === "all"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            All
            <span className="ml-1.5 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
              {countTasks("all")}
            </span>
          </button>
          <button
            onClick={() => handleFilterChange("active")}
            className={`px-4 py-2 font-medium text-sm relative ${
              filter === "active"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Active
            <span className="ml-1.5 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
              {countTasks("active")}
            </span>
          </button>
          <button
            onClick={() => handleFilterChange("completed")}
            className={`px-4 py-2 font-medium text-sm relative ${
              filter === "completed"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Completed
            <span className="ml-1.5 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
              {countTasks("completed")}
            </span>
          </button>
        </div>

        {/* Task list */}
        {sortedTodos.length > 0 ? (
          <div>
            {sortedTodos.map(todo => (
              <TaskItem key={todo.id} todo={todo} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full text-indigo-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><path d="M160,40h40a8,8,0,0,1,8,8V216a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8H96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M88,72V64a40,40,0,0,1,80,0v8Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks found</h3>
            <p className="text-gray-500">
              {searchQuery
                ? "No tasks match your search. Try a different query."
                : filter === "completed"
                ? "You haven't completed any tasks yet."
                : filter === "active"
                ? "You don't have any active tasks."
                : "Start by adding a new task above."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;