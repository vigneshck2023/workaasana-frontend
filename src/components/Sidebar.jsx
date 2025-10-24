import React, { useState } from "react";
import {
  FaBars,
  FaHome,
  FaProjectDiagram,
  FaUsers,
  FaChartBar,
  FaCog,
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${!isOpen ? "collapsed" : ""}`}>
      <div className="top-section">
        <span className="logo">{isOpen && "workasana"}</span>
        <span className="toggle-icon" onClick={toggleSidebar}>
          <FaBars />
        </span>
      </div>

      <div className="menu">
        <div className="menu-item" data-tooltip="Dashboard">
          <FaHome className="icon" />
          <span>Dashboard</span>
        </div>
        <div className="menu-item" data-tooltip="Projects">
          <FaProjectDiagram className="icon" />
          <span>Projects</span>
        </div>
        <div className="menu-item" data-tooltip="Team">
          <FaUsers className="icon" />
          <span>Team</span>
        </div>
        <div className="menu-item" data-tooltip="Reports">
          <FaChartBar className="icon" />
          <span>Reports</span>
        </div>
        <div className="menu-item" data-tooltip="Settings">
          <FaCog className="icon" />
          <span>Settings</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
