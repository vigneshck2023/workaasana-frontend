import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import "./App.css";

export default function Dashboard() {
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("All");
  const [taskFilter, setTaskFilter] = useState("All");

  // Modal states
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);

  // Form states
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

  // Data states
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);

  const API_BASE = "https://workaasana.vercel.app";

  // Fetch data from backend
  useEffect(() => {
    fetchData();
  }, []);

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
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  // Handle search input
  const handleSearch = (e) => setSearchQuery(e.target.value.toLowerCase());

  // Status badge style
  const getStatusBadgeClass = (status) => {
    if (!status) return "badge in-progress";
    return status.toLowerCase() === "completed"
      ? "badge completed"
      : "badge in-progress";
  };

  // Filtered projects based on search and filter dropdown
  const filteredProjects = projects.filter((p) => {
    const matchesFilter =
      projectFilter === "All" ||
      (p.status && p.status.toLowerCase() === projectFilter.toLowerCase());
    const matchesSearch =
      p.name?.toLowerCase().includes(searchQuery) ||
      p.description?.toLowerCase().includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  // Filtered tasks based on search and filter dropdown
  const filteredTasks = tasks.filter((t) => {
    const matchesFilter =
      taskFilter === "All" ||
      (t.status && t.status.toLowerCase() === taskFilter.toLowerCase());
    const matchesSearch = t.name?.toLowerCase().includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  // Create new task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.name.trim()) return alert("Task Name is required!");
    if (!newTask.project) return alert("Select a project!");
    if (!newTask.team) return alert("Select a team!");

    const taskPayload = {
      name: newTask.name,
      project: newTask.project,
      team: newTask.team,
      owners: [],
      tags: [],
      timeToComplete: Number(newTask.timeToComplete),
      status: newTask.status,
    };

    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskPayload),
      });

      if (!res.ok) throw new Error("Failed to create task");

      alert("Task created successfully!");
      setShowTaskModal(false);
      setNewTask({
        name: "",
        project: "",
        team: "",
        timeToComplete: "",
        status: "To Do",
      });
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Create new project
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.name.trim()) return alert("Project Name is required!");

    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });

      if (!res.ok) throw new Error("Failed to create project");

      alert("Project created successfully!");
      setShowProjectModal(false);
      setNewProject({ name: "", description: "" });
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="dashboard-page">
      {/* Topbar */}
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

      {/* Task Modal */}
      {showTaskModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title">Create New Task</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowTaskModal(false)}
                ></button>
              </div>

              <form onSubmit={handleCreateTask}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label>Select Project</label>
                    <select
                      className="form-control"
                      value={newTask.project}
                      onChange={(e) =>
                        setNewTask({ ...newTask, project: e.target.value })
                      }
                    >
                      <option value="">Select Project</option>
                      {projects.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label>Task Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Task Name"
                      value={newTask.name}
                      onChange={(e) =>
                        setNewTask({ ...newTask, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label>Select Team</label>
                    <select
                      className="form-control"
                      value={newTask.team}
                      onChange={(e) =>
                        setNewTask({ ...newTask, team: e.target.value })
                      }
                    >
                      <option value="">Select Team</option>
                      {teams.map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label>Time to Complete (hrs)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newTask.timeToComplete}
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
                          timeToComplete: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label>Status</label>
                    <select
                      className="form-control"
                      value={newTask.status}
                      onChange={(e) =>
                        setNewTask({ ...newTask, status: e.target.value })
                      }
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowTaskModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Project Modal */}
      {showProjectModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title">Create New Project</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowProjectModal(false)}
                ></button>
              </div>

              <form onSubmit={handleCreateProject}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label>Project Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Project Name"
                      value={newProject.name}
                      onChange={(e) =>
                        setNewProject({ ...newProject, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label>Project Description</label>
                    <textarea
                      className="form-control"
                      placeholder="Enter Project Description"
                      value={newProject.description}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          description: e.target.value,
                        })
                      }
                      rows="3"
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowProjectModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
