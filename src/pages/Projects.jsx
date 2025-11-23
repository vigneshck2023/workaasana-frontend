// Project.jsx
import React, { useEffect, useState } from "react";
import "./Project.css";

const API_BASE = "https://workaasana.vercel.app";

export default function Project() {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("projects");
    return saved ? JSON.parse(saved) : [];
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(true);

  // FETCH DATA
  useEffect(() => {
    if (projects.length && tasks.length) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [projRes, taskRes] = await Promise.all([
          fetch(`${API_BASE}/projects`),
          fetch(`${API_BASE}/tasks`),
        ]);

        const projData = await projRes.json();
        const taskData = await taskRes.json();

        setProjects(projData);
        setTasks(taskData);

        localStorage.setItem("projects", JSON.stringify(projData));
        localStorage.setItem("tasks", JSON.stringify(taskData));
      } catch (error) {
        console.error("API error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // UPDATE STATUS + LOCALSTORAGE + TRIGGER DASHBOARD REFRESH
  const handleStatusChange = async (id, newStatus) => {
    setProjects((prev) => {
      const updated = prev.map((p) =>
        p._id === id ? { ...p, status: newStatus } : p
      );

      localStorage.setItem("projects", JSON.stringify(updated));
      localStorage.setItem("dataUpdated", Date.now()); // 🔁 triggers Dashboard
      return updated;
    });

    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        alert("Failed to update backend");
      }
    } catch (err) {
      alert("Backend error — saved locally only");
    }
  };

  if (loading) return <h3>Loading...</h3>;

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>Projects</h2>
      </div>

      <table className="project-table">
        <thead>
          <tr>
            <th>PROJECT</th>
            <th>TASKS</th>
            <th>STATUS</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((p) => {
            const projectTasks = tasks.filter((t) => t.projectId === p._id);

            return (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{projectTasks.length}</td>
                <td>
                  <select
                    value={p.status || "In Progress"}
                    className="status-select"
                    onChange={(e) => handleStatusChange(p._id, e.target.value)}
                  >
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
