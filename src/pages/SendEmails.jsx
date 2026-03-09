import { useState, useRef } from "react";
import Button from "../components/Button";
import {
  FiAlignLeft,
  FiAtSign,
  FiCheck,
  FiCornerUpRight,
  FiEdit3,
  FiEye,
  FiFile,
  FiFilter,
  FiInbox,
  FiPaperclip,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiSend,
  FiTrash2,
  FiType,
  FiX,
  FiUsers,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { DRAFT_TEMPLATES, sentEmailsData } from "../data/dashboardData";
import { sentStatusConfig } from "../utils/statusConfig.jsx";
import ComposeEmail from "../components/email/compose email/ComposeEmail.jsx";
import SentEmailsCard from "../components/email/sent email/SentEmailsCard.jsx";
import ViewEmailModal from "../components/email/sent email/ViewEmailModal.jsx";

const SendEmails = () => {
  const [tab, setTab] = useState("compose");
  const [recipients, setRecipients] = useState([]);
  const [recipientInput, setRecipientInput] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [sentList, setSentList] = useState(sentEmailsData);
  const [viewEmail, setViewEmail] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showDraftPicker, setShowDraftPicker] = useState(false);
  const fileRef = useRef(null);

  /* ── recipient chips ── */
  const addRecipient = (val) => {
    const v = val.trim().replace(/,$/, "");
    if (v && !recipients.includes(v)) setRecipients((r) => [...r, v]);
    setRecipientInput("");
  };
  const handleRecipientKey = (e) => {
    if (["Enter", ",", " "].includes(e.key)) {
      e.preventDefault();
      addRecipient(recipientInput);
    }
  };
  const removeRecipient = (r) =>
    setRecipients((rs) => rs.filter((x) => x !== r));
  const allTo = [
    ...recipients,
    ...(recipientInput.trim() ? [recipientInput.trim()] : []),
  ];

  const addFiles = (files) => {
    const nf = Array.from(files).filter(
      (f) => !attachments.find((a) => a.name === f.name && a.size === f.size),
    );
    setAttachments((p) => [...p, ...nf]);
  };

  const handleSend = () => {
    const targets = [
      ...recipients,
      ...(recipientInput.trim() ? [recipientInput.trim()] : []),
    ];
    if (!targets.length || !subject.trim() || !body.trim()) return;
    setSending(true);
    setTimeout(() => {
      const now = new Date();
      const newMails = targets.map((email) => ({
        id: Date.now() + Math.random(),
        to: email
          .split("@")[0]
          .replace(/[._]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        email,
        subject,
        body,
        sentAt: now,
        date: now.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
        status: "Delivered",
        opens: 0,
        replies: 0,
      }));
      setSentList((p) => [...newMails, ...p]);
      setSending(false);
      setSentSuccess(true);
      setRecipients([]);
      setRecipientInput("");
      setSubject("");
      setBody("");
      setAttachments([]);
      setTimeout(() => {
        setSentSuccess(false);
        setTab("sent");
      }, 1800);
    }, 1400);
  };

  const canSend = allTo.length > 0 && subject.trim() && body.trim();
  const statuses = ["All", ...new Set(sentList.map((m) => m.status))];
  const filtered = sentList.filter((m) => {
    const q = search.toLowerCase();
    return (
      (statusFilter === "All" || m.status === statusFilter) &&
      (m.to.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q))
    );
  });

  const fld = {
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: "10px 13px",
    width: "100%",
    fontSize: 13,
    color: "#374151",
    outline: "none",
    transition: "border-color 0.15s",
    fontFamily: "DM Sans,sans-serif",
    background: "#fff",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Tabs */}
      <div
        className="fade-up d0"
        style={{
          display: "flex",
          gap: 0,
          borderBottom: "2px solid #f1f5f9",
          marginBottom: 20,
        }}
      >
        {[
          ["compose", "Compose Email", <FiEdit3 size={14} />],
          ["sent", "Sent Emails", <FiInbox size={14} />],
        ].map(([key, label, icon]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "10px 20px",
              fontSize: 13.5,
              fontWeight: 600,
              border: "none",
              background: "none",
              cursor: "pointer",
              fontFamily: "DM Sans,sans-serif",
              borderBottom: `2px solid ${tab === key ? "#6366f1" : "transparent"}`,
              marginBottom: "-2px",
              color: tab === key ? "#6366f1" : "#94a3b8",
              transition: "all 0.15s",
            }}
          >
            {icon} {label}
            {key === "sent" && sentList.length > 0 && (
              <span
                style={{
                  background: tab === "sent" ? "#6366f1" : "#e2e8f0",
                  color: tab === "sent" ? "#fff" : "#64748b",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "1px 6px",
                  borderRadius: 20,
                }}
              >
                {sentList.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── COMPOSE ── */}
      {tab === "compose" && (
        <ComposeEmail
          recipients={recipients}
          setRecipients={setRecipients}
          recipientInput={recipientInput}
          setRecipientInput={setRecipientInput}
          subject={subject}
          setSubject={setSubject}
          body={body}
          setBody={setBody}
          attachments={attachments}
          setAttachments={setAttachments}
          sentList={sentList}
          setSentList={setSentList}
          showDraftPicker={showDraftPicker}
          setShowDraftPicker={setShowDraftPicker}
          DRAFT_TEMPLATES={DRAFT_TEMPLATES}
          fileRef={fileRef}
          addFiles={addFiles}
          removeRecipient={removeRecipient}
          handleRecipientKey={handleRecipientKey}
          addRecipient={addRecipient}
          handleSend={handleSend}
          sending={sending}
          sentSuccess={sentSuccess}
          canSend={canSend}
          allTo={allTo}
        />
      )}

      {/* ── SENT TAB ── */}
      {tab === "sent" && (
        // <div
        //   className="fade-up d1"
        //   style={{
        //     background: "#fff",
        //     borderRadius: 14,
        //     border: "1px solid #f1f5f9",
        //     overflow: "hidden",
        //     boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
        //   }}
        // >
        //   <div
        //     style={{
        //       display: "flex",
        //       alignItems: "center",
        //       justifyContent: "space-between",
        //       padding: "16px 20px",
        //       borderBottom: "1px solid #f1f5f9",
        //     }}
        //   >
        //     <div>
        //       <h2
        //         style={{
        //           fontSize: 14,
        //           fontWeight: 700,
        //           color: "#0f172a",
        //           margin: 0,
        //         }}
        //       >
        //         Sent Emails
        //       </h2>
        //       <p
        //         style={{ fontSize: 11.5, color: "#94a3b8", margin: "2px 0 0" }}
        //       >
        //         {filtered.length} emails
        //       </p>
        //     </div>
        //     <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        //       <div
        //         style={{
        //           display: "flex",
        //           alignItems: "center",
        //           gap: 7,
        //           border: "1px solid #e2e8f0",
        //           borderRadius: 9,
        //           padding: "6px 12px",
        //           background: "#fafafa",
        //         }}
        //       >
        //         <FiSearch size={13} color="#94a3b8" />
        //         <input
        //           value={search}
        //           onChange={(e) => setSearch(e.target.value)}
        //           placeholder="Search…"
        //           style={{
        //             border: "none",
        //             outline: "none",
        //             background: "transparent",
        //             fontSize: 12.5,
        //             color: "#374151",
        //             width: 150,
        //             fontFamily: "DM Sans,sans-serif",
        //           }}
        //         />
        //       </div>
        //       <div
        //         style={{
        //           position: "relative",
        //           display: "flex",
        //           alignItems: "center",
        //         }}
        //       >
        //         <FiFilter
        //           size={12}
        //           color="#94a3b8"
        //           style={{
        //             position: "absolute",
        //             left: 9,
        //             pointerEvents: "none",
        //           }}
        //         />
        //         <select
        //           value={statusFilter}
        //           onChange={(e) => setStatusFilter(e.target.value)}
        //           style={{
        //             border: "1px solid #e2e8f0",
        //             borderRadius: 9,
        //             padding: "6px 12px 6px 27px",
        //             fontSize: 12.5,
        //             color: "#374151",
        //             background: "#fafafa",
        //             outline: "none",
        //             cursor: "pointer",
        //             fontFamily: "DM Sans,sans-serif",
        //           }}
        //         >
        //           {statuses.map((s) => (
        //             <option key={s}>{s}</option>
        //           ))}
        //         </select>
        //       </div>
        //       <button
        //         className="btn-primary"
        //         onClick={() => setTab("compose")}
        //         style={{ padding: "6px 14px" }}
        //       >
        //         <FiPlus size={13} /> Compose
        //       </button>
        //     </div>
        //   </div>
        //   <table
        //     style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        //   >
        //     <thead>
        //       <tr
        //         style={{
        //           background: "#fafafa",
        //           borderBottom: "1px solid #f1f5f9",
        //         }}
        //       >
        //         {[
        //           "Recipient",
        //           "Subject",
        //           "Sent",
        //           "Status",
        //           "Opens",
        //           "Replies",
        //           "",
        //         ].map((h) => (
        //           <th
        //             key={h}
        //             style={{
        //               textAlign: "left",
        //               padding: "9px 16px",
        //               fontSize: 10.5,
        //               fontWeight: 700,
        //               color: "#94a3b8",
        //               letterSpacing: "0.05em",
        //               textTransform: "uppercase",
        //             }}
        //           >
        //             {h}
        //           </th>
        //         ))}
        //       </tr>
        //     </thead>
        //     <tbody>
        //       {filtered.length === 0 ? (
        //         <tr>
        //           <td
        //             colSpan={7}
        //             style={{
        //               padding: "40px",
        //               textAlign: "center",
        //               color: "#d1d5db",
        //               fontSize: 13,
        //             }}
        //           >
        //             No sent emails found
        //           </td>
        //         </tr>
        //       ) : (
        //         filtered.map((row, i) => {
        //           const sc = sentStatusConfig[row.status] || {
        //             bg: "#f1f5f9",
        //             color: "#374151",
        //             icon: null,
        //           };
        //           const hue = (row.to.charCodeAt(0) * 17) % 360;
        //           return (
        //             <tr
        //               key={i}
        //               className="row-hover"
        //               style={{
        //                 borderBottom: "1px solid #f8fafc",
        //                 cursor: "pointer",
        //                 transition: "background 0.15s",
        //               }}
        //               onClick={() => setViewEmail(row)}
        //             >
        //               <td style={{ padding: "12px 16px" }}>
        //                 <div
        //                   style={{
        //                     display: "flex",
        //                     alignItems: "center",
        //                     gap: 9,
        //                   }}
        //                 >
        //                   <div
        //                     style={{
        //                       width: 30,
        //                       height: 30,
        //                       borderRadius: "50%",
        //                       background: `hsl(${hue},55%,88%)`,
        //                       display: "flex",
        //                       alignItems: "center",
        //                       justifyContent: "center",
        //                       fontSize: 12,
        //                       fontWeight: 700,
        //                       color: `hsl(${hue},45%,35%)`,
        //                       flexShrink: 0,
        //                     }}
        //                   >
        //                     {row.to[0]}
        //                   </div>
        //                   <div>
        //                     <p
        //                       style={{
        //                         fontWeight: 600,
        //                         color: "#0f172a",
        //                         margin: 0,
        //                         fontSize: 13,
        //                       }}
        //                     >
        //                       {row.to}
        //                     </p>
        //                     <p
        //                       style={{
        //                         color: "#94a3b8",
        //                         fontSize: 11,
        //                         margin: 0,
        //                       }}
        //                     >
        //                       {row.email}
        //                     </p>
        //                   </div>
        //                 </div>
        //               </td>
        //               <td style={{ padding: "12px 16px", maxWidth: 210 }}>
        //                 <p
        //                   style={{
        //                     color: "#374151",
        //                     fontWeight: 500,
        //                     margin: 0,
        //                     overflow: "hidden",
        //                     textOverflow: "ellipsis",
        //                     whiteSpace: "nowrap",
        //                     maxWidth: 190,
        //                   }}
        //                 >
        //                   {row.subject}
        //                 </p>
        //                 <p
        //                   style={{
        //                     color: "#94a3b8",
        //                     fontSize: 11.5,
        //                     margin: "2px 0 0",
        //                     overflow: "hidden",
        //                     textOverflow: "ellipsis",
        //                     whiteSpace: "nowrap",
        //                     maxWidth: 190,
        //                   }}
        //                 >
        //                   {row.body}
        //                 </p>
        //               </td>
        //               <td style={{ padding: "12px 16px" }}>
        //                 <span
        //                   className="mono"
        //                   style={{ fontSize: 11, color: "#94a3b8" }}
        //                 >
        //                   {row.date}
        //                 </span>
        //               </td>
        //               <td style={{ padding: "12px 16px" }}>
        //                 <span
        //                   style={{
        //                     display: "inline-flex",
        //                     alignItems: "center",
        //                     gap: 4,
        //                     background: sc.bg,
        //                     color: sc.color,
        //                     padding: "3px 9px",
        //                     borderRadius: 20,
        //                     fontSize: 11,
        //                     fontWeight: 600,
        //                   }}
        //                 >
        //                   {sc.icon} {row.status}
        //                 </span>
        //               </td>
        //               <td style={{ padding: "12px 16px" }}>
        //                 <div
        //                   style={{
        //                     display: "flex",
        //                     alignItems: "center",
        //                     gap: 4,
        //                     color: row.opens > 0 ? "#0ea5e9" : "#d1d5db",
        //                   }}
        //                 >
        //                   <FiEye size={12} />
        //                   <span className="mono" style={{ fontSize: 12 }}>
        //                     {row.opens}
        //                   </span>
        //                 </div>
        //               </td>
        //               <td style={{ padding: "12px 16px" }}>
        //                 <div
        //                   style={{
        //                     display: "flex",
        //                     alignItems: "center",
        //                     gap: 4,
        //                     color: row.replies > 0 ? "#10b981" : "#d1d5db",
        //                   }}
        //                 >
        //                   <FiCornerUpRight size={12} />
        //                   <span className="mono" style={{ fontSize: 12 }}>
        //                     {row.replies}
        //                   </span>
        //                 </div>
        //               </td>
        //               <td
        //                 style={{ padding: "12px 16px" }}
        //                 onClick={(e) => e.stopPropagation()}
        //               >
        //                 <div style={{ display: "flex", gap: 5 }}>
        //                   <button
        //                     onClick={() => setViewEmail(row)}
        //                     style={{
        //                       background: "none",
        //                       border: "1px solid #e2e8f0",
        //                       borderRadius: 7,
        //                       padding: "5px 7px",
        //                       cursor: "pointer",
        //                       color: "#64748b",
        //                       display: "flex",
        //                       lineHeight: 0,
        //                       transition: "all 0.15s",
        //                     }}
        //                     onMouseEnter={(e) => {
        //                       e.currentTarget.style.background = "#eef2ff";
        //                       e.currentTarget.style.color = "#6366f1";
        //                     }}
        //                     onMouseLeave={(e) => {
        //                       e.currentTarget.style.background = "none";
        //                       e.currentTarget.style.color = "#64748b";
        //                     }}
        //                   >
        //                     <FiEye size={12} />
        //                   </button>
        //                   <button
        //                     onClick={() =>
        //                       setSentList((sl) =>
        //                         sl.filter((m) => m.id !== row.id),
        //                       )
        //                     }
        //                     style={{
        //                       background: "none",
        //                       border: "1px solid #e2e8f0",
        //                       borderRadius: 7,
        //                       padding: "5px 7px",
        //                       cursor: "pointer",
        //                       color: "#64748b",
        //                       display: "flex",
        //                       lineHeight: 0,
        //                       transition: "all 0.15s",
        //                     }}
        //                     onMouseEnter={(e) => {
        //                       e.currentTarget.style.background = "#fee2e2";
        //                       e.currentTarget.style.color = "#ef4444";
        //                     }}
        //                     onMouseLeave={(e) => {
        //                       e.currentTarget.style.background = "none";
        //                       e.currentTarget.style.color = "#64748b";
        //                     }}
        //                   >
        //                     <FiTrash2 size={12} />
        //                   </button>
        //                 </div>
        //               </td>
        //             </tr>
        //           );
        //         })
        //       )}
        //     </tbody>
        //   </table>
        // </div>
        <SentEmailsCard
          filtered={filtered}
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          statuses={statuses}
          setTab={setTab}
          sentStatusConfig={sentStatusConfig}
          setViewEmail={setViewEmail}
          setSentList={setSentList}
        />
      )}

      {/* View modal */}
      {viewEmail && (
        // <div className="modal-backdrop" onClick={() => setViewEmail(null)}>
        //   <div
        //     onClick={(e) => e.stopPropagation()}
        //     style={{
        //       background: "#fff",
        //       borderRadius: 18,
        //       width: 540,
        //       overflow: "hidden",
        //       boxShadow: "0 25px 60px rgba(0,0,0,0.18)",
        //     }}
        //   >
        //     <div
        //       style={{
        //         display: "flex",
        //         alignItems: "center",
        //         justifyContent: "space-between",
        //         padding: "18px 22px",
        //         borderBottom: "1px solid #f1f5f9",
        //       }}
        //     >
        //       <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        //         <div
        //           style={{
        //             width: 34,
        //             height: 34,
        //             borderRadius: "50%",
        //             background: `hsl(${(viewEmail.to.charCodeAt(0) * 17) % 360},55%,88%)`,
        //             display: "flex",
        //             alignItems: "center",
        //             justifyContent: "center",
        //             fontSize: 13,
        //             fontWeight: 700,
        //             color: `hsl(${(viewEmail.to.charCodeAt(0) * 17) % 360},45%,35%)`,
        //           }}
        //         >
        //           {viewEmail.to[0]}
        //         </div>
        //         <div>
        //           <p
        //             style={{
        //               fontSize: 13.5,
        //               fontWeight: 700,
        //               color: "#0f172a",
        //               margin: 0,
        //             }}
        //           >
        //             {viewEmail.to}
        //           </p>
        //           <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>
        //             {viewEmail.email}
        //           </p>
        //         </div>
        //       </div>
        //       <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        //         {(() => {
        //           const sc = sentStatusConfig[viewEmail.status] || {
        //             bg: "#f1f5f9",
        //             color: "#374151",
        //             icon: null,
        //           };
        //           return (
        //             <span
        //               style={{
        //                 display: "inline-flex",
        //                 alignItems: "center",
        //                 gap: 4,
        //                 background: sc.bg,
        //                 color: sc.color,
        //                 padding: "3px 10px",
        //                 borderRadius: 20,
        //                 fontSize: 11,
        //                 fontWeight: 600,
        //               }}
        //             >
        //               {sc.icon} {viewEmail.status}
        //             </span>
        //           );
        //         })()}
        //         <button
        //           onClick={() => setViewEmail(null)}
        //           style={{
        //             background: "none",
        //             border: "none",
        //             cursor: "pointer",
        //             color: "#94a3b8",
        //             display: "flex",
        //             padding: 4,
        //             borderRadius: 8,
        //           }}
        //           onMouseEnter={(e) => {
        //             e.currentTarget.style.background = "#f1f5f9";
        //           }}
        //           onMouseLeave={(e) => {
        //             e.currentTarget.style.background = "none";
        //           }}
        //         >
        //           <FiX size={16} />
        //         </button>
        //       </div>
        //     </div>
        //     <div
        //       style={{
        //         padding: "20px 22px",
        //         display: "flex",
        //         flexDirection: "column",
        //         gap: 13,
        //       }}
        //     >
        //       <div>
        //         <p
        //           style={{
        //             fontSize: 10.5,
        //             fontWeight: 700,
        //             color: "#94a3b8",
        //             textTransform: "uppercase",
        //             letterSpacing: "0.05em",
        //             marginBottom: 4,
        //           }}
        //         >
        //           Subject
        //         </p>
        //         <p
        //           style={{
        //             fontSize: 15,
        //             fontWeight: 700,
        //             color: "#0f172a",
        //             margin: 0,
        //           }}
        //         >
        //           {viewEmail.subject}
        //         </p>
        //       </div>
        //       <div style={{ borderTop: "1px solid #f1f5f9" }} />
        //       <div>
        //         <p
        //           style={{
        //             fontSize: 10.5,
        //             fontWeight: 700,
        //             color: "#94a3b8",
        //             textTransform: "uppercase",
        //             letterSpacing: "0.05em",
        //             marginBottom: 4,
        //           }}
        //         >
        //           Message
        //         </p>
        //         <p
        //           style={{
        //             fontSize: 13.5,
        //             color: "#374151",
        //             lineHeight: 1.7,
        //             margin: 0,
        //             whiteSpace: "pre-line",
        //           }}
        //         >
        //           {viewEmail.body}
        //         </p>
        //       </div>
        //       <div style={{ borderTop: "1px solid #f1f5f9" }} />
        //       <div style={{ display: "flex", gap: 20 }}>
        //         {[
        //           { label: "Sent", value: viewEmail.date },
        //           { label: "Opens", value: viewEmail.opens },
        //           { label: "Replies", value: viewEmail.replies },
        //         ].map((m, i) => (
        //           <div key={i}>
        //             <p
        //               style={{
        //                 fontSize: 10.5,
        //                 fontWeight: 700,
        //                 color: "#94a3b8",
        //                 textTransform: "uppercase",
        //                 letterSpacing: "0.05em",
        //                 margin: "0 0 3px",
        //               }}
        //             >
        //               {m.label}
        //             </p>
        //             <p
        //               className="mono"
        //               style={{
        //                 fontSize: 13,
        //                 color: "#374151",
        //                 fontWeight: 600,
        //                 margin: 0,
        //               }}
        //             >
        //               {m.value}
        //             </p>
        //           </div>
        //         ))}
        //       </div>
        //     </div>
        //     <div
        //       style={{
        //         display: "flex",
        //         justifyContent: "flex-end",
        //         gap: 8,
        //         padding: "14px 22px",
        //         borderTop: "1px solid #f1f5f9",
        //         background: "#fafafa",
        //       }}
        //     >
        //       <button
        //         className="btn-secondary"
        //         onClick={() => setViewEmail(null)}
        //       >
        //         Close
        //       </button>
        //       <button
        //         className="btn-primary"
        //         onClick={() => {
        //           setRecipients([viewEmail.email]);
        //           setRecipientInput("");
        //           setSubject("Re: " + viewEmail.subject);
        //           setBody("");
        //           setViewEmail(null);
        //           setTab("compose");
        //         }}
        //       >
        //         <FiCornerUpRight size={13} /> Reply
        //       </button>
        //     </div>
        //   </div>
        // </div>
        <ViewEmailModal
          viewEmail={viewEmail}
          setViewEmail={setViewEmail}
          sentStatusConfig={sentStatusConfig}
          setRecipients={setRecipients}
          setRecipientInput={setRecipientInput}
          setSubject={setSubject}
          setBody={setBody}
          setTab={setTab}
        />
      )}
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default SendEmails;
