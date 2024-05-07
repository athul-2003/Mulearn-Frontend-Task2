import React, { useState } from "react";
import { User } from "./types";
import axios from 'axios';
import "../forms.css";

// Define the base URL separately
const BASE_URL = "https://jelan.pythonanywhere.com";

interface SignupFormProps {
  handleSignup: (user: User) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ handleSignup }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);

      const response = await axios.post(`${BASE_URL}/api/user/signup`, formData);
      console.log(response.data);
      handleSignup({ username, password, firstName,lastName }); // Call the handleSignupSuccess function upon successful signup
    } catch (error) {
      // Handle signup error (e.g., display error message)
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="box">
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <h2>👤➕ Sign Up</h2>
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
            <div>
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <button type="submit">Sign Up</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
