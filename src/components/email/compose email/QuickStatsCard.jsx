const QuickStatsCard = ({ sentList }) => {

  const stats = [
    { label:"Sent", value:sentList.length, color:"text-indigo-500" },
    { label:"Opened", value:sentList.filter(m=>m.opens>0).length, color:"text-sky-500" },
    { label:"Replied", value:sentList.filter(m=>m.status==="Replied").length, color:"text-emerald-500" },
    { label:"Bounced", value:sentList.filter(m=>m.status==="Bounced").length, color:"text-red-500" }
  ];

  return (
    <div className="bg-white rounded-[16px] border border-slate-100 p-[20px] shadow-sm">

      <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.05em] mb-[11px]">
        Quick Stats
      </h3>

      <div className="grid grid-cols-2 gap-[9px]">

        {stats.map((s,i)=>(
          <div
            key={i}
            className="bg-slate-50 border border-slate-100 rounded-[9px] px-[11px] py-[9px]"
          >

            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-[0.04em] mb-[3px]">
              {s.label}
            </p>

            <span className={`font-mono text-[20px] font-bold ${s.color}`}>
              {s.value}
            </span>

          </div>
        ))}

      </div>
    </div>
  );
};

export default QuickStatsCard;