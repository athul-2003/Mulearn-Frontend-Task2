import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCheck, FaTimes, FaPencilAlt } from "react-icons/fa";
import "../App.css";

const BASE_URL = "https://jelan.pythonanywhere.com";



type Todo = {
  id: number;
  task: string;
  isCompleted: boolean;
};

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState<string>("");
  const [editId, setEditId] = useState<number | null>(null); // Track the ID of the todo being edited
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]); // Track filtered todos

  useEffect(() => {
    // Fetch todos from the server when the component mounts
    fetchTodos();
  }, []);

  useEffect(() => {
    // Update filtered todos whenever todos change
    setFilteredTodos(todos);
  }, [todos]);

  const fetchTodos = async () => {
    try {
      const response = await axios.get<Todo[]>(
        "https://jelan.pythonanywhere.com/api/todo?flag=completed",
        {
          headers: {
            Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ0eXBlIjoiYWNjZXNzIiwiaXNzdWVkX2F0IjoiMjAyNC0wNS0wNCAyMzoyNzo1OCIsImV4cCI6MTcxNDg1MjY3OC4wfQ.ZnsGjPA46i_aFH8rdyTjtIzRPz8Cba0SxLET8T6v1Rs",
            "Content-Type": "application/json", // Assuming JSON payload
          },
        }
      
      
      );
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTask(event.target.value);
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    try {
      const formData = new FormData();
      formData.append("title", task);
      formData.append("expiry", "2024-06-03T14:25:00.123456");
  
      const response = await axios.post<Todo>(`${BASE_URL}/api/todo/`, formData, {
        headers: {
          Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ0eXBlIjoiYWNjZXNzIiwiaXNzdWVkX2F0IjoiMjAyNC0wNS0wNCAyMzoyNzo1OCIsImV4cCI6MTcxNDg1MjY3OC4wfQ.ZnsGjPA46i_aFH8rdyTjtIzRPz8Cba0SxLET8T6v1Rs",
          
        }
      });
  
      setTodos([response.data, ...todos]);
      setTask("");
    } catch (error) {
      console.error("Error submitting todo:", error);
      alert("Failed to create todo. Please try again.");
    }
  };
  
  
  

  const handleChangeChecked = async (todo: Todo) => {
    try {
      // update the todo
      const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };
      await axios.put(`https://jelan.pythonanywhere.com/api/todo/${todo.id}`, updatedTodo);
      const updatedTodos = todos.map((t) =>
        t.id === todo.id ? updatedTodo : t
      );
      // update the state
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      // delete the todo
      await axios.delete(`https://jelan.pythonanywhere.com/api/todo/1${id}`);
      // filter out the todo to be deleted
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      // update the state
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleClearCompleted = async () => {
    try {
      // filter out completed todos
      const completedTodos = todos.filter((todo) => todo.isCompleted);
      await Promise.all(
        completedTodos.map(async (todo) => {
          await axios.delete(`https://jelan.pythonanywhere.com/api/todo/1${todo.id}`);
        })
      );
      // fetch updated todos
      fetchTodos();
    } catch (error) {
      console.error("Error clearing completed todos:", error);
    }
  };

  const handleFilter = (filterType: string) => {
    switch (filterType) {
      case "all":
        // Show all todos
        setFilteredTodos([...todos]); // Reset to the original list
        break;
      case "active":
        // Show active todos
        const activeTodos = todos.filter((todo) => !todo.isCompleted);
        setFilteredTodos(activeTodos); // Set filtered todos
        break;
      case "completed":
        // Show completed todos
        const completedTodos = todos.filter((todo) => todo.isCompleted);
        setFilteredTodos(completedTodos); // Set filtered todos
        break;
      default:
        break;
    }
  };

  const handleEdit = (id: number, task: string) => {
    setEditId(id); // Set the todo ID being edited
    setTask(task); // Set the task to edit
  };

  return (
    <div className="content">
      <div className="centered-box">
        <div className="container">
          <h1>📝 TODO - APP</h1>
          <div className="input-box">
            <form onSubmit={handleFormSubmit} className="form">
              <input
                type="text"
                name="task"
                value={task}
                onChange={handleInput}
                placeholder="Enter a new task"
                className="input"
              />
              <button type="submit" className="add-task-btn">
                {editId !== null ? <FaPencilAlt /> : <FaCheck />}
              </button>
            </form>
          </div>
          <div className="todo-list-box">
            <ul className="todo-list">
              {filteredTodos.map((todo) => (
                <li
                  key={todo.id}
                  className={todo.isCompleted ? "completed" : ""}
                >
                  <div className="todo-item">
                    <input
                      type="checkbox"
                      checked={todo.isCompleted}
                      onChange={() => handleChangeChecked(todo)}
                      className="checkbox"
                      id={"checkbox-" + todo.id}
                    />
                    <label
                      htmlFor={"checkbox-" + todo.id}
                      className="tick"
                    ></label>

                    {editId === todo.id ? (
                      // Render input field for editing
                      <input
                        type="text"
                        value={task}
                        onChange={handleInput}
                        className="edit-input"
                      />
                    ) : (
                      // Render task text
                      <span>{todo.task}</span>
                    )}
                    <button
                      onClick={() => handleEdit(todo.id, todo.task)}
                      className="edit-btn"
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="delete-btn"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="options">
              <span>
                {todos.filter((todo) => !todo.isCompleted).length} items left
              </span>
              <div className="filter-options">
                <button
                  onClick={() => handleFilter("all")}
                  className="text-button"
                >
                  <span className="all-btn">All</span>
                </button>
                <button
                  onClick={() => handleFilter("active")}
                  className="text-button"
                >
                  Active
                </button>
                <button
                  onClick={() => handleFilter("completed")}
                  className="text-button"
                >
                  Completed
                </button>
              </div>
              <button
                onClick={handleClearCompleted}
                className="text-button"
              >
                Clear Completed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
