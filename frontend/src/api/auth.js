// frontend/src/api/auth.js

// Use consistent key names
const TOKEN_KEY = "caredx_token";
const ROLE_KEY = "caredx_role";
const NAME_KEY = "caredx_name";
const USER_KEY = "caredx_user";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRole() {
  return localStorage.getItem(ROLE_KEY);
}

export function getName() {
  return localStorage.getItem(NAME_KEY);
}

export function getUser() {
  const userStr = localStorage.getItem(USER_KEY);
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return Boolean(getToken());
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(NAME_KEY);
  localStorage.removeItem(USER_KEY);
  // Also remove any legacy keys
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// Attach this to any authenticated fetch call
export function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Export constants for use in other files
export { TOKEN_KEY, ROLE_KEY, NAME_KEY, USER_KEY };