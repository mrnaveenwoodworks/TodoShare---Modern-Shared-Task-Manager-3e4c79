import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { TodoProvider } from "./context/TodoContext";
import Layout from "./components/Layout";
import TodoList from "./pages/TodoList";
import SharedLists from "./pages/SharedLists";

const App = () => {
  return (
    <TodoProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Default route redirects to todo list */}
            <Route index element={<TodoList />} />
            
            {/* Shared lists route */}
            <Route path="shared" element={<SharedLists />} />
            
            {/* Fallback route for any unmatched paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>

        {/* Modal root for sharing dialogs */}
        <div id="modal-root"></div>
      </div>
    </TodoProvider>
  );
};

export default App;