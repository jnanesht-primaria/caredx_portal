import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div style={{ padding: "3rem", textAlign: "center", fontFamily: "sans-serif" }}>
      <h1>Access denied</h1>
      <p>Your account role doesn't have access to this page.</p>
      <Link to="/login">Back to sign in</Link>
    </div>
  );
}
