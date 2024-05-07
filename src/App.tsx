import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import TodoApp from "./components/TodoApp";
import { User } from "./components/types";
import axios from "axios";

const App: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [showSignup, setShowSignup] = useState<boolean>(false);

  const handleSignup = async (user: User) => {
    try {
      await axios.post("https://jelan.pythonanywhere.com/api/user/signup", user);
      alert("User signed up successfully!");
      setShowSignup(false); // Hide the signup form after signup
    } catch (error) {
      console.error("Error signing up:", error);
      alert("An error occurred while signing up.");
    }
  };

  const handleLoginSuccess = async (credentials: User) => {
    try {
      const response = await axios.post<User>("https://jelan.pythonanywhere.com/api/user/login", credentials);
      setLoggedInUser(response.data);
      alert("Login successful!");
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Invalid username or password!");
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  const toggleSignup = () => {
    setShowSignup(!showSignup); // Toggle the display of signup form
  };

  return (
    <div>
      {!loggedInUser && !showSignup ? (
        <LoginForm handleLoginSuccess={handleLoginSuccess} toggleSignup={toggleSignup} />
      ) : null}
      {!loggedInUser && showSignup ? (
        <SignupForm handleSignup={handleSignup} />
      ) : null}
      {loggedInUser && (
        <header>
          <div className="header-content">
            <h1>
              <FaUserCircle /> Welcome, {loggedInUser.username}!
            </h1>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </header>
      )}
      {loggedInUser && <TodoApp />}
    </div>
  );
};

export default App;
