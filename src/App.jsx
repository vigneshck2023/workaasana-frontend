import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Teams from "./pages/Teams";
import Projects from "./pages/Projects";
import Report from "./pages/Report";
import Account from "./pages/Account";

import "./pages/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  const location = useLocation();

  // Hide sidebar on account page OR before login
  const showSidebar = isLoggedIn && location.pathname !== "/account";

  return (
    <div className="app-container">
      {/* Sidebar */}
      {showSidebar && (
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          userName={userName}
        />
      )}

      {/* Main Content */}
      <div
        className={`main-content ${
          showSidebar && isSidebarOpen ? "expanded" : "collapsed"
        }`}
      >
        <Routes>
          <Route
            path="/account"
            element={
              <Account
                setIsLoggedIn={setIsLoggedIn}
                setUserName={setUserName}
              />
            }
          />

          <Route
            path="/dashboard"
            element={isLoggedIn ? <Dashboard /> : <Navigate to="/account" />}
          />

          <Route
            path="/teams"
            element={isLoggedIn ? <Teams /> : <Navigate to="/account" />}
          />

          <Route
            path="/projects"
            element={isLoggedIn ? <Projects /> : <Navigate to="/account" />}
          />

          <Route
            path="/reports"
            element={isLoggedIn ? <Report /> : <Navigate to="/account" />}
          />

          <Route
            path="*"
            element={<Navigate to={isLoggedIn ? "/dashboard" : "/account"} />}
          />
        </Routes>
      </div>
    </div>
  );
}
