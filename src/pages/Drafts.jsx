import { useState } from "react";
import { FiPaperclip, FiPlus } from "react-icons/fi";
import DraftModal from "../components/drafts/DraftModal";

const Drafts = () => {
  const [drafts, setDrafts] = useState([
    {
      title: "Full Stack Developer Outreach",
      subject: "Partnership Opportunity",
      body: "Hi, I would like to connect with your team about a potential partnership.",
      attachments: [],
    },
    {
      title: "React Developer Opportunity",
      subject: "Quick question about your product",
      body: "We've been evaluating solutions in this space and yours stood out.",
      attachments: [],
    },
  ]);

  const [modal, setModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editIdx, setEditIdx] = useState(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [title, setTitle] = useState("");

  const reset = () => {
    setTitle("");
    setSubject("");
    setBody("");
    setAttachments([]);
    setEditIdx(null);
    setModalMode("create");
  };

  const close = () => {
    setModal(false);
    reset();
  };

  const openRow = (row, i) => {
    setTitle(row.title || "");
    setSubject(row.subject);
    setBody(row.body);
    setAttachments(row.attachments || []);
    setEditIdx(i);
    setModalMode("view");
    setModal(true);
  };

  const save = () => {
    if (!subject.trim() && !body.trim()) return;

    const d = { title, subject, body, attachments };

    if (modalMode === "edit" && editIdx !== null)
      setDrafts(drafts.map((x, i) => (i === editIdx ? d : x)));
    else setDrafts([...drafts, d]);

    close();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            reset();
            setModal(true);
          }}
          className="flex items-center gap-[7px] px-[16px] py-[8px] rounded-[10px] text-[13px] font-semibold bg-indigo-500 text-white hover:bg-indigo-600 transition hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(99,102,241,0.35)]"
        >
          <FiPlus size={14} />
          Create Draft
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[14px] border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-[13px] border-collapse">
          {/* Header */}
          <thead>
            <tr className="bg-[#fafafa] border-b border-slate-100">
              {["Title", "Subject", "Body Preview", "Attachments"].map((h) => (
                <th
                  key={h}
                  className="text-left px-[18px] py-[10px] text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.05em]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {drafts.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="py-[40px] text-center text-slate-300 text-[13px]"
                >
                  No drafts yet. Create your first one.
                </td>
              </tr>
            ) : (
              drafts.map((row, i) => (
                <tr
                  key={i}
                  onClick={() => openRow(row, i)}
                  className="border-b border-slate-50 cursor-pointer hover:bg-[#f8f9ff] transition"
                >
                  {/* Title */}
                  <td className="px-[18px] py-[14px]">
                    <span className="bg-indigo-50 text-indigo-500 px-[10px] py-[3px] rounded-full text-[11px] font-semibold">
                      {row.title || "General"}
                    </span>
                  </td>

                  {/* Subject */}
                  <td className="px-[18px] py-[14px] font-semibold text-slate-900">
                    {row.subject}
                  </td>

                  {/* Body */}
                  <td className="px-[18px] py-[14px] text-slate-500 max-w-[280px]">
                    <span className="block truncate max-w-[260px]">
                      {row.body}
                    </span>
                  </td>

                  {/* Attachments */}
                  <td className="px-[18px] py-[14px]">
                    {row.attachments?.length > 0 ? (
                      <span className="inline-flex items-center gap-[5px] bg-indigo-50 text-indigo-500 px-[9px] py-[3px] rounded-full text-[11px] font-semibold">
                        <FiPaperclip size={11} />
                        {row.attachments.length} file
                        {row.attachments.length > 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="text-slate-200 text-[12px]">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <DraftModal
          modalMode={modalMode}
          title={title}
          subject={subject}
          body={body}
          attachments={attachments}
          setTitle={setTitle}
          setSubject={setSubject}
          setBody={setBody}
          setAttachments={setAttachments}
          close={close}
          save={save}
          setModalMode={setModalMode}
        />
      )}
    </div>
  );
};

export default Drafts;
