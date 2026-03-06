import { useState } from "react";
import { FiBell,FiSearch } from "react-icons/fi";

const pageTitles = {
  dashboard: {
    title: "Dashboard",
    sub: "Monitor replies, follow up, and close more deals.",
  },
  drafts: {
    title: "Email Drafts",
    sub: "Create and manage reusable outreach templates.",
  },
  send: {
    title: "Send Emails",
    sub: "Compose and dispatch outreach campaigns.",
  },
  followups: {
    title: "Follow-ups",
    sub: "Track and manage pending follow-up sequences.",
  },
};
const Navbar = ({ active }) => {
  const [notifs] = useState(3);
  const info = pageTitles[active] || pageTitles.dashboard;

  return (
    <div
      style={{
        height: 62,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        background: "#fff",
        borderBottom: "1px solid #f1f5f9",
        flexShrink: 0,
      }}
    >
      <div>
        <h1
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#0f172a",
            lineHeight: 1.2,
          }}
        >
          {info.title}
        </h1>
        <p style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 1 }}>
          {info.sub}
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Search pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 10,
            padding: "7px 13px",
            cursor: "text",
          }}
        >
          <FiSearch size={13} color="#94a3b8" />
          <span style={{ fontSize: 12.5, color: "#94a3b8" }}>Search…</span>
        </div>

        {/* Bell */}
        <div style={{ position: "relative", cursor: "pointer" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#64748b",
            }}
          >
            <FiBell size={17} />
          </div>
          {notifs > 0 && (
            <div
              style={{
                position: "absolute",
                top: -3,
                right: -3,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "#ef4444",
                color: "#fff",
                fontSize: 9,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #fff",
              }}
            >
              {notifs}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#6366f1,#a78bfa)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
            color: "#fff",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
          }}
        >
          O
        </div>
      </div>
    </div>
  );
};

export default Navbar;
