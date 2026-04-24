import {
  FiX,
  FiArrowLeft,
  FiSend,
  FiRefreshCw,
  FiCheck,
  FiAlignLeft,
  FiType,
  FiPaperclip,
  FiEdit3,
  FiChevronDown,
  FiChevronUp,
  FiFile,
  FiTrash2,
  // FiReply,
  FiClock,
} from "react-icons/fi";
import {
  sendFollowupApi,
} from "../../utils/api.utils.js";
import { useContext, useRef, useState } from "react";
import { userContext } from "../../context/userContext.js";
import { convertToHtml } from "../../utils/fileUtils.js";
import { toast } from "react-toastify";
import DraftPicker from "../email/compose email/DraftPicker.jsx";

const statusColors = {
  Replied: "bg-green-100 text-green-700",
  Sent: "bg-indigo-100 text-indigo-700",
  Opened: "bg-amber-100 text-amber-700",
  Bounced: "bg-red-100 text-red-700",
};

const ALLOWED_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "txt",
  "csv",
  "zip",
  "jpg",
  "jpeg",
  "png",
  "gif",
];
const MAX_FILE_SIZE = 25 * 1024 * 1024;

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const getFileExtension = (filename) => filename.split(".").pop().toLowerCase();

const getFileIconColor = (filename) => {
  const ext = getFileExtension(filename);
  const map = {
    pdf: "text-red-500",
    doc: "text-blue-500",
    docx: "text-blue-500",
    xls: "text-green-500",
    xlsx: "text-green-500",
    ppt: "text-orange-500",
    pptx: "text-orange-500",
    txt: "text-gray-500",
    csv: "text-green-600",
    zip: "text-purple-500",
    jpg: "text-indigo-500",
    jpeg: "text-indigo-500",
    png: "text-indigo-500",
    gif: "text-indigo-500",
  };
  return map[ext] || "text-gray-400";
};

