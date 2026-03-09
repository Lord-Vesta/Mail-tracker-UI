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
  setSentList
}) => {

  return (
    <div className="animate-fadeUp bg-white rounded-[14px] border border-slate-100 overflow-hidden shadow-sm">

      <SentEmailsHeader
        filtered={filtered}
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        statuses={statuses}
        setTab={setTab}
      />

      <SentEmailsTable
        filtered={filtered}
        sentStatusConfig={sentStatusConfig}
        setViewEmail={setViewEmail}
        setSentList={setSentList}
      />

    </div>
  );
};

export default SentEmailsCard;