import { useState, useRef } from "react";
import { FiEdit3, FiInbox } from "react-icons/fi";

import { DRAFT_TEMPLATES, sentEmailsData } from "../data/dashboardData";
import { sentStatusConfig } from "../utils/statusConfig.jsx";

import ComposeEmail from "../components/email/compose email/ComposeEmail.jsx";
import SentEmailsCard from "../components/email/sent email/SentEmailsCard.jsx";
import EmailDetailModal from "../components/modals/EmailDetailModal.jsx";

const SendEmails = () => {
  const [tab, setTab] = useState("compose");

  const [sentList, setSentList] = useState(sentEmailsData);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewEmail, setViewEmail] = useState(null);

  const filtered = sentList.filter((m) => {
    const q = search.toLowerCase();

    return (
      (statusFilter === "All" || m.status === statusFilter) &&
      (m.to.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex flex-col overflow-y-hidden h-full">
      <div className="flex border-b-2 border-slate-100 mb-[20px]">
        {[
          ["compose", "Compose Email", <FiEdit3 size={14} />],
          ["sent", "Sent Emails", <FiInbox size={14} />],
        ].map(([key, label, icon]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-[7px] px-[20px] pb-[10px] text-[13.5px] font-semibold border-b-2 transition
            ${
              tab === key
                ? "border-indigo-500 text-indigo-500"
                : "border-transparent text-slate-400"
            }`}
          >
            {icon} {label}
            {key === "sent" && sentList.length > 0 && (
              <span
                className={`text-[10px] font-bold px-[6px] py-[1px] rounded-full
                ${
                  tab === "sent"
                    ? "bg-indigo-500 text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {sentList.length}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-hidden">
        {tab === "compose" && <ComposeEmail />}

        {tab === "sent" && (
          <SentEmailsCard setTab={setTab} setViewEmail={setViewEmail} />
        )}
      </div>



      <style>
        {`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}
      </style>
    </div>
  );
};

export default SendEmails;
