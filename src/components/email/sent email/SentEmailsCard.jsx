import { allMessages } from "../../../data/dashboardData";
import OutreachTable from "../../common/OutreachTable";
import SentEmailsHeader from "./SentEmailsHeader";
import SentEmailsTable from "./SentEmailsTable";

const SentEmailsCard = ({
  filtered,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  statuses,
  setTab,
  sentStatusConfig,
  setViewEmail,
  setSentList,
}) => {
  console.log("Filtered in SentEmailsCard:", filtered);
  return (
    <div className="animate-fadeUp bg-white rounded-[14px] border border-slate-100 overflow-hidden flex flex-col h-full shadow-sm">
      <SentEmailsHeader
        filtered={filtered}
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        statuses={statuses}
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
          recentOutreachPreview={filtered}
          setViewMail={setViewEmail}
        />
      </div>
    </div>
  );
};

export default SentEmailsCard;
