import React from "react";
import {
  FaBars,
  FaHome,
  FaProjectDiagram,
  FaUsers,
  FaChartBar,
  FaCog,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${!isOpen ? "collapsed" : ""}`}>
      {/* Top Section */}
      <div className="top-section">
        <span className="logo">{isOpen && "workaasana"}</span>
        <span className="toggle-icon" onClick={toggleSidebar}>
          <FaBars />
        </span>
      </div>

      {/* Menu Items */}
      <div className="menu">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
          data-tooltip="Dashboard"
        >
          <FaHome className="icon" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
        to="/projects"
          className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
          data-tooltip="Projects"
        >
          <FaProjectDiagram className="icon" />
          <span>Projects</span>
        </NavLink>

        <NavLink
          to="/teams"
          className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
          data-tooltip="Team"
        >
          <FaUsers className="icon" />
          <span>Team</span>
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
          data-tooltip="Reports"
        >
          <FaChartBar className="icon" />
          <span>Reports</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
          data-tooltip="Settings"
        >
          <FaCog className="icon" />
          <span>Settings</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
