import { useState } from "react";
import AnalyticsCards from "../components/dashboard/AnalyticsCards";
import MessageTable from "../components/dashboard/MessageTable";
import FontLink from "../styles/dashboardFonts";
import {
  FiActivity,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiSearch,
  FiSend,
  FiTarget,
  FiTrendingDown,
  FiTrendingUp,
} from "react-icons/fi";
import { allMessages } from "../data/dashboardData";
import Sparkbar from "../components/dashboard/Sparkbar";
import { statusConfig, tagConfig } from "../utils/statusConfig.jsx";
import { sentEmailsData } from "../data/dashboardData";

const totalSent = sentEmailsData.length;

const totalReplies = sentEmailsData.filter(
  (m) => m.status === "Replied" || m.replies > 0,
).length;

const totalFollowups = sentEmailsData.filter(
  (m) => m.followUps && m.followUps > 0,
).length;

const cardData = [
  {
    title: "Emails Sent",
    Icon: FiSend,
    color: "#6366f1",
    bg: "#eef2ff",
    stats: [
      { label: "Total Sent", value: totalSent, change: "" },
      { label: "Follow-ups", value: totalFollowups, change: "" },
    ],
  },
  {
    title: "Replies",
    Icon: FiActivity,
    color: "#0ea5e9",
    bg: "#e0f2fe",
    stats: [
      { label: "Replies Received", value: totalReplies, change: "" },
      { label: "No Reply", value: totalSent - totalReplies, change: "" },
    ],
  },
  {
    title: "Engagement",
    Icon: FiTarget,
    color: "#10b981",
    bg: "#d1fae5",
    stats: [
      {
        label: "Reply Rate",
        value:
          totalSent > 0
            ? Math.round((totalReplies / totalSent) * 100) + "%"
            : "0%",
        change: "",
      },
      {
        label: "Follow-up Rate",
        value:
          totalSent > 0
            ? Math.round((totalFollowups / totalSent) * 100) + "%"
            : "0%",
        change: "",
      },
    ],
  },
];

