import { FiSearch, FiFilter, FiPlus } from "react-icons/fi";

const SentEmailsHeader = ({
  filtered,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  statuses,
  setTab,
}) => {
  return (
    <div className="flex items-center justify-between px-[20px] py-[16px] border-b border-slate-100">
      <div>
        <h2 className="text-[14px] font-bold text-slate-900">Sent Emails</h2>

        <p className="text-[11.5px] text-slate-400 mt-[2px]">
          {filtered.length} emails
        </p>
      </div>

      <div className="flex items-center gap-[8px]">
        {/* Search */}
        <div className="flex items-center gap-[7px] border border-slate-200 rounded-[9px] px-[12px] py-[6px] bg-slate-50">
          <FiSearch size={13} className="text-slate-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="bg-transparent outline-none text-[12.5px] text-slate-700 w-[150px]"
          />
        </div>

        {/* Filter */}
        <div className="relative flex items-center">
          <FiFilter
            size={12}
            className="absolute left-[9px] text-slate-400 pointer-events-none"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-200 rounded-[9px] pl-[27px] pr-[12px] py-[6px] text-[12.5px] text-slate-700 bg-slate-50 outline-none cursor-pointer"
          >
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setTab("compose")}
          className="inline-flex items-center gap-[7px] px-[16px] py-[8px] rounded-[10px] text-[13px] font-semibold bg-indigo-500 text-white transition hover:bg-indigo-600 hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(99,102,241,0.35)] px-[14px] py-[6px]"
        >
          <FiPlus size={13} /> Compose
        </button>
      </div>
    </div>
  );
};

export default SentEmailsHeader;
