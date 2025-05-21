import React, { useState, useEffect } from "react";
import { useTodoContext } from "../context/TodoContext";

const TaskForm = ({ editTask = null, onCancel = null }) => {
  const { addTodo, updateTodo } = useTodoContext();
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  // When editing a task, populate the form with its data
  useEffect(() => {
    if (editTask) {
      setText(editTask.text);
      setPriority(editTask.priority || "medium");
      setDueDate(
        editTask.dueDate ? new Date(editTask.dueDate).toISOString().split("T")[0] : ""
      );
    }
  }, [editTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate input
    if (!text.trim()) {
      setError("Task description cannot be empty");
      return;
    }

    // Clear any previous errors
    setError("");

    if (editTask) {
      // Update existing task
      updateTodo(editTask.id, {
        text: text.trim(),
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null
      });
      
      // Call onCancel if provided (to exit edit mode)
      if (onCancel) onCancel();
    } else {
      // Create new task
      addTodo(text.trim(), priority, dueDate ? new Date(dueDate).toISOString() : null);
      
      // Clear form after adding
      setText("");
      setPriority("medium");
      setDueDate("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
        <span className="mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="88" y1="128" x2="168" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="88" x2="128" y2="168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
        </span>
        {editTask ? "Edit Task" : "Add New Task"}
      </h2>
      
      <form onSubmit={handleSubmit}>
        {/* Task description input */}
        <div className="mb-4">
          <label 
            htmlFor="task-text" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Task Description
          </label>
          <input
            type="text"
            id="task-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            autoFocus
          />
        </div>
        
        {/* Priority selection */}
        <div className="mb-4">
          <label 
            htmlFor="priority" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Priority
          </label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setPriority("low")}
              className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                priority === "low"
                  ? "bg-blue-100 border-blue-500 text-blue-700"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                Low
              </div>
            </button>
            <button
              type="button"
              onClick={() => setPriority("medium")}
              className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                priority === "medium"
                  ? "bg-yellow-100 border-yellow-500 text-yellow-700"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center">
                <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                Medium
              </div>
            </button>
            <button
              type="button"
              onClick={() => setPriority("high")}
              className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                priority === "high"
                  ? "bg-red-100 border-red-500 text-red-700"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                High
              </div>
            </button>
          </div>
        </div>
        
        {/* Due date */}
        <div className="mb-4">
          <label 
            htmlFor="due-date" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Due Date (Optional)
          </label>
          <input
            type="date"
            id="due-date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 text-red-500 text-sm">{error}</div>
        )}
        
        {/* Form actions */}
        <div className="flex items-center justify-end space-x-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all shadow-md hover:shadow-lg"
          >
            {editTask ? "Update Task" : "Add Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;