const ThreadItem = ({ item, isReply = false, isFollowUp = false, hue }) => {
  const [expandedAttachments, setExpandedAttachments] = useState(false);
  const [showRecipients, setShowRecipients] = useState(false);
  const [expandedBody, setExpandedBody] = useState(false);

  return (
    <div
      className={`border rounded-[12px] p-[14px] transition ${
        isReply
          ? "border-green-200 bg-green-50"
          : isFollowUp
            ? "border-indigo-200 bg-indigo-50"
            : "border-slate-200 bg-slate-50 hover:bg-slate-100"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-[10px]">
        <div className="flex items-center gap-[10px]">
          <div
            className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
            style={{
              background: isReply
                ? "#dcfce7"
                : isFollowUp
                  ? "#e0e7ff"
                  : `hsl(${hue},55%,88%)`,
              color: isReply
                ? "#166534"
                : isFollowUp
                  ? "#312e81"
                  : `hsl(${hue},45%,35%)`,
            }}
          >
            {item.type === "reply" ? <FiClock size={14} /> : "Y"}
          </div>
          <div className="min-w-0">
            <p className="text-[12.5px] font-semibold text-slate-900">
              {item.type === "reply" ? item.from : "You"}
            </p>
            <p className="text-[10.5px] text-slate-500 flex items-center gap-[4px]">
              <FiClock size={10} />
              {new Date(
                item.sentAt || item.timestamp || item.date,
              ).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Type badge */}
        {!isReply && (
          <span
            className={`text-[10px] font-bold px-[8px] py-[3px] rounded-full whitespace-nowrap text-white flex-shrink-0 ${
              isFollowUp ? "bg-indigo-500" : "bg-slate-500"
            }`}
          >
            {isFollowUp ? "Follow-up" : "Original"}
          </span>
        )}
      </div>

      {/* Recipients */}
      {!isReply && (item.cc?.length > 0 || item.bcc?.length > 0) && (
        <div className="mb-[8px]">
          <button
            onClick={() => setShowRecipients(!showRecipients)}
            className="text-[10.5px] text-indigo-500 font-semibold"
          >
            {showRecipients ? "Hide details" : "Show CC / BCC"}
          </button>

          {showRecipients && (
            <div className="mt-[4px] text-[10.5px] text-slate-500 space-y-[2px]">
              {item.cc?.length > 0 && (
                <div>
                  <span className="font-semibold">Cc:</span>{" "}
                  {item.cc.join(", ")}
                </div>
              )}
              {item.bcc?.length > 0 && (
                <div>
                  <span className="font-semibold">Bcc:</span>{" "}
                  {item.bcc.join(", ")}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Subject */}
      {item.subject && (
        <div className="mb-[8px]">
          <p className="text-[12px] font-bold text-slate-900">{item.subject}</p>
        </div>
      )}

      {/* Content */}
      <div
        className={`mb-[10px] rounded-[9px] p-[10px] ${
          isReply ? "bg-white border border-green-100" : "bg-white"
        }`}
      >
        <div
          className={`text-[12px] text-slate-700 leading-[1.6] overflow-hidden ${
            !expandedBody ? "max-h-[80px]" : ""
          }`}
          dangerouslySetInnerHTML={{
            __html: item.htmlBody || item.message || "<em>No content</em>",
          }}
        />

        {/* Toggle */}
        {(item.htmlBody || item.message)?.length > 200 && (
          <button
            onClick={() => setExpandedBody(!expandedBody)}
            className="mt-[6px] text-[10.5px] font-semibold text-indigo-500"
          >
            {expandedBody ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {/* Attachments */}
      {item.attachmentsMeta?.length > 0 && (
        <div className="mb-[8px]">
          <button
            onClick={() => setExpandedAttachments(!expandedAttachments)}
            className="flex items-center gap-[6px] text-[11px] font-semibold text-slate-600 hover:text-slate-900 mb-[8px]"
          >
            <FiPaperclip size={11} />
            {item.attachmentsMeta.length} attachment
            {item.attachmentsMeta.length !== 1 ? "s" : ""}
            {expandedAttachments ? (
              <FiChevronUp size={10} />
            ) : (
              <FiChevronDown size={10} />
            )}
          </button>

          {expandedAttachments && (
            <div className="flex flex-col gap-[6px]">
              {item.attachmentsMeta.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-slate-100 border border-slate-200 rounded-[9px] px-[10px] py-[7px] hover:bg-slate-150 transition"
                >
                  <div className="flex items-center gap-[8px] min-w-0">
                    <FiFile
                      size={12}
                      className={getFileIconColor(file.filename)}
                    />
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-slate-900 truncate">
                        {file.filename}
                      </p>
                      <p className="text-[9.5px] text-slate-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button className="text-indigo-500 hover:text-indigo-700 text-[10px] font-semibold flex-shrink-0 ml-[8px]">
                    DL
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stats (for sent items only) */}
      {!isReply && (
        <div className="flex gap-[12px] text-[10.5px] text-slate-500 pt-[8px] border-t border-slate-200">
          <span>📧 Opens: {item.opensCount || 0}</span>
          <span>•</span>
          <span>🔗 Clicks: {item.clicksCount || 0}</span>
        </div>
      )}
    </div>
  );
};

export const demoViewMail = {
  name: "John Doe",
  email: "john@example.com",
  subject: "Detailed Project Proposal Discussion",
  status: "Opened",
  sentAt: new Date().toISOString(),

  cc: ["manager@company.com", "teamlead@company.com"],
  bcc: ["internal@company.com"],

  htmlBody: `
    <p>Hi John,</p>
    <p>
      I hope you're doing well. I wanted to follow up regarding the project proposal we discussed earlier.
      Please find the attached documents which include detailed breakdowns of the scope, timelines,
      deliverables, and cost estimations.
    </p>
    <p>
      The proposal outlines multiple phases of execution including planning, development,
      testing, and deployment. Each phase has been carefully structured to ensure timely delivery
      while maintaining high quality standards.
    </p>
    <p>
      Additionally, we have included technical documentation and supporting materials to help your
      team better understand the architecture and implementation approach.
    </p>
    <p>
      Please review the attachments and let me know if you have any questions or require further clarification.
      Looking forward to your feedback.
    </p>
    <p>Best regards,<br/>Yash</p>
  `,

  openCount: 5,
  clicksCount: 2,

  attachmentsMeta: [
    { filename: "Proposal.pdf", size: 2400000 },
    { filename: "Architecture.docx", size: 1800000 },
    { filename: "Costing.xlsx", size: 950000 },
    { filename: "Timeline.pptx", size: 2100000 },
    { filename: "Assets.zip", size: 5200000 },
  ],

  followUps: [
    {
      subject: "Follow-up: Proposal Review",
      htmlBody: `
    <p>Hi John,</p>
    <p>
      I hope you're doing well. I wanted to follow up regarding the project proposal we discussed earlier.
      Please find the attached documents which include detailed breakdowns of the scope, timelines,
      deliverables, and cost estimations.
    </p>
    <p>
      The proposal outlines multiple phases of execution including planning, development,
      testing, and deployment. Each phase has been carefully structured to ensure timely delivery
      while maintaining high quality standards.
    </p>
    <p>
      Additionally, we have included technical documentation and supporting materials to help your
      team better understand the architecture and implementation approach.
    </p>
    <p>
      Please review the attachments and let me know if you have any questions or require further clarification.
      Looking forward to your feedback.
    </p>
    <p>Best regards,<br/>Yash</p>
  `,
      sentAt: new Date().toISOString(),
      cc: ["manager@company.com"],
      bcc: [],
      attachmentsMeta: [{ filename: "Reminder.pdf", size: 500000 }],
    },
  ],

  replies: [
    {
      message: "Thanks for sharing, we are reviewing this internally.",
      timestamp: new Date().toISOString(),
    },
  ],
};

const EmailDetailModal = ({ viewMail, setViewMail, handleGetSentEmails }) => {
  const [mode, setMode] = useState("thread");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [attachmentError, setAttachmentError] = useState("");
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [showDraftPicker, setShowDraftPicker] = useState(false);
  const [draftId, setDraftId] = useState(null);
  const fileRef = useRef(null);
  const { accounts } = useContext(userContext);

  if (!viewMail) return null;
  const hue = (viewMail.name.charCodeAt(0) * 17) % 360;

  const threadItems = (viewMail.messages || [])
    .map((m) => ({
      ...m,
      timestamp: m.sentAt,
    }))
    .sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));

  const addDraftFiles = (files) => {
    const nf = files.map((f) => ({
      type: "stored",
      id: f._id,
      name: f.filename,
      size: f.size,
      mimeType: f.mimeType,
    }));
    setAttachments((p) => [...p, ...nf]);
  };

  const validateAndAddFiles = (files) => {
    setAttachmentError("");
    const errors = [];
    const validFiles = [];

    Array.from(files).forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name} exceeds 25MB limit`);
        return;
      }
      if (!ALLOWED_EXTENSIONS.includes(getFileExtension(file.name))) {
        errors.push(`${file.name} type not allowed`);
        return;
      }
      if (attachments.some((a) => a.name === file.name)) {
        errors.push(`${file.name} already attached`);
        return;
      }
      validFiles.push(file);
    });

    if (errors.length) setAttachmentError(errors[0]);
    if (validFiles.length) setAttachments((a) => [...a, ...validFiles]);
  };

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) return;
    setSending(true);
    try {
      const initialMessage = viewMail.messages?.[0];
      console.log(viewMail,"-------------------------------------------------")
      const formData = new FormData();
      formData.append("gmailAccountId", accounts?.[0]?.gmailAccountId);
      formData.append("userId", accounts?.[0]?.id);
      formData.append("subject", subject);
      formData.append("body", convertToHtml(message));
      formData.append("to", JSON.stringify([viewMail.email]));
      formData.append("cc", JSON.stringify([]));
      formData.append("bcc", JSON.stringify([]));
      // formData.append("threadId", viewMail.threadId);
      formData.append("messageId", initialMessage?.id);

      if (draftId) formData.append("draftId", draftId);

      const attachmentIds = attachments
        .filter((a) => a.type === "stored" && a.id)
        .map((a) => a.id);
      formData.append("attachmentIds", JSON.stringify(attachmentIds || []));

      const newFiles = attachments.filter((a) => a instanceof File);
      newFiles.forEach((file) => formData.append("files", file));

      await sendFollowupApi(formData);
      if (handleGetSentEmails) await handleGetSentEmails();
      setSentSuccess(true);
      setTimeout(() => {
        setViewMail(null);
        setMode("thread");
      }, 1500);
    } catch (_error) {
      console.error(_error);
      toast.error("Failed to send follow-up.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      onClick={() => setViewMail(null)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-[16px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[640px] bg-white rounded-[20px] overflow-hidden shadow-[0_32px_80px_rgba(15,23,42,0.18)] border border-slate-100 animate-[modalIn_0.22s_cubic-bezier(0.34,1.56,0.64,1)] flex flex-col max-h-[90vh]"
      >
        {/* ── HEADER ── */}
        <div className="flex items-center justify-between px-[22px] py-[16px] bg-gradient-to-r from-indigo-500 to-indigo-400 border-b border-indigo-400 flex-shrink-0">
          <div className="flex items-center gap-[12px] flex-1 min-w-0">
            {mode === "compose" && (
              <button
                onClick={() => {
                  setMode("thread");
                  setSubject("");
                  setMessage("");
                  setAttachments([]);
                }}
                className="flex items-center justify-center w-[28px] h-[28px] rounded-md bg-white/20 border border-white/30 text-white hover:bg-white/30 flex-shrink-0"
              >
                <FiArrowLeft size={14} />
              </button>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-[15px] font-extrabold text-white truncate">
                {mode === "thread"
                  ? "Email Thread"
                  : `Follow-up to ${viewMail.name}`}
              </h3>
              <p className="text-[12px] text-white/70 truncate">
                {viewMail.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => setViewMail(null)}
            className="flex items-center justify-center w-[30px] h-[30px] rounded-md bg-white/20 border border-white/30 text-white hover:bg-white/30 flex-shrink-0"
          >
            <FiX size={14} />
          </button>
        </div>

        {/* ── USER STRIP ── */}
        <div className="flex items-center gap-[13px] px-[22px] py-[14px] border-b border-slate-100 bg-slate-50 flex-shrink-0">
          <div
            className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[14px] font-extrabold border shrink-0"
            style={{
              background: `hsl(${hue},55%,88%)`,
              color: `hsl(${hue},45%,35%)`,
              borderColor: `hsl(${hue},40%,78%)`,
            }}
          >
            {viewMail.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-slate-900 truncate">
              {viewMail.name}
            </p>
            <p className="text-[11.5px] text-slate-400 truncate">
              {viewMail.email}
            </p>
          </div>
          <span
            className={`px-[11px] py-[4px] rounded-full text-[11.5px] font-bold flex-shrink-0 ${
              statusColors[viewMail.status] || "bg-slate-100 text-slate-700"
            }`}
          >
            {viewMail.status}
          </span>
        </div>

        {/* ── THREAD VIEW ── */}
        {mode === "thread" && (
          <div className="flex-1 overflow-y-auto px-[22px] py-[16px] space-y-[12px]">
            {threadItems.length > 0 ? (
              threadItems.map((item, idx) => (
                <ThreadItem
                  key={idx}
                  item={item}
                  isReply={item.type === "reply"}
                  isFollowUp={item.type === "followup"}
                  hue={hue}
                />
              ))
            ) : (
              <div className="text-center py-[32px] text-slate-400">
                <p className="text-[13px]">No thread items</p>
              </div>
            )}
          </div>
        )}

        {/* ── COMPOSE VIEW ── */}
        {mode === "compose" && (
          <div className="flex-1 overflow-y-auto px-[22px] py-[16px] space-y-[14px]">
            {showDraftPicker && (
              <DraftPicker
                setSubject={setSubject}
                setBody={setMessage}
                setShowDraftPicker={setShowDraftPicker}
                addFiles={addDraftFiles}
                setDraftId={setDraftId}
              />
            )}

            {/* Original context */}
            <div className="flex items-center gap-[8px] px-[12px] py-[8px] bg-amber-50 border border-amber-200 rounded-[10px] text-[11.5px] text-amber-800">
              <span className="font-semibold">Re:</span>
              <span className="truncate">{viewMail.subject}</span>
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-[5px]">
              <label className="flex items-center gap-[5px] text-[11px] font-bold text-slate-400 uppercase tracking-[0.05em]">
                <FiType size={11} /> Subject
              </label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={sending}
                placeholder="Follow-up subject…"
                className="w-full border border-slate-200 rounded-[10px] px-[13px] py-[10px] text-[13px] text-slate-700 outline-none focus:border-indigo-500 disabled:opacity-50 disabled:bg-slate-50"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-[5px]">
              <label className="flex items-center gap-[5px] text-[11px] font-bold text-slate-400 uppercase tracking-[0.05em]">
                <FiAlignLeft size={11} /> Message
              </label>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={sending}
                placeholder="Write your follow-up…"
                className="w-full border border-slate-200 rounded-[10px] px-[13px] py-[10px] text-[13px] resize-none leading-[1.65] text-slate-700 outline-none focus:border-indigo-500 disabled:opacity-50 disabled:bg-slate-50"
              />
              <p className="text-right text-[11px] text-slate-300">
                {message.length} chars
              </p>
            </div>

            {/* Attachments */}
            <div className="flex flex-col gap-[8px]">
              <label className="flex items-center gap-[5px] text-[11px] font-bold text-slate-400 uppercase tracking-[0.05em]">
                <FiPaperclip size={11} /> Attachments
                {attachments.length > 0 && (
                  <span className="ml-[6px] px-[6px] py-[1px] rounded-full bg-indigo-50 text-indigo-500 text-[10px]">
                    {attachments.length}
                  </span>
                )}
              </label>

              {/* Drop zone */}
              <div
                onClick={() => !sending && fileRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  validateAndAddFiles(e.dataTransfer.files);
                }}
                className={`border-2 border-dashed rounded-[10px] py-[10px] text-center transition cursor-pointer ${
                  dragActive
                    ? "border-indigo-400 bg-indigo-50"
                    : sending
                      ? "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed"
                      : "border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300"
                }`}
              >
                <p className="text-[12px] text-slate-400">
                  {dragActive
                    ? "Drop files here"
                    : "Click or drag to attach files"}
                </p>
                <p className="text-[10.5px] text-slate-300 mt-[2px]">
                  PDF, DOC, XLS, PNG, ZIP… up to 25MB
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  disabled={sending}
                  className="hidden"
                  onChange={(e) => validateAndAddFiles(e.target.files)}
                />
              </div>

              {/* Error */}
              {attachmentError && (
                <p className="text-[11px] text-red-500 bg-red-50 border border-red-200 rounded-[8px] px-[10px] py-[6px]">
                  {attachmentError}
                </p>
              )}

              {/* File list */}
              {attachments.length > 0 && (
                <div className="flex flex-col gap-[6px]">
                  {attachments.map((file, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between border rounded-[9px] px-[10px] py-[7px] ${
                        file.type === "stored"
                          ? "bg-indigo-50 border-indigo-200"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-[8px] min-w-0">
                        <FiFile
                          size={13}
                          className={getFileIconColor(file.name)}
                        />
                        <div className="min-w-0">
                          <p className="text-[12px] font-semibold text-slate-800 truncate">
                            {file.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {file.type === "stored"
                              ? "From draft"
                              : formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setAttachments((a) => a.filter((_, j) => j !== i))
                        }
                        disabled={sending}
                        className="text-slate-400 hover:text-red-500 transition disabled:pointer-events-none p-[4px] rounded hover:bg-red-50 flex-shrink-0"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── FOOTER ── */}
        <div className="px-[22px] py-[14px] border-t border-slate-100 flex items-center justify-between bg-slate-50 flex-shrink-0">
          {mode === "thread" ? (
            <>
              <div className="text-[11.5px] text-slate-500">
                {threadItems.length} message
                {threadItems.length !== 1 ? "s" : ""} in thread
              </div>
              <div className="flex gap-[8px]">
                <button
                  onClick={() => setViewMail(null)}
                  className="px-[16px] py-[8px] rounded-[10px] text-[13px] font-semibold border border-slate-200 text-slate-500 hover:bg-slate-100 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setMode("compose");
                    setSubject(`Re: ${viewMail.subject}`);
                  }}
                  className="px-[16px] py-[8px] rounded-[10px] text-[13px] font-bold bg-indigo-500 text-white hover:bg-indigo-600 shadow-md transition"
                >
                  Send Follow-up →
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowDraftPicker((v) => !v)}
                disabled={sending}
                className="flex items-center gap-[6px] px-[12px] py-[6px] rounded-[9px] text-[12px] font-semibold border border-indigo-200 text-indigo-500 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 transition"
              >
                <FiEdit3 size={12} />
                Use Draft
                {showDraftPicker ? (
                  <FiChevronUp size={11} />
                ) : (
                  <FiChevronDown size={11} />
                )}
              </button>

              {sentSuccess ? (
                <div className="flex items-center gap-[6px] px-[14px] py-[8px] bg-green-100 text-green-700 rounded-[10px] text-[13px] font-semibold">
                  <FiCheck size={13} /> Sent!
                </div>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={!subject.trim() || !message.trim() || sending}
                  className="flex items-center gap-[7px] px-[16px] py-[8px] rounded-[10px] text-[13px] font-bold bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition"
                >
                  {sending ? (
                    <>
                      <FiRefreshCw size={13} className="animate-spin" />{" "}
                      Sending…
                    </>
                  ) : (
                    <>
                      <FiSend size={13} /> Send Follow-up
                      {attachments.length > 0 && (
                        <span className="ml-[2px] px-[6px] py-[1px] bg-indigo-400 text-white text-[10px] rounded-full">
                          {attachments.length}
                        </span>
                      )}
                    </>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailDetailModal;
