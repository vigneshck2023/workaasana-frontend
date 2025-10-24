import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import { FaSearch } from "react-icons/fa";
import "./App.css";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("All");
  const [taskFilter, setTaskFilter] = useState("All");

  const useFetch = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(url);
          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
          const result = await response.json();
          setData(result);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [url]);

    return { data, loading, error };
  };

  const {
    data: projects,
    loading: loadingProjects,
    error: errorProjects,
  } = useFetch("https://workaasana.vercel.app/projects");
  const {
    data: tasks,
    loading: loadingTasks,
    error: errorTasks,
  } = useFetch("https://workaasana.vercel.app/tasks");

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const getStatusBadgeClass = (status) => {
    if (!status) return "badge in-progress";
    const normalized = status.toLowerCase();
    if (normalized === "completed") return "badge completed";
    return "badge in-progress";
  };

  // Filtered arrays
  const filteredProjects = projects.filter((proj) => {
    return (
      (projectFilter === "All" || proj.status === projectFilter) &&
      proj.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const filteredTasks = tasks.filter((task) => {
    return (
      (taskFilter === "All" || task.status === taskFilter) &&
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="app-container">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div
        className={`main-content ${isSidebarOpen ? "expanded" : "collapsed"}`}
      >
        {/* Topbar */}
        <div className="topbar">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Projects Section */}
          <div
            className="section-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3>Projects</h3>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button className="new-btn">+ New Project</button>
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                style={{
                  padding: "5px 10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              >
                <option value="All">All</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {loadingProjects ? (
            <p>Loading projects...</p>
          ) : errorProjects ? (
            <p className="error">Error: {errorProjects}</p>
          ) : (
            <div className="card-grid">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((proj) => (
                  <div key={proj._id} className="card">
                    <div className="card-header">
                      <span className={getStatusBadgeClass(proj.status)}>
                        {proj.status || "In Progress"}
                      </span>
                    </div>
                    <h4>{proj.name || "Untitled Project"}</h4>
                    <p>{proj.description || "No description provided"}</p>
                  </div>
                ))
              ) : (
                <p>No projects available.</p>
              )}
            </div>
          )}

          {/* Tasks Section */}
          <div
            className="section-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3>My Tasks</h3>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button className="new-btn">+ New Task</button>
              <select
                value={taskFilter}
                onChange={(e) => setTaskFilter(e.target.value)}
                style={{
                  padding: "5px 10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              >
                <option value="All">All</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {loadingTasks ? (
            <p>Loading tasks...</p>
          ) : errorTasks ? (
            <p className="error">Error: {errorTasks}</p>
          ) : (
            <div className="card-grid">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div key={task._id} className="card">
                    <div className="card-header">
                      <span className={getStatusBadgeClass(task.status)}>
                        {task.status || "In Progress"}
                      </span>
                    </div>
                    <h4>{task.title || "Untitled Task"}</h4>
                    <p>Due: {task.dueDate || "N/A"}</p>
                  </div>
                ))
              ) : (
                <p>No tasks available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}