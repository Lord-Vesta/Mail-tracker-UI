import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";

import Dashboard from "./pages/Dashboard";
import Drafts from "./pages/Drafts";
import SendEmails from "./pages/SendEmails";
import Campaigns from "./pages/Campaigns";
import Followups from "./pages/Followups";
import Analytics from "./pages/Analytics";
import { useState } from "react";
import PlaceholderPage from "./pages/PlaceHolderPage";
import FontLink from "./styles/dashboardFonts";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { FiClock, FiSend } from "react-icons/fi";
import InboxPage from "./pages/InboxPage";

function App() {
  const [active, setActive] = useState("dashboard");

  const renderPage = () => {
    switch (active) {
      case "dashboard":
        return <Dashboard />;
      case "drafts":
        return <Drafts />;
      case "send":
        return <SendEmails />;
      case "followups":
        return <Followups />;
      case "inbox":
        return <InboxPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "#f8fafc",
      }}
    >
      <FontLink />
      <Sidebar active={active} setActive={setActive} />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Navbar active={active} />
        <main style={{ flex: 1, overflowY: "auto", padding: "22px 24px" }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
