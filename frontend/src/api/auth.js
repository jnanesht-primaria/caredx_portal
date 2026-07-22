// frontend/src/api/auth.js

export function getToken() {
  return localStorage.getItem("caredx_token");
}

export function getRole() {
  return localStorage.getItem("caredx_role");
}

export function getName() {
  return localStorage.getItem("caredx_name");
}

export function isLoggedIn() {
  return Boolean(getToken());
}

export function logout() {
  localStorage.removeItem("caredx_token");
  localStorage.removeItem("caredx_role");
  localStorage.removeItem("caredx_name");
}

// Attach this to any authenticated fetch call
export function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}