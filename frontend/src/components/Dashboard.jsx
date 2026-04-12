import React, { useEffect, useState } from "react";
import API from "../api";
import "../styles/main.css";

function Dashboard({ user }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.log("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create a new task
  const createTask = async () => {
    if (!title || !description) {
      alert("Please fill all fields");
      return;
    }

    try {
      await API.post("/tasks", {
        title,
        description,
        status: "pending",
      });

      setTitle("");
      setDescription("");

      fetchTasks();
    } catch (err) {
      console.log("Error creating task:", err);
    }
  };

  // Mark task as done
  const updateTask = async (id) => {
    try {
      await API.put(`/tasks/${id}`, {
        status: "done",
      });

      fetchTasks();
    } catch (err) {
      console.log("Error updating task:", err);
    }
  };

  // Delete task (admin only)
  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.log("Error deleting task:", err);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="container">
      <h2>Task Tracker Dashboard</h2>

      <p>
        Logged in as: <strong>{user.email}</strong> ({user.role})
      </p>

      <button onClick={handleLogout}>Logout</button>

      <hr />

      {/* Create Task Section */}
      <h3>Create Task</h3>

      <input
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={createTask}>Add Task</button>

      <hr />

      {/* Task List */}
      <h3>Tasks</h3>

      {tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="task">
            <strong>{task.title}</strong> <br />
            {task.description} <br />
            Status: <b>{task.status}</b>
            <br />

            {/* Update button */}
            {task.status !== "done" && (
              <button onClick={() => updateTask(task.id)}>
                Mark as Done
              </button>
            )}

            {/* Delete button (Admin only) */}
            {user.role === "admin" && (
              <button onClick={() => deleteTask(task.id)}>
                Delete
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;