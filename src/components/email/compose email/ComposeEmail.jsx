import React from "react";
import EmailFormCard from "./EmailFormCard.jsx";
import EmailPreviewCard from "./EmailPreviewCard.jsx";
import OutreachTipsCard from "./OutreachTipsCard.jsx";
import QuickStatsCard from "./QuickStatsCard.jsx";

const ComposeEmail = (props) => {
  return (
    <div className="grid grid-cols-[1fr_360px] gap-5 items-start h-full overflow-hidden">
      {/* Left */}
      <EmailFormCard {...props} />

      {/* Right */}
      <div className="flex flex-col gap-[14px] overflow-y-auto">
        <EmailPreviewCard {...props} />
        <OutreachTipsCard />
        <QuickStatsCard sentList={props.sentList} />
      </div>
    </div>
  );
};

export default ComposeEmail;
