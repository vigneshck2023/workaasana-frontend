import React, { useEffect, useState } from "react";

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

  const refreshTasks = async () => {
    const res = await fetch(`${API_BASE}/tasks`);
    const data = await res.json();
    setTasks(data);
    localStorage.setItem("tasks", JSON.stringify(data));
  };

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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>

      <table className="w-full border-separate border-spacing-y-3">
        <thead>
          <tr className="text-gray-600 text-sm font-semibold">
            <th className="text-left px-2">PROJECT</th>
            <th className="text-center px-2">TASKS</th>
            <th className="text-center px-2">STATUS</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((project) => {
            const taskCount = tasks.filter(
              (task) => task?.project?._id === project._id
            ).length;

            return (
              <tr
                key={project._id}
                className="bg-white shadow-sm rounded-lg"
              >
                <td className="px-4 py-4 rounded-l-lg text-[15px]">
                  {project.name}
                </td>

                <td className="px-4 py-4 text-center text-[15px]">
                  {taskCount}
                </td>

                <td className="px-4 py-4 text-center rounded-r-lg">
                  <select
                    value={project.status}
                    onChange={(e) =>
                      handleStatusChange(project._id, e.target.value)
                    }
                    className="px-3 py-2 border rounded-md bg-white text-[14px]"
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
