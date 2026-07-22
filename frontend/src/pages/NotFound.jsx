import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ padding: "3rem", textAlign: "center", fontFamily: "sans-serif" }}>
      <h1>404</h1>
      <p>That page doesn't exist.</p>
      <Link to="/login">Back to sign in</Link>
    </div>
  );
}
