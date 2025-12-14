import React from "react";
import {
  FaBars,
  FaHome,
  FaProjectDiagram,
  FaUsers,
  FaChartBar,
  FaCog,
  FaUserCircle,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ isOpen, setIsOpen, userName }) => {
  return (
    <div className={`sidebar ${!isOpen ? "collapsed" : ""} ${isOpen ? "open" : ""}`}>
      <div className="top-section">
        <span className="logo">{isOpen && "workaasana"}</span>
        <span className="toggle-icon" onClick={() => setIsOpen(!isOpen)}>
          <FaBars />
        </span>
      </div>

      <div className="menu">
        <NavLink to="/dashboard" className="menu-item">
          <FaHome className="icon" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/projects" className="menu-item">
          <FaProjectDiagram className="icon" />
          <span>Projects</span>
        </NavLink>

        <NavLink to="/teams" className="menu-item">
          <FaUsers className="icon" />
          <span>Team</span>
        </NavLink>

        <NavLink to="/reports" className="menu-item">
          <FaChartBar className="icon" />
          <span>Reports</span>
        </NavLink>

        <NavLink to="/settings" className="menu-item">
          <FaCog className="icon" />
          <span>Settings</span>
        </NavLink>
      </div>

      <div className="bottom-menu">
        <div className="menu-item user-info">
          <FaUserCircle className="icon" />
          <span>{userName}</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
