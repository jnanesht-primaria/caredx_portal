// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session on app load
    const token = localStorage.getItem("caredx_token");
    const storedUser = localStorage.getItem("caredx_user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    if (!data || !data.token || !data.user) {
      console.error("Invalid login data payload received:", data);
      return;
    }

    // Save token and stringified user object
    localStorage.setItem("caredx_token", data.token);
    localStorage.setItem("caredx_user", JSON.stringify(data.user));
    
    // Also store individual items if needed elsewhere in your app
    localStorage.setItem("caredx_role", data.user.role);
    localStorage.setItem("caredx_name", data.user.name);

    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("caredx_token");
    localStorage.removeItem("caredx_user");
    localStorage.removeItem("caredx_role");
    localStorage.removeItem("caredx_name");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}