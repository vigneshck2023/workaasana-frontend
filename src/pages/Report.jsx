import React, { useEffect, useState } from "react";
import "./App.css";

// ---- Chart.js Import (added as requested) ----
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  Tooltip as ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register chart.js components
ChartJS.register(ArcElement, BarElement, ChartTooltip, Legend, CategoryScale, LinearScale);

// ---- Recharts Components ----
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function Report() {
  const API_BASE = "https://workaasana.vercel.app";

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Fetch Data
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const projRes = await fetch(`${API_BASE}/projects`);
      const taskRes = await fetch(`${API_BASE}/tasks`);

      const projData = await projRes.json();
      const taskData = await taskRes.json();

      setProjects(projData);
      setTasks(taskData);
    } catch (err) {
      console.error("Error fetching report data:", err);
    }
  };

  // -------- Report Data Processing --------

  const projectStatus = [
    {
      name: "Completed",
      value: projects.filter((p) => p.status === "Completed").length,
    },
    {
      name: "In Progress",
      value: projects.filter((p) => p.status === "In Progress").length,
    },
  ];

  const taskStatus = [
    { name: "Completed", value: tasks.filter((t) => t.status === "Completed").length },
    { name: "In Progress", value: tasks.filter((t) => t.status === "In Progress").length },
    { name: "To Do", value: tasks.filter((t) => t.status === "To Do").length },
    { name: "Blocked", value: tasks.filter((t) => t.status === "Blocked").length },
  ];

  const taskTime = tasks.map((t) => ({
    name: t.name,
    value: t.timeToComplete || 0,
  }));

  const COLORS = ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e", "#e74a3b"];

  return (
    <div className="dashboard-page">

      {/* Header */}
      <div className="section-header">
        <h3>Reports & Analytics</h3>
      </div>

      <div className="chart-container">

        {/* Project Status Pie Chart */}
        <div className="chart-card">
          <h4>Project Status Distribution</h4>

          <PieChart width={350} height={300}>
            <Pie
              dataKey="value"
              data={projectStatus}
              cx={150}
              cy={140}
              outerRadius={100}
              label
            >
              {projectStatus.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Task Status Bar Chart */}
        <div className="chart-card">
          <h4>Task Status Breakdown</h4>

          <BarChart width={400} height={300} data={taskStatus}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#4e73df" />
          </BarChart>
        </div>

        {/* Task Time Bar Chart */}
        <div className="chart-card">
          <h4>Time Taken Per Task (hrs)</h4>

          <BarChart width={400} height={300} data={taskTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              interval={0}
              angle={-15}
              textAnchor="end"
              height={80}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#1cc88a" />
          </BarChart>
        </div>

      </div>
    </div>
  );
}
