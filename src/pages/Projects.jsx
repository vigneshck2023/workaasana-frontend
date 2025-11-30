import React, { useEffect, useState } from "react";
import "./Project.css";

const API_BASE = "https://workaasana.vercel.app";

export default function ProjectPage() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projRes = await fetch(`${API_BASE}/projects`);
        const projData = await projRes.json();

        const taskRes = await fetch(`${API_BASE}/tasks`);
        const taskData = await taskRes.json();

        setProjects(projData);
        setTasks(taskData);

        localStorage.setItem("projects", JSON.stringify(projData));
        localStorage.setItem("tasks", JSON.stringify(taskData));
      } catch (error) {
        const cachedProjects = localStorage.getItem("projects");
        const cachedTasks = localStorage.getItem("tasks");
        if (cachedProjects) setProjects(JSON.parse(cachedProjects));
        if (cachedTasks) setTasks(JSON.parse(cachedTasks));
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const updated = await res.json();
      setProjects((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: updated.status } : p))
      );

      localStorage.setItem("projects", JSON.stringify(projects));
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <div className="project-container">
      <h1 className="project-title">Projects</h1>

      <table className="project-table">
        <thead>
          <tr>
            <th>PROJECT</th>
            <th>TASKS</th>
            <th>STATUS</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((project) => {
            const taskCount = tasks.filter(
              (task) => task?.project?._id === project._id
            ).length;

            return (
              <tr key={project._id} className="project-row">
                <td>{project.name}</td>
                <td className="task-count">{taskCount}</td>
                <td>
                  <select
                    value={project.status}
                    onChange={(e) =>
                      handleStatusChange(project._id, e.target.value)
                    }
                    className="status-select"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
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
