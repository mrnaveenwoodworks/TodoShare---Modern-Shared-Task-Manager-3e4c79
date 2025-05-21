import React, { createContext, useContext, useReducer, useEffect } from "react";
import { loadTodos, saveTodos } from "../utils/localStorage";

// Create the context
const TodoContext = createContext();

// Define action types
const ADD_TODO = "ADD_TODO";
const REMOVE_TODO = "REMOVE_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const UPDATE_TODO = "UPDATE_TODO";
const SET_FILTER = "SET_FILTER";
const SHARE_TODO_LIST = "SHARE_TODO_LIST";
const LOAD_SHARED_LIST = "LOAD_SHARED_LIST";
const IMPORT_SHARED_LIST = "IMPORT_SHARED_LIST";

// Initial state
const initialState = {
  todos: [],
  sharedLists: [],
  filter: "all", // all, active, completed
  nextId: 1
};

// Reducer function
const todoReducer = (state, action) => {
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: state.nextId,
            text: action.payload.text,
            completed: false,
            priority: action.payload.priority || "medium",
            dueDate: action.payload.dueDate || null,
            createdAt: new Date().toISOString(),
            shared: false
          }
        ],
        nextId: state.nextId + 1
      };

    case REMOVE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };

    case TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };

    case UPDATE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, ...action.payload.updates }
            : todo
        )
      };

    case SET_FILTER:
      return {
        ...state,
        filter: action.payload
      };

    case SHARE_TODO_LIST:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.todoId
            ? { ...todo, shared: true, shareId: action.payload.shareId }
            : todo
        )
      };

    case LOAD_SHARED_LIST:
      return {
        ...state,
        sharedLists: action.payload
      };

    case IMPORT_SHARED_LIST:
      // Add shared todos to main list, avoiding duplicates
      const newSharedTodos = action.payload.todos.map(todo => ({
        ...todo,
        id: state.nextId + todo.id, // Ensure unique IDs
        imported: true,
        originalShareId: action.payload.shareId
      }));
      
      return {
        ...state,
        todos: [...state.todos, ...newSharedTodos],
        nextId: state.nextId + newSharedTodos.length
      };

    default:
      return state;
  }
};

// Provider component
export const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState, () => {
    const savedData = loadTodos();
    if (savedData && savedData.todos) {
      const maxId = savedData.todos.length > 0 
        ? Math.max(...savedData.todos.map(todo => todo.id))
        : 0;
      
      return {
        ...initialState,
        ...savedData,
        nextId: savedData.nextId || maxId + 1
      };
    }
    return initialState;
  });

  // Save todos to localStorage whenever the state changes
  useEffect(() => {
    saveTodos(state);
  }, [state]);

  // Actions
  const addTodo = (text, priority, dueDate) => {
    dispatch({ type: ADD_TODO, payload: { text, priority, dueDate } });
  };

  const removeTodo = id => {
    dispatch({ type: REMOVE_TODO, payload: id });
  };

  const toggleTodo = id => {
    dispatch({ type: TOGGLE_TODO, payload: id });
  };

  const updateTodo = (id, updates) => {
    dispatch({ type: UPDATE_TODO, payload: { id, updates } });
  };

  const setFilter = filter => {
    dispatch({ type: SET_FILTER, payload: filter });
  };

  const shareTodoList = (todoId, shareId) => {
    dispatch({ type: SHARE_TODO_LIST, payload: { todoId, shareId } });
  };

  const loadSharedList = sharedLists => {
    dispatch({ type: LOAD_SHARED_LIST, payload: sharedLists });
  };

  const importSharedList = (todos, shareId) => {
    dispatch({ type: IMPORT_SHARED_LIST, payload: { todos, shareId } });
  };

  // Get filtered todos
  const getFilteredTodos = () => {
    switch (state.filter) {
      case "active":
        return state.todos.filter(todo => !todo.completed);
      case "completed":
        return state.todos.filter(todo => todo.completed);
      default:
        return state.todos;
    }
  };

  // Context value
  const value = {
    todos: state.todos,
    filteredTodos: getFilteredTodos(),
    filter: state.filter,
    sharedLists: state.sharedLists,
    addTodo,
    removeTodo,
    toggleTodo,
    updateTodo,
    setFilter,
    shareTodoList,
    loadSharedList,
    importSharedList
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

// Custom hook to use the todo context
export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodoContext must be used within a TodoProvider");
  }
  return context;
};

export default TodoContext;