import React, { useEffect, useState } from "react";
import API from "../api";
import "../styles/main.css";

function Dashboard({ user }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async () => {
    await API.post("/tasks", {
      title,
      description,
      status: "pending",
    });
    fetchTasks();
  };

  const updateTask = async (id) => {
    await API.put(`/tasks/${id}`, { status: "done" });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  return (
    <div className="container">
      <h2>Dashboard</h2>

      <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
      <button onClick={createTask}>Add Task</button>

      {tasks.map((task) => (
        <div key={task.id} className="task">
          {task.title} - {task.status}

          <button onClick={() => updateTask(task.id)}>Done</button>

          {user.role === "admin" && (
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Dashboard;