import { NavLink } from "react-router-dom";
import {
  FiBarChart,
  FiEdit,
  FiSend,
  FiUsers,
  FiClock,
  FiLayers,
  FiLogOut,
  FiGrid,
  FiEdit3,
  FiInbox,
} from "react-icons/fi";

const Sidebar = ({ active, setActive }) => {
  const menu = [
    { name: "Dashboard", key: "dashboard", Icon: FiGrid },
    { name: "Drafts", key: "drafts", Icon: FiEdit3 },
    { name: "Send Emails", key: "send", Icon: FiSend },
    { name: "Follow-ups", key: "followups", Icon: FiClock },
    { name: "Inbox", key: "inbox", Icon: FiInbox },
  ];

  return (
    <div
      style={{
        width: 230,
        flexShrink: 0,
        background: "linear-gradient(180deg,#0f172a 0%,#1e293b 100%)",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "22px 20px 18px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "linear-gradient(135deg,#6366f1,#818cf8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
            }}
          >
            <FiLayers size={17} color="#fff" />
          </div>
          <div>
            <div
              style={{
                fontSize: 13.5,
                fontWeight: 700,
                color: "#f1f5f9",
                letterSpacing: "-0.01em",
              }}
            >
              Outreach
            </div>
            <div
              style={{
                fontSize: 10.5,
                color: "#64748b",
                fontWeight: 500,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Manager
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav
        style={{
          padding: "14px 10px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "#475569",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "0 10px",
            marginBottom: 6,
          }}
        >
          Main Menu
        </div>
        {menu.map(({ name, key, Icon }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`nav-item ${active === key ? "active" : ""}`}
          >
            <Icon size={15} />
            <span style={{ flex: 1, textAlign: "left" }}>{name}</span>
            <span className="nav-dot" />
          </button>
        ))}
      </nav>

      {/* User footer */}
      <div
        style={{
          padding: "14px 12px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 10px",
            borderRadius: 10,
            cursor: "pointer",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#6366f1,#a78bfa)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            O
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#e2e8f0",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Omar
            </div>
            <div style={{ fontSize: 11, color: "#64748b" }}>Admin</div>
          </div>
          <FiLogOut size={14} color="#475569" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
