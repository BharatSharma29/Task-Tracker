import React, { useState } from "react";
import API from "../api";
import "../styles/main.css";

function Register({ goToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", {
        email,
        password,
        role,
      });

      alert("Registered successfully!");
      goToLogin();

    } catch {
      alert("Error registering");
    }
  };

  return (
    <div className="container">
      <h2>Sign-Up</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Role selection */}
      <select onChange={(e) => setRole(e.target.value)}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <button onClick={handleRegister}>Register</button>

      <p>
        Already have an account?{" "}
        <button onClick={goToLogin}>Login</button>
      </p>
    </div>
  );
}

export default Register;