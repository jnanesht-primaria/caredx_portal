import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.name}.</p>
      <button onClick={logout}>Log out</button>
    </div>
  );
}
