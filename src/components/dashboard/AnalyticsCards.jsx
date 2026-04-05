import { FiSend, FiRefreshCw, FiMessageSquare } from "react-icons/fi";
import AnalyticsCard from "./AnalyticsCard";

const AnalyticsCards = ({
  totalSent,
  uniqueFollowedUp,
  totalDrafts,
  followupNeeded,
  totalReplied,
  totalClicked,
}) => {
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
      title: "Engagement",
      Icon: FiMessageSquare,
      color: "#10b981",
      bg: "#d1fae5",
      stats: [
        { label: "Replies Received", value: totalReplied },
        { label: "Showed Interest", value: totalClicked },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 shrink-0">
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
  );
};

export default AnalyticsCards;