import { useState } from "react";

import { allMessages, sentEmailsData } from "../data/dashboardData";

import AnalyticsCards from "../components/dashboard/AnalyticsCards";
import FollowupQueue from "../components/dashboard/FollowupQueue";
import OutreachTable from "../components/common/OutreachTable.jsx";

import EmailDetailModal from "../components/modals/EmailDetailModal";
import FollowupModal from "../components/modals/FollowupModal";

const totalSent = sentEmailsData.length;

const totalReplies = sentEmailsData.filter(
  (m) => m.status === "Replied" || m.replies > 0,
).length;

const totalFollowups = sentEmailsData.filter(
  (m) => m.followUps && m.followUps > 0,
).length;

const pendingFollowups = sentEmailsData.filter(
  (m) => m.status !== "Replied",
).length;

const scheduledFollowups = sentEmailsData.filter(
  (m) => m.followUps && m.followUps > 0,
).length;

const Dashboard = () => {
  const [viewMail, setViewMail] = useState(null);
  const [followupLead, setFollowupLead] = useState(null);

  const recentOutreachPreview = allMessages.slice(0, 10);

  return (
    <div className="flex flex-col gap-4 h-full min-h-0 font-sans">
      {/* Analytics Cards */}
      <AnalyticsCards
        totalSent={totalSent}
        totalReplies={totalReplies}
        totalFollowups={totalFollowups}
        pendingFollowups={pendingFollowups}
        scheduledFollowups={scheduledFollowups}
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
          />
        </div>
      </div>

      {/* Email Details Modal */}
      {viewMail && (
        <EmailDetailModal viewMail={viewMail} setViewMail={setViewMail} />
      )}

      {/* Followup Modal */}
      {followupLead && (
        <FollowupModal
          lead={followupLead}
          onClose={() => setFollowupLead(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
