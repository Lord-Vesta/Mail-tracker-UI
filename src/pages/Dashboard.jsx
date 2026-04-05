import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnalyticsCards from "../components/dashboard/AnalyticsCards";
import FollowupQueue from "../components/dashboard/FollowupQueue";
import OutreachTable from "../components/common/OutreachTable.jsx";
import EmailDetailModal from "../components/modals/EmailDetailModal";
import FollowupModal from "../components/modals/FollowupModal";
import { getSentEmails } from "../utils/api.utils";
import { userContext } from "../context/ContextProvider";
import { toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();
  const { accounts } = useContext(userContext);

  const [viewMail, setViewMail] = useState(null);
  const [followupLead, setFollowupLead] = useState(null);
  const [emails, setEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [kpi, setKpi] = useState({
    totalSent: 0,
    uniqueFollowedUp: 0,
    totalReplied: 0,
    pendingReplies: 0,
    replyRate: 0,
    followupRate: 0,
    followupNeeded: 0,
    totalDrafts: 0,
  });

  const handleGetSentEmails = async () => {
    if (!accounts?.length) return;
    setIsLoading(true);
    try {
      const result = await getSentEmails(
        accounts[0].gmailAccountId,
        accounts[0].id,
      );
      setEmails(result.data || []);
    } catch (error) {
      toast.error("Failed to fetch recent outreach.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetSentEmails();
  }, [accounts]);

  // Format for OutreachTable — same as SentEmailsCard
  const recentOutreachPreview = emails.slice(0, 10).map((m) => {
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
    <div className="flex flex-col gap-4 h-full min-h-0 font-sans">
      {/* Analytics Cards */}
      <AnalyticsCards
        totalSent={kpi.totalSent}
        uniqueFollowedUp={kpi.uniqueFollowedUp}
        totalReplied={kpi.totalReplied}
        pendingReplies={kpi.pendingReplies}
        replyRate={kpi.replyRate}
        followupRate={kpi.followupRate}
        followupNeeded={kpi.followupNeeded}
        totalDrafts={kpi.totalDrafts}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-[280px_1fr] gap-3 flex-1 min-h-0">
        {/* Followups Queue */}
        <FollowupQueue openFollowupModal={setFollowupLead} />

        {/* Outreach Table */}
        <div className="bg-white rounded-[14px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-[18px] py-[14px] border-b border-slate-100 shrink-0">
            <h2 className="text-[13px] font-bold text-slate-900">
              Recent Outreach
            </h2>
            <button
              onClick={() => navigate("/sent-mails")}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View all →
            </button>
          </div>
          <OutreachTable
            recentOutreachPreview={recentOutreachPreview}
            setViewMail={setViewMail}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Email Details Modal — passes refresh + followup handler */}
      {viewMail && (
        <EmailDetailModal
          viewMail={viewMail}
          setViewMail={setViewMail}
          handleGetSentEmails={handleGetSentEmails}
        />
      )}

      {/* Followup Modal */}
      {followupLead && (
        <FollowupModal
          lead={followupLead}
          onClose={() => {
            setFollowupLead(null);
            handleGetSentEmails(); // refresh after followup sent
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
