import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const Reports = () => {
  // Sample Data
  const projectData = [
    { name: "Completed", value: 2 },
    { name: "In Progress", value: 0 },
  ];

  const taskData = [
    { name: "In Progress", value: 1 },
    { name: "To Do", value: 1 },
    { name: "Blocked", value: 0 },
  ];

  const timeTaken = [
    { name: "Task A", hours: 36 },
  ];

  // Pie Chart Colors
  const COLORS = ["#00C49F", "#ff6384"];

  const fontStyle = {
    fontFamily: "Inter, sans-serif",
    fontWeight: 550,
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1
        style={{
          ...fontStyle,
          fontSize: "24px",
          marginBottom: "25px",
        }}
      >
        Reports & Analytics
      </h1>

      {/* Row 1 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "25px",
          marginBottom: "30px",
        }}
      >
        {/* Project Status Distribution */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "25px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ ...fontStyle, fontSize: "20px", textAlign: "center" }}>
            Project Status Distribution
          </h2>

          <PieChart width={400} height={300}>
            <Pie
              data={projectData}
              cx="50%"
              cy="50%"
              outerRadius={110}
              fill="#8884d8"
              dataKey="value"
              label={{
                style: fontStyle,
              }}
            >
              {projectData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </div>

        {/* Task Status Breakdown */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "25px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ ...fontStyle, fontSize: "20px", textAlign: "center" }}>
            Task Status Breakdown
          </h2>

          <BarChart width={450} height={300} data={taskData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              style={fontStyle}
            />
            <YAxis
              style={fontStyle}
            />
            <Tooltip
              contentStyle={{
                ...fontStyle,
                fontWeight: 500,
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="value" fill="#4F46E5" />
          </BarChart>
        </div>
      </div>

      {/* Row 2 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "25px",
        }}
      >
        {/* Time taken per task */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "25px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ ...fontStyle, fontSize: "20px", textAlign: "center" }}>
            Time Taken Per Task (hrs)
          </h2>

          <BarChart width={500} height={300} data={timeTaken}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" style={fontStyle} />
            <YAxis style={fontStyle} />
            <Tooltip
              contentStyle={{
                ...fontStyle,
                borderRadius: "10px",
              }}
            />
            <Bar dataKey="hours" fill="#10B981" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default Reports;
