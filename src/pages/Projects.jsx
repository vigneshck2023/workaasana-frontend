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

  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem("teams");
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(true);

  // Fetch Data and Store in LocalStorage
  useEffect(() => {
    if (projects.length && tasks.length && teams.length) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [projRes, taskRes, teamRes] = await Promise.all([
          fetch(`${API_BASE}/projects`),
          fetch(`${API_BASE}/tasks`),
          fetch(`${API_BASE}/teams`),
        ]);

        const projData = await projRes.json();
        const taskData = await taskRes.json();
        const teamData = await teamRes.json();

        setProjects(projData);
        setTasks(taskData);
        setTeams(teamData);

        // 🔹 Save to localStorage
        localStorage.setItem("projects", JSON.stringify(projData));
        localStorage.setItem("tasks", JSON.stringify(taskData));
        localStorage.setItem("teams", JSON.stringify(teamData));
      } catch (error) {
        console.error("API error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔹 Update Status in Backend + LocalStorage
  const handleStatusChange = async (id, newStatus) => {
    setProjects((prev) => {
      const updated = prev.map((p) =>
        p.id === id ? { ...p, status: newStatus } : p
      );

      localStorage.setItem("projects", JSON.stringify(updated)); // save locally
      return updated;
    });

    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        alert("Failed to update in backend");
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
        <button className="new-project-btn">+ New Project</button>
      </div>

      <table className="project-table">
        <thead>
          <tr>
            <th>PROJECT</th>
            <th>OWNERS</th>
            <th>TASKS</th>
            <th>STATUS</th>
            <th>DUE DATE</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((p) => {
            const owners = teams.filter((t) => t.projectId === p.id);
            const projectTasks = tasks.filter((t) => t.projectId === p.id);

            return (
              <tr key={p.id}>
                <td>{p.name}</td>

                <td>
                  <div className="owner-cell">
                    {owners.slice(0, 2).map((o, i) => (
                      <span key={i} className="owner-badge">
                        {o.name.slice(0, 2).toUpperCase()}
                      </span>
                    ))}
                    {owners.length > 2 && (
                      <span className="owner-more">+{owners.length - 2}</span>
                    )}
                  </div>
                </td>

                <td>{projectTasks.length}</td>

                <td>
                  <select
                    value={p.status || "Pending"}
                    className="status-select"
                    onChange={(e) => handleStatusChange(p.id, e.target.value)}
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </td>

                <td>
                  {p.deadline
                    ? new Date(p.deadline).toDateString()
                    : "No Deadline"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
