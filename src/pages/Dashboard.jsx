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
    status: "In Progress",
  });

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
  });

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);

  const API_BASE = "https://workaasana.vercel.app";

  // Load Data
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

      setProjects(await projRes.json());
      setTasks(await taskRes.json());
      setTeams(await teamRes.json());
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  // Search
  const handleSearch = (e) => setSearchQuery(e.target.value.toLowerCase());

  // Status badge style
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

  // CREATE PROJECT
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

  // CREATE TASK
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
        status: "In Progress",
      });
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="dashboard-page">
      {/* SEARCH BAR */}
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
        {/* PROJECT SECTION */}
        <div className="section-header">
          <h3>Projects</h3>
          <div className="controls">
            <button
              className="new-btn"
              onClick={() => setShowProjectModal(true)}
            >
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

        {/* TASK SECTION */}
        <div className="section-header">
          <h3>My Tasks</h3>
          <div className="controls">
            <button
              className="new-btn"
              onClick={() => setShowTaskModal(true)}
            >
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
                    {task.status || "In Progress"}
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

      {/* TASK MODAL */}
      {showTaskModal && (
        <TaskModal
          newTask={newTask}
          setNewTask={setNewTask}
          setShowTaskModal={setShowTaskModal}
          handleCreateTask={handleCreateTask}
          projects={projects}
          teams={teams}
        />
      )}

      {/* PROJECT MODAL */}
      {showProjectModal && (
        <ProjectModal
          newProject={newProject}
          setNewProject={setNewProject}
          setShowProjectModal={setShowProjectModal}
          handleCreateProject={handleCreateProject}
        />
      )}
    </div>
  );
}

/* ---- TASK MODAL ---- */
const TaskModal = ({
  newTask,
  setNewTask,
  setShowTaskModal,
  handleCreateTask,
  projects,
  teams,
}) => (
  <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content p-3">
        <div className="modal-header">
          <h5 className="modal-title">Create New Task</h5>
          <button type="button" className="btn-close" onClick={() => setShowTaskModal(false)}></button>
        </div>

        <form onSubmit={handleCreateTask}>
          <div className="modal-body">
            <label>Select Project</label>
            <select
              className="form-control"
              value={newTask.project}
              onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>

            <label>Task Name</label>
            <input
              type="text"
              className="form-control"
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setShowTaskModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create</button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

/* ---- PROJECT MODAL ---- */
const ProjectModal = ({
  newProject,
  setNewProject,
  setShowProjectModal,
  handleCreateProject,
}) => (
  <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content p-3">
        <div className="modal-header">
          <h5 className="modal-title">Create New Project</h5>
          <button type="button" className="btn-close" onClick={() => setShowProjectModal(false)}></button>
        </div>

        <form onSubmit={handleCreateProject}>
          <div className="modal-body">
            <label>Project Name</label>
            <input
              type="text"
              className="form-control"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            />
            <label>Project Description</label>
            <textarea
              className="form-control"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              rows="3"
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setShowProjectModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create</button>
          </div>
        </form>
      </div>
    </div>
  </div>
);
