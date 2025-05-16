// Constants for share link configuration
const SHARE_CONFIG = {
  LINK_EXPIRY_DAYS: 7,
  PERMISSIONS: {
    VIEW: "view",
    EDIT: "edit"
  },
  LINK_PREFIX: "todoShare://share/"
};

/**
 * Generates a unique share ID for a todo list
 * @returns {string} A unique share identifier
 */
const generateShareId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomStr}`;
};

/**
 * Creates a shareable link for a todo list
 * @param {string} todoId - The ID of the todo list to share
 * @param {Object} options - Share link options
 * @param {string} options.permission - Permission level ("view" or "edit")
 * @param {number} options.expiryDays - Number of days until link expires
 * @returns {Object} Share link details
 */
export const createShareLink = (todoId, options = {}) => {
  const {
    permission = SHARE_CONFIG.PERMISSIONS.VIEW,
    expiryDays = SHARE_CONFIG.LINK_EXPIRY_DAYS
  } = options;

  const shareId = generateShareId();
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + expiryDays);

  const shareData = {
    id: shareId,
    todoId,
    permission,
    createdAt: new Date().toISOString(),
    expiresAt: expiryDate.toISOString(),
    link: `${SHARE_CONFIG.LINK_PREFIX}${shareId}`
  };

  // Store share data in local storage
  saveShareData(shareData);

  return shareData;
};

/**
 * Generates a shareable link for a todo item
 * @param {Object} todo - The todo object to share
 * @param {Object} options - Options for the share link
 * @returns {string} A shareable link for the todo
 */
export const generateShareLink = (todo, options = {}) => {
  if (!todo || !todo.id) {
    throw new Error("Invalid todo object provided");
  }
  
  const shareData = createShareLink(todo.id, options);
  return shareData.link;
};

/**
 * Validates a share link and returns the associated todo list if valid
 * @param {string} shareId - The share identifier from the link
 * @returns {Object|null} Share data if valid, null if invalid or expired
 */
export const validateShareLink = (shareId) => {
  const shareData = loadShareData(shareId);

  if (!shareData) {
    return null;
  }

  // Check if link has expired
  if (new Date(shareData.expiresAt) < new Date()) {
    removeShareData(shareId);
    return null;
  }

  return shareData;
};

/**
 * Updates permissions for a shared todo list
 * @param {string} shareId - The share identifier
 * @param {string} permission - New permission level
 * @returns {boolean} True if update successful
 */
export const updateSharePermissions = (shareId, permission) => {
  const shareData = loadShareData(shareId);

  if (!shareData) {
    return false;
  }

  shareData.permission = permission;
  saveShareData(shareData);
  return true;
};

/**
 * Revokes access to a shared todo list
 * @param {string} shareId - The share identifier
 * @returns {boolean} True if revocation successful
 */
export const revokeAccess = (shareId) => {
  return removeShareData(shareId);
};

/**
 * Extends the expiry date of a share link
 * @param {string} shareId - The share identifier
 * @param {number} additionalDays - Number of days to extend
 * @returns {Object|null} Updated share data if successful
 */
export const extendShareExpiry = (shareId, additionalDays) => {
  const shareData = loadShareData(shareId);

  if (!shareData) {
    return null;
  }

  const newExpiryDate = new Date(shareData.expiresAt);
  newExpiryDate.setDate(newExpiryDate.getDate() + additionalDays);
  
  shareData.expiresAt = newExpiryDate.toISOString();
  saveShareData(shareData);

  return shareData;
};

/**
 * Checks if a user has specific permissions for a shared todo list
 * @param {string} shareId - The share identifier
 * @param {string} requiredPermission - Required permission level
 * @returns {boolean} True if user has required permission
 */
export const hasPermission = (shareId, requiredPermission) => {
  const shareData = loadShareData(shareId);

  if (!shareData) {
    return false;
  }

  if (requiredPermission === SHARE_CONFIG.PERMISSIONS.VIEW) {
    return true; // Both view and edit permissions can view
  }

  return shareData.permission === SHARE_CONFIG.PERMISSIONS.EDIT;
};

/**
 * Gets all active shares for a specific todo list
 * @param {string} todoId - The todo list ID
 * @returns {Array} Array of active share data objects
 */
export const getActiveShares = (todoId) => {
  const allShares = getAllShareData();
  const now = new Date();

  return allShares.filter(share => 
    share.todoId === todoId && 
    new Date(share.expiresAt) > now
  );
};

// Local Storage Helpers

const STORAGE_KEY = "todoShare_shares";

/**
 * Saves share data to local storage
 * @param {Object} shareData - The share data to save
 */
const saveShareData = (shareData) => {
  try {
    const shares = getAllShareData();
    const existingIndex = shares.findIndex(share => share.id === shareData.id);

    if (existingIndex >= 0) {
      shares[existingIndex] = shareData;
    } else {
      shares.push(shareData);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(shares));
  } catch (error) {
    console.error("Error saving share data:", error);
  }
};

/**
 * Loads share data from local storage
 * @param {string} shareId - The share identifier
 * @returns {Object|null} Share data if found
 */
const loadShareData = (shareId) => {
  try {
    const shares = getAllShareData();
    return shares.find(share => share.id === shareId) || null;
  } catch (error) {
    console.error("Error loading share data:", error);
    return null;
  }
};

/**
 * Removes share data from local storage
 * @param {string} shareId - The share identifier
 * @returns {boolean} True if removal successful
 */
const removeShareData = (shareId) => {
  try {
    const shares = getAllShareData();
    const filteredShares = shares.filter(share => share.id !== shareId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredShares));
    return true;
  } catch (error) {
    console.error("Error removing share data:", error);
    return false;
  }
};

/**
 * Gets all share data from local storage
 * @returns {Array} Array of all share data objects
 */
const getAllShareData = () => {
  try {
    const sharesJson = localStorage.getItem(STORAGE_KEY);
    return sharesJson ? JSON.parse(sharesJson) : [];
  } catch (error) {
    console.error("Error getting all share data:", error);
    return [];
  }
};

/**
 * Cleans up expired share data
 */
export const cleanupExpiredShares = () => {
  try {
    const shares = getAllShareData();
    const now = new Date();
    const validShares = shares.filter(share => 
      new Date(share.expiresAt) > now
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validShares));
  } catch (error) {
    console.error("Error cleaning up expired shares:", error);
  }
};

// Export constants for use in other modules
export const ShareConfig = SHARE_CONFIG;