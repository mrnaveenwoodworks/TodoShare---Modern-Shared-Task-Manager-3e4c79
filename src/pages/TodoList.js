import React, { useState } from "react";
import { useTodoContext } from "../context/TodoContext";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import ShareModal from "../components/ShareModal";

const TodoList = () => {
  const { todos } = useTodoContext();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  // Implement the handleShareClick function to be used with task sharing
  const handleShareClick = (todoId) => {
    setSelectedTodoId(todoId);
    setIsShareModalOpen(true);
  };

  // Implement the handleEditTask function for task editing
  const handleEditTask = (todo) => {
    setEditingTask(todo);
    // Scroll to the task form
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  const completionPercentage = 
    todos.length > 0 ? Math.round((completedTodos.length / todos.length) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header with progress summary */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Tasks</h1>
        
        <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
          <div className="text-gray-600">
            {todos.length === 0 ? (
              "No tasks yet. Add your first task to get started!"
            ) : (
              <>
                <span className="font-medium">{activeTodos.length}</span> tasks remaining,{" "}
                <span className="font-medium">{completedTodos.length}</span> completed
              </>
            )}
          </div>
          
          <div className="flex items-center">
            <span className="text-sm font-medium text-indigo-700 mr-2">
              {completionPercentage}%
            </span>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Task form */}
      <div className="mb-8">
        <TaskForm 
          editTask={editingTask} 
          onCancel={editingTask ? handleCancelEdit : null} 
        />
      </div>

      {/* Task list - pass the handleEditTask and handleShareClick functions */}
      <TaskList onEditTask={handleEditTask} onShareTask={handleShareClick} />

      {/* Empty state */}
      {todos.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="32" height="32"><rect width="256" height="256" fill="none"/><path d="M160,40h40a8,8,0,0,1,8,8V216a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8H96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M88,72V64a40,40,0,0,1,80,0v8Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
          </div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Your task list is empty</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Start by adding your first task using the form above. You can prioritize tasks,
            set due dates, and share them with others.
          </p>
        </div>
      )}

      {/* Tips section */}
      {todos.length > 0 && todos.length < 3 && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <h3 className="text-md font-medium text-blue-800 mb-2 flex items-center">
            <span className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="88" y1="232" x2="168" y2="232" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M78.7,167A79.87,79.87,0,0,1,48,104.45C47.76,61.09,82.72,25,126.07,24a80,80,0,0,1,51.34,142.9A24.3,24.3,0,0,0,168,186v2a8,8,0,0,1-8,8H96a8,8,0,0,1-8-8v-2A24.11,24.11,0,0,0,78.7,167Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M140,70a36.39,36.39,0,0,1,24,30" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            </span>
            Tips for using TodoShare
          </h3>
          <ul className="text-sm text-blue-700 ml-6 list-disc">
            <li className="mb-1">Add due dates to better organize your tasks</li>
            <li className="mb-1">Use priorities (low, medium, high) to focus on what matters</li>
            <li className="mb-1">Share tasks with teammates by clicking the share icon</li>
            <li>Complete tasks by clicking the checkbox next to each task</li>
          </ul>
        </div>
      )}
      
      {/* Share Modal */}
      {isShareModalOpen && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          todoId={selectedTodoId}
        />
      )}
    </div>
  );
};

export default TodoList;