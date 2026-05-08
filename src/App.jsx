import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import UsersTable from "./components/UsersTable";
import OfficersTable from "./components/OfficersTable";
import AdminProfile from "./components/AdminProfile";
import "./App.css";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="admin-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-viewport">
        {activeTab !== "profile" && (
          <TopBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        )}
        <div className="content-container">
          {activeTab === "users" && <UsersTable searchTerm={searchTerm} />}
          {activeTab === "officers" && <OfficersTable searchTerm={searchTerm} />}
          {activeTab === "profile" && <AdminProfile />}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route
          path="*"
          element={
            <div style={{ textAlign: "center", marginTop: "50px" }}>
              <h1>404 - Page Not Found</h1>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}