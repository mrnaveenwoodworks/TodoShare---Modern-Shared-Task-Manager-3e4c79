// Constants for local storage keys
const STORAGE_KEYS = {
  TODOS: "todoShare_todos",
  SHARED_LISTS: "todoShare_sharedLists",
  SETTINGS: "todoShare_settings"
};

/**
 * Saves todo data to local storage
 * @param {Array} todos - Array of todo items
 */
export const saveTodos = (todos) => {
  try {
    const serializedTodos = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEYS.TODOS, serializedTodos);
  } catch (error) {
    console.error("Error saving todos to localStorage:", error);
  }
};

/**
 * Retrieves todo data from local storage
 * @returns {Array} Array of todo items, or empty array if none found
 */
export const loadTodos = () => {
  try {
    const serializedTodos = localStorage.getItem(STORAGE_KEYS.TODOS);
    if (serializedTodos === null) {
      return [];
    }
    return JSON.parse(serializedTodos);
  } catch (error) {
    console.error("Error loading todos from localStorage:", error);
    return [];
  }
};

/**
 * Saves shared lists data to local storage
 * @param {Array} lists - Array of shared list objects
 */
export const saveSharedLists = (lists) => {
  try {
    const serializedLists = JSON.stringify(lists);
    localStorage.setItem(STORAGE_KEYS.SHARED_LISTS, serializedLists);
  } catch (error) {
    console.error("Error saving shared lists to localStorage:", error);
  }
};

/**
 * Retrieves shared lists data from local storage
 * @returns {Array} Array of shared list objects, or empty array if none found
 */
export const loadSharedLists = () => {
  try {
    const serializedLists = localStorage.getItem(STORAGE_KEYS.SHARED_LISTS);
    if (serializedLists === null) {
      return [];
    }
    return JSON.parse(serializedLists);
  } catch (error) {
    console.error("Error loading shared lists from localStorage:", error);
    return [];
  }
};

/**
 * Saves user settings to local storage
 * @param {Object} settings - User settings object
 */
export const saveSettings = (settings) => {
  try {
    const serializedSettings = JSON.stringify(settings);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, serializedSettings);
  } catch (error) {
    console.error("Error saving settings to localStorage:", error);
  }
};

/**
 * Retrieves user settings from local storage
 * @returns {Object} User settings object, or default settings if none found
 */
export const loadSettings = () => {
  try {
    const serializedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (serializedSettings === null) {
      return getDefaultSettings();
    }
    return JSON.parse(serializedSettings);
  } catch (error) {
    console.error("Error loading settings from localStorage:", error);
    return getDefaultSettings();
  }
};

/**
 * Clears all todo-related data from local storage
 */
export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error("Error clearing data from localStorage:", error);
  }
};

/**
 * Returns default settings object
 * @returns {Object} Default settings
 */
const getDefaultSettings = () => {
  return {
    theme: "light",
    sortBy: "newest",
    showCompleted: true,
    defaultPriority: "medium",
    notifications: true
  };
};

/**
 * Checks if local storage is available
 * @returns {boolean} True if local storage is available
 */
export const isStorageAvailable = () => {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
};