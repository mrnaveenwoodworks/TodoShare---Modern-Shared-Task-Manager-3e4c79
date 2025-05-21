import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useTodoContext } from "../context/TodoContext";
import { generateShareLink } from "../utils/shareUtils";

const ShareModal = ({ isOpen, onClose, todoId }) => {
  const { todos } = useTodoContext();
  const [shareLink, setShareLink] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState([]);
  const [copySuccess, setCopySuccess] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [error, setError] = useState("");

  // Find the todo item being shared
  const todoToShare = todos.find(todo => todo.id === todoId);

  // Generate share link when modal opens
  useEffect(() => {
    if (isOpen && todoId && todoToShare) {
      try {
        const link = generateShareLink(todoToShare);
        setShareLink(link);
      } catch (err) {
        setError("Failed to generate share link: " + err.message);
      }
    }
    
    // Reset states when modal opens/closes
    return () => {
      setCopySuccess(false);
      setSendSuccess(false);
      setError("");
    };
  }, [isOpen, todoId, todoToShare]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      })
      .catch(() => {
        setError("Failed to copy link. Please try again.");
        setTimeout(() => setError(""), 3000);
      });
  };

  const handleEmailInputChange = (e) => {
    setEmailInput(e.target.value);
  };

  const handleAddEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput && emailRegex.test(emailInput)) {
      if (!emails.includes(emailInput)) {
        setEmails([...emails, emailInput]);
        setEmailInput("");
        setError("");
      } else {
        setError("Email already added");
      }
    } else {
      setError("Please enter a valid email");
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    setEmails(emails.filter(email => email !== emailToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleShareByEmail = () => {
    // In a real app, this would call an API to send emails
    // For this demo, we'll simulate success after a delay
    if (emails.length === 0) {
      setError("Please add at least one email");
      return;
    }

    setSendSuccess(true);
    setTimeout(() => {
      setSendSuccess(false);
      setEmails([]);
    }, 3000);
  };

  // Use a portal to render the modal
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-white text-xl font-semibold">Share Todo List</h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><rect x="88" y="88" width="80" height="80" rx="12"/></svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Task being shared */}
          {todoToShare && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Sharing:</h3>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className={`flex items-center ${todoToShare.completed ? "text-gray-400 line-through" : ""}`}>
                  <span className={`inline-block w-3 h-3 rounded-full mr-3 ${
                    todoToShare.priority === "high" ? "bg-red-500" :
                    todoToShare.priority === "medium" ? "bg-yellow-500" : "bg-blue-500"
                  }`}></span>
                  <span className="font-medium">{todoToShare.text}</span>
                </div>
              </div>
            </div>
          )}

          {/* Share link section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Share via link</h3>
            <div className="flex">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 border border-gray-300 rounded-l-lg py-2 px-4 bg-gray-50 text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-r-lg transition"
              >
                {copySuccess ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Share via email section */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Share via email</h3>
            <div className="flex mb-3">
              <input
                type="email"
                value={emailInput}
                onChange={handleEmailInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter email address"
                className="flex-1 border border-gray-300 rounded-l-lg py-2 px-4 text-sm"
              />
              <button
                onClick={handleAddEmail}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-r-lg transition"
              >
                Add
              </button>
            </div>

            {/* Email chips */}
            {emails.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  {emails.map((email, index) => (
                    <div 
                      key={index} 
                      className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full flex items-center"
                    >
                      <span>{email}</span>
                      <button 
                        onClick={() => handleRemoveEmail(email)} 
                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><rect width="256" height="256" fill="none"/><rect x="48" y="120" width="88" height="88" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><path d="M208,188v12a8,8,0,0,1-8,8H180" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><line x1="208" y1="116" x2="208" y2="140" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><path d="M184,48h16a8,8,0,0,1,8,8V72" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><line x1="116" y1="48" x2="140" y2="48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><path d="M48,76V56a8,8,0,0,1,8-8H68" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleShareByEmail}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition flex items-center justify-center"
                  disabled={sendSuccess}
                >
                  {sendSuccess ? (
                    <span className="flex items-center">
                      <span className="mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="18" height="18"><rect width="256" height="256" fill="none"/><polyline points="88 136 112 160 168 104" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><rect x="40" y="40" width="176" height="176" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/></svg>
                      </span>
                      Sent Successfully!
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <span className="mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="18" height="18"><rect width="256" height="256" fill="none"/><line x1="96" y1="100" x2="160" y2="100" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><line x1="96" y1="140" x2="160" y2="140" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/><path d="M105.07,192l16,28a8,8,0,0,0,13.9,0l16-28H216a8,8,0,0,0,8-8V56a8,8,0,0,0-8-8H40a8,8,0,0,0-8,8V184a8,8,0,0,0,8,8Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/></svg>
                      </span>
                      Share via Email
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-2 text-red-500 text-sm">{error}</div>
          )}
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default ShareModal;