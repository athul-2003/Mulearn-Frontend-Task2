import React, { useState } from "react";
import axios from 'axios';
import { User } from "./types";
import "../forms.css";

// interface LoginFormProps {
//   handleLoginSuccess: () => void;
//   toggleSignup: () => void;
// }

interface LoginFormProps {
  handleLoginSuccess: (user: User) => void; // Modify the interface to accept user data
  toggleSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ handleLoginSuccess, toggleSignup }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axios.post('https://jelan.pythonanywhere.com/api/user/login', formData);
      console.log(response.data);
      handleLoginSuccess({ username, password });

    } catch (error) {
      // Handle login error (e.g., display error message)
      console.error('Login error:', error);
    }
  };

  return (
    <div className="box">
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <h2>🔑 User Login</h2>
          <div className="inner-box">
            <div>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit">Login</button>
            <span style={{ marginLeft: "10px" }}>
              Don't have an account?{" "}
              <button type="button" onClick={toggleSignup}>
                Sign Up
              </button>
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