const Dashboard = () => {
  const [range, setRange] = useState("7d");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [orgFilter, setOrgFilter] = useState("All");
  const [page, setPage] = useState(0);
  const PER_PAGE = 3;

  const statuses = ["All", ...new Set(allMessages.map((m) => m.status))];
  const orgs = ["All", ...new Set(allMessages.map((m) => m.org))];

  const filtered = allMessages.filter((m) => {
    const q = search.toLowerCase();
    return (
      (statusFilter === "All" || m.status === statusFilter) &&
      (orgFilter === "All" || m.org === orgFilter) &&
      (m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q))
    );
  });
  const paginated = filtered.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Range controls */}
      <div
        className="fade-up d0"
        style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}
      >
        {[
          ["7d", "Last 7 days"],
          ["30d", "Last 30 days"],
        ].map(([v, l]) => (
          <button
            key={v}
            onClick={() => setRange(v)}
            style={{
              padding: "6px 14px",
              borderRadius: 9,
              fontSize: 12,
              fontWeight: 600,
              border: "1px solid",
              cursor: "pointer",
              transition: "all 0.15s",
              fontFamily: "DM Sans,sans-serif",
              borderColor: range === v ? "#6366f1" : "#e2e8f0",
              background: range === v ? "#6366f1" : "#fff",
              color: range === v ? "#fff" : "#64748b",
            }}
          >
            {l}
          </button>
        ))}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            border: "1px solid #e2e8f0",
            borderRadius: 9,
            padding: "6px 12px",
            background: "#fff",
          }}
        >
          <FiCalendar size={13} color="#94a3b8" />
          <input
            type="date"
            style={{
              border: "none",
              outline: "none",
              fontSize: 12,
              color: "#374151",
              background: "transparent",
              fontFamily: "DM Sans,sans-serif",
            }}
          />
        </div>
      </div>

      {/* Analytics cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 14,
        }}
      >
        {cardData.map(({ title, Icon, color, bg, stats }, idx) => (
          <div
            key={idx}
            className={`fade-up d${idx}`}
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: "18px 20px",
              border: "1px solid #f1f5f9",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 70,
                height: 70,
                background: `radial-gradient(circle at top right,${color}12,transparent 70%)`,
                borderRadius: "0 14px 0 0",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 9,
                    background: bg,
                    color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={15} />
                </div>
                <span
                  style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}
                >
                  {title}
                </span>
              </div>
              <Sparkbar color={color} />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              {stats.map((stat, i) => {
                const neg = stat.change && stat.change.startsWith("-");
                return (
                  <div
                    key={i}
                    style={{
                      background: "#fafafa",
                      borderRadius: 9,
                      padding: "9px 11px",
                      border: "1px solid #f1f5f9",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 10.5,
                        color: "#94a3b8",
                        marginBottom: 3,
                        fontWeight: 500,
                      }}
                    >
                      {stat.label}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 5,
                      }}
                    >
                      <span
                        className="mono"
                        style={{
                          fontSize: 21,
                          fontWeight: 700,
                          color: "#0f172a",
                          lineHeight: 1,
                        }}
                      >
                        {stat.value}
                      </span>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 600,
                          color: neg ? "#ef4444" : "#10b981",
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        {neg ? (
                          <FiTrendingDown size={11} />
                        ) : (
                          <FiTrendingUp size={11} />
                        )}
                        {stat.change}
                      </span>
                    </div>
                    <p
                      style={{ fontSize: 9.5, color: "#d1d5db", marginTop: 2 }}
                    >
                      vs last week
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Message table */}
      <div
        className="fade-up d3"
        style={{
          background: "#fff",
          borderRadius: 14,
          border: "1px solid #f1f5f9",
          overflow: "hidden",
          boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
        }}
      >
        {/* Table toolbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#0f172a",
                margin: 0,
              }}
            >
              Recent Messages
            </h2>
            <p style={{ fontSize: 11.5, color: "#94a3b8", margin: "2px 0 0" }}>
              {filtered.length} conversations
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                border: "1px solid #e2e8f0",
                borderRadius: 9,
                padding: "6px 12px",
                background: "#fafafa",
              }}
            >
              <FiSearch size={13} color="#94a3b8" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                placeholder="Search…"
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 12.5,
                  color: "#374151",
                  width: 160,
                  fontFamily: "DM Sans,sans-serif",
                }}
              />
            </div>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FiFilter
                size={12}
                color="#94a3b8"
                style={{ position: "absolute", left: 9, pointerEvents: "none" }}
              />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 9,
                  padding: "6px 12px 6px 27px",
                  fontSize: 12.5,
                  color: "#374151",
                  background: "#fafafa",
                  outline: "none",
                  cursor: "pointer",
                  fontFamily: "DM Sans,sans-serif",
                }}
              >
                {statuses.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <select
              value={orgFilter}
              onChange={(e) => {
                setOrgFilter(e.target.value);
                setPage(0);
              }}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 9,
                padding: "6px 12px",
                fontSize: 12.5,
                color: "#374151",
                background: "#fafafa",
                outline: "none",
                cursor: "pointer",
                fontFamily: "DM Sans,sans-serif",
              }}
            >
              {orgs.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>

        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr
              style={{
                background: "#fafafa",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              {["Lead", "Message", "Date", "Status", "Organization", "Tag"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "9px 16px",
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: "#94a3b8",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: "36px",
                    textAlign: "center",
                    color: "#d1d5db",
                    fontSize: 13,
                  }}
                >
                  No messages found
                </td>
              </tr>
            ) : (
              paginated.map((row, i) => {
                const sc = statusConfig[row.status] || {
                  bg: "#f1f5f9",
                  color: "#374151",
                };
                const tc = tagConfig[row.tag] || {
                  bg: "#f1f5f9",
                  color: "#374151",
                };
                const hue = (row.name.charCodeAt(0) * 17) % 360;
                return (
                  <tr
                    key={i}
                    className="row-hover"
                    style={{
                      borderBottom: "1px solid #f8fafc",
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                  >
                    <td style={{ padding: "13px 16px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 9,
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: `hsl(${hue},55%,88%)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 700,
                            color: `hsl(${hue},45%,35%)`,
                            flexShrink: 0,
                          }}
                        >
                          {row.name[0]}
                        </div>
                        <div>
                          <p
                            style={{
                              fontWeight: 600,
                              color: "#0f172a",
                              margin: 0,
                              fontSize: 13,
                            }}
                          >
                            {row.name}
                          </p>
                          <p
                            style={{
                              color: "#94a3b8",
                              fontSize: 11,
                              margin: 0,
                            }}
                          >
                            {row.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "13px 16px", maxWidth: 230 }}>
                      <p
                        style={{
                          color: "#64748b",
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: 210,
                        }}
                      >
                        {row.message}
                      </p>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <span
                        className="mono"
                        style={{ fontSize: 11.5, color: "#94a3b8" }}
                      >
                        {row.date}
                      </span>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <span
                        style={{
                          background: sc.bg,
                          color: sc.color,
                          padding: "3px 9px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <span
                        style={{
                          fontSize: 13,
                          color: "#374151",
                          fontWeight: 500,
                        }}
                      >
                        {row.org}
                      </span>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <span
                        style={{
                          background: tc.bg,
                          color: tc.color,
                          padding: "3px 9px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        {row.tag}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "13px 20px",
            borderTop: "1px solid #f1f5f9",
          }}
        >
          <span style={{ fontSize: 11.5, color: "#94a3b8" }}>
            Showing {Math.min(page * PER_PAGE + 1, filtered.length)}–
            {Math.min((page + 1) * PER_PAGE, filtered.length)} of{" "}
            {filtered.length}
          </span>
          <div style={{ display: "flex", gap: 5 }}>
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                padding: "5px 11px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 500,
                border: "1px solid #e2e8f0",
                background: page === 0 ? "#fafafa" : "#fff",
                color: page === 0 ? "#d1d5db" : "#374151",
                cursor: page === 0 ? "default" : "pointer",
                fontFamily: "DM Sans,sans-serif",
              }}
            >
              <FiChevronLeft size={13} /> Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  border: "1px solid",
                  cursor: "pointer",
                  fontFamily: "DM Sans,sans-serif",
                  borderColor: i === page ? "#6366f1" : "#e2e8f0",
                  background: i === page ? "#6366f1" : "#fff",
                  color: i === page ? "#fff" : "#374151",
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                padding: "5px 11px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 500,
                border: "1px solid #e2e8f0",
                background: page >= totalPages - 1 ? "#fafafa" : "#fff",
                color: page >= totalPages - 1 ? "#d1d5db" : "#374151",
                cursor: page >= totalPages - 1 ? "default" : "pointer",
                fontFamily: "DM Sans,sans-serif",
              }}
            >
              Next <FiChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
