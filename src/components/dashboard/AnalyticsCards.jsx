import {
  FiSend,
  FiRefreshCw,
  FiMessageSquare,
  FiTrendingUp,
  FiEye,
  FiChevronDown,
} from "react-icons/fi";
import AnalyticsCard from "./AnalyticsCard.jsx";

const AnalyticsCards = ({
  kpi,
  onRefresh,
  isRefreshing = false,
  analyticsFilter,
  setAnalyticsFilter,
}) => {
  const {
    totalSent = 0,
    totalReplied = 0,
    replyRate = 0,
    totalClicked = 0,
    clickRate = 0,
    interestedLeads = 0,
    noResponse = 0,
    uniqueFollowedUp = 0,
    followupNeeded = 0,
    totalDrafts = 0,
  } = kpi;

  const cardData = [
    {
      title: "Outreach",
      Icon: FiSend,
      color: "#6366f1",
      bg: "#eef2ff",
      stats: [
        { label: "Emails Sent", value: totalSent },
        { label: "Draft Templates", value: totalDrafts },
      ],
    },
    {
      title: "Follow-ups",
      Icon: FiRefreshCw,
      color: "#f59e0b",
      bg: "#fef3c7",
      stats: [
        { label: "Followed Up", value: uniqueFollowedUp },
        { label: "Follow-up Needed", value: followupNeeded },
      ],
    },
    {
      title: "Replies",
      Icon: FiMessageSquare,
      color: "#0ea5e9",
      bg: "#e0f2fe",
      stats: [
        { label: "Replies Received", value: totalReplied },
        { label: "Reply Rate", value: `${replyRate}%` },
      ],
    },
    {
      title: "Interest",
      Icon: FiEye,
      color: "#8b5cf6",
      bg: "#ede9fe",
      stats: [
        { label: "Clicked Links", value: totalClicked },
        { label: "Click Rate", value: `${clickRate}%` },
      ],
    },
    {
      title: "Warm Leads",
      Icon: FiTrendingUp,
      color: "#10b981",
      bg: "#d1fae5",
      stats: [
        { label: "Interested, No Reply", value: interestedLeads },
        { label: "No Response", value: noResponse < 0 ? 0 : noResponse },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-2 shrink-0">
      {/* Filter Dropdown + Refresh Button Row */}
      <div className="flex items-center justify-end gap-3">
        {/* Filter Dropdown */}
        <div className="relative">
          <select
            value={analyticsFilter}
            onChange={(e) => setAnalyticsFilter(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-lg px-3 py-1.5 pr-8 text-xs font-medium text-slate-700 outline-none hover:border-indigo-300 focus:border-indigo-500 transition cursor-pointer"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="quarter">Quarterly</option>
            <option value="year">Yearly</option>
          </select>
          <FiChevronDown
            size={14}
            className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-slate-400"
          />
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition hover:cursor-pointer"
        >
          <FiRefreshCw
            size={12}
            className={isRefreshing ? "animate-spin" : ""}
          />
          {isRefreshing ? "Checking..." : "Check Replies"}
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-5 gap-3">
        {cardData.map((card, index) => (
          <AnalyticsCard
            key={index}
            index={index}
            title={card.title}
            Icon={card.Icon}
            color={card.color}
            bg={card.bg}
            stats={card.stats}
          />
        ))}
      </div>
    </div>
  );
};

export default AnalyticsCards;