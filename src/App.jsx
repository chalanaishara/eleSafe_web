// src/App.jsx
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import LoginPage     from "./pages/LoginPage";
import RegisterPage  from "./pages/RegisterPage";
import Sidebar       from "./components/Sidebar";
import TopBar        from "./components/TopBar";

// Admin tabs
import UsersTable    from "./components/UsersTable";
import OfficersTable from "./components/OfficersTable";
import ReportsTable  from "./components/ReportsTable";
import AdminProfile  from "./components/AdminProfile";

// Officer tabs
import OfficerReports  from "./components/OfficerReports";
import OfficerProfile  from "./components/OfficerProfile";

import "./App.css";

// ── Route guard ───────────────────────────────────────────────────────────────
function RequireAuth({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

// ── Admin dashboard ───────────────────────────────────────────────────────────
function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = {
    users:    <UsersTable    searchTerm={searchTerm} />,
    officers: <OfficersTable searchTerm={searchTerm} />,
    reports:  <ReportsTable  searchTerm={searchTerm} />,
    profile:  <AdminProfile />,
  };

  return (
    <div className="admin-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role="ADMIN" />
      <div className="main-viewport">
        {activeTab !== "profile" && (
          <TopBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} activeTab={activeTab} />
        )}
        <div className="content-container">{tabs[activeTab]}</div>
      </div>
    </div>
  );
}

// ── Officer dashboard ─────────────────────────────────────────────────────────
function OfficerDashboard() {
  const [activeTab, setActiveTab] = useState("reports");
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = {
    reports: <OfficerReports searchTerm={searchTerm} />,
    profile: <OfficerProfile />,
  };

  return (
    <div className="admin-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role="WILD_OFFICER" />
      <div className="main-viewport">
        {activeTab !== "profile" && (
          <TopBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} activeTab={activeTab} />
        )}
        <div className="content-container">{tabs[activeTab]}</div>
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"         element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth roles={["ADMIN"]}>
                <AdminDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/officer"
            element={
              <RequireAuth roles={["WILD_OFFICER"]}>
                <OfficerDashboard />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
