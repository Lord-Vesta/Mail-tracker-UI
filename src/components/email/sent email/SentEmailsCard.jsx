import { useContext, useEffect, useState } from "react";
import { allMessages, sentEmailsData } from "../../../data/dashboardData";
import OutreachTable from "../../common/OutreachTable";
import SentEmailsHeader from "./SentEmailsHeader";
import SentEmailsTable from "./SentEmailsTable";
import EmailDetailModal from "../../modals/EmailDetailModal";
import { toast } from "react-toastify";
import { getSentEmails } from "../../../utils/api.utils";
import { userContext } from "../../../context/ContextProvider";

const SentEmailsCard = ({ setTab }) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewEmail, setViewEmail] = useState(null);
  const [emails, setEmails] = useState([]);

  const { accounts } = useContext(userContext);

  const handleGetSentEmails = async () => {
    try {
      const result = await getSentEmails(
        accounts[0].gmailAccountId,
        accounts[0].id,
      );
      setEmails(result.data);
    } catch (error) {
      toast.error("Failed to fetch sent emails. Please try again.");
    }
  };

  useEffect(() => {
    handleGetSentEmails();
  }, []);

  console.log("Fetched sent emails:", emails);

  const filtered = emails.filter((m) => {
    const q = search.toLowerCase();

    const toEmails = (m.to || []).join(", ").toLowerCase();

    return (
      (statusFilter === "All" || m.status === statusFilter) &&
      (toEmails.includes(q) || (m.subject || "").toLowerCase().includes(q))
    );
  });

  const formattedEmails = filtered.map((m) => {
    const email = (m.to || [])[0] || "";

    const name = email
      .split("@")[0]
      .replace(/[._]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return {
      ...m,
      name,
      email,
      message: m.preview || m.subject,
      date: new Date(m.sentAt).toLocaleDateString(),
    };
  });

  return (
    <div className="animate-fadeUp bg-white rounded-[14px] border border-slate-100 overflow-hidden flex flex-col h-full shadow-sm">
      <SentEmailsHeader
        filtered={filtered}
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        setTab={setTab}
      />

      {/* <SentEmailsTable
        filtered={filtered}
        sentStatusConfig={sentStatusConfig}
        setViewEmail={setViewEmail}
        setSentList={setSentList}
      /> */}
      <div className="flex-1 overflow-y-hidden bg-red-700">
        <OutreachTable
          recentOutreachPreview={formattedEmails}
          setViewMail={setViewEmail}
        />
      </div>

      {viewEmail && (
        <EmailDetailModal viewMail={viewEmail} setViewMail={setViewEmail} />
      )}
    </div>
  );
};

export default SentEmailsCard;
