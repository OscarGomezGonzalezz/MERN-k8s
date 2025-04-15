import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser} from "../services/authService";
import { Link } from "react-router-dom";


function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for holding error message
  const navigate = useNavigate();

  useEffect(() => {
      localStorage.removeItem("token");
    }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (username && password) {
      try{
        const data = await loginUser(username, password);
        localStorage.setItem("token", data.token);
        navigate("/tasks");
      } 
      catch (error) {
        console.error("Error logging in", error);
        setError("Invalid username or password.");
      }
    } else {
      setError("Please fill in both fields."); 
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} noValidate>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {/* Show error message if it exists */}
      {error && <div className="error-message">{error}</div>}
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default LoginPage;
