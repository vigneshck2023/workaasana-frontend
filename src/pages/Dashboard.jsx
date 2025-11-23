// Dashboard.jsx
import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import "./App.css";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("All");
  const [taskFilter, setTaskFilter] = useState("All");

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);

  const [newTask, setNewTask] = useState({
    name: "",
    project: "",
    team: "",
    timeToComplete: "",
    status: "To Do",
  });

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
  });

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);

  const API_BASE = "https://workaasana.vercel.app";

  // Fetch data from backend
  const fetchData = async () => {
    try {
      const [projRes, taskRes, teamRes] = await Promise.all([
        fetch(`${API_BASE}/projects`),
        fetch(`${API_BASE}/tasks`),
        fetch(`${API_BASE}/teams`),
      ]);

      setProjects(await projRes.json());
      setTasks(await taskRes.json());
      setTeams(await teamRes.json());
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  // Load data initially
  useEffect(() => {
    fetchData();
  }, []);

  // Refresh dashboard when project data is updated from another page
  useEffect(() => {
    const listener = (e) => {
      if (e.key === "dataUpdated") {
        fetchData();
      }
    };
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, []);

  const handleSearch = (e) => setSearchQuery(e.target.value.toLowerCase());

  // Status badge class
  const getStatusBadgeClass = (status) => {
    if (!status) return "badge in-progress";
    return status.toLowerCase() === "completed"
      ? "badge completed"
      : "badge in-progress";
  };

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchesFilter =
      projectFilter === "All" ||
      (p.status && p.status.toLowerCase() === projectFilter.toLowerCase());

    const matchesSearch =
      p.name?.toLowerCase().includes(searchQuery) ||
      p.description?.toLowerCase().includes(searchQuery);

    return matchesFilter && matchesSearch;
  });

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesFilter =
      taskFilter === "All" ||
      (t.status && t.status.toLowerCase() === taskFilter.toLowerCase());

    const matchesSearch = t.name?.toLowerCase().includes(searchQuery);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="dashboard-page">

      {/* Search Bar */}
      <div className="topbar">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search projects or tasks..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="dashboard-content">

        {/* Projects Section */}
        <div className="section-header">
          <h3>Projects</h3>
          <div className="controls">
            <button className="new-btn" onClick={() => setShowProjectModal(true)}>
              + New Project
            </button>
            <div className="filter-group">
              <FaFilter className="filter-icon" />
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card-grid">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((proj) => (
              <div key={proj._id} className="card">
                <div className="card-header">
                  <span className={getStatusBadgeClass(proj.status)}>
                    {proj.status || "In Progress"}
                  </span>
                </div>
                <h4>{proj.name}</h4>
                <p>{proj.description || "No description provided"}</p>
              </div>
            ))
          ) : (
            <p>No projects found.</p>
          )}
        </div>

        {/* Tasks Section */}
        <div className="section-header">
          <h3>My Tasks</h3>
          <div className="controls">
            <button className="new-btn" onClick={() => setShowTaskModal(true)}>
              + New Task
            </button>
            <div className="filter-group">
              <FaFilter className="filter-icon" />
              <select
                value={taskFilter}
                onChange={(e) => setTaskFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card-grid">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div key={task._id} className="card">
                <div className="card-header">
                  <span className={getStatusBadgeClass(task.status)}>
                    {task.status || "To Do"}
                  </span>
                </div>
                <h4>{task.name}</h4>
                <p>Time to Complete: {task.timeToComplete} hrs</p>
              </div>
            ))
          ) : (
            <p>No tasks found.</p>
          )}
        </div>

      </div>
    </div>
  );
}
