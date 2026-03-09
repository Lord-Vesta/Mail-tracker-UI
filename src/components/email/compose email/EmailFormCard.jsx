import {
  FiEdit3,
  FiChevronUp,
  FiChevronDown,
  FiAlignLeft,
  FiType,
  FiSend,
  FiRefreshCw,
  FiUsers,
  FiCheck,
} from "react-icons/fi";

import DraftPicker from "./DraftPicker";
import RecipientInput from "./RecipientInput";
import AttachmentUpload from "./AttachmentUpload";

const EmailFormCard = ({
  showDraftPicker,
  setShowDraftPicker,
  DRAFT_TEMPLATES,
  setSubject,
  setBody,
  recipients,
  removeRecipient,
  recipientInput,
  setRecipientInput,
  handleRecipientKey,
  addRecipient,
  subject,
  body,
  setAttachments,
  attachments,
  fileRef,
  addFiles,
  allTo,
  sentSuccess,
  sending,
  canSend,
  handleSend,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-[22px] py-[16px] border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-[10px]">
          <div className="w-8 h-8 rounded-[9px] bg-indigo-50 text-indigo-500 flex items-center justify-center">
            <FiEdit3 size={15} />
          </div>

          <div>
            <h2 className="text-[14px] font-bold text-slate-900">New Email</h2>

            <p className="text-[11.5px] text-slate-400">Single or mass send</p>
          </div>
        </div>

        <button
          onClick={() => setShowDraftPicker((v) => !v)}
          className={`flex items-center gap-[6px] px-[12px] py-[6px] rounded-[9px] text-[12px] font-semibold border transition
          ${
            showDraftPicker
              ? "bg-indigo-500 border-indigo-500 text-white"
              : "bg-indigo-50 border-indigo-200 text-indigo-500"
          }`}
        >
          <FiEdit3 size={12} />
          Use Draft
          {showDraftPicker ? (
            <FiChevronUp size={11} />
          ) : (
            <FiChevronDown size={11} />
          )}
        </button>
      </div>

      {showDraftPicker && (
        <DraftPicker
          templates={DRAFT_TEMPLATES}
          setSubject={setSubject}
          setBody={setBody}
          setShowDraftPicker={setShowDraftPicker}
        />
      )}

      <div className="px-[22px] py-[20px] flex flex-col gap-[14px]">
        <RecipientInput
          recipients={recipients}
          removeRecipient={removeRecipient}
          recipientInput={recipientInput}
          setRecipientInput={setRecipientInput}
          handleRecipientKey={handleRecipientKey}
          addRecipient={addRecipient}
        />

        {/* Subject */}
        <div className="flex flex-col gap-[5px]">
          <label className="flex items-center gap-[5px] text-[11px] font-bold text-slate-400 uppercase tracking-[0.05em]">
            <FiType size={11} />
            Subject
          </label>

          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Quick question about your product"
            className="w-full border border-slate-200 rounded-[10px] px-[13px] py-[10px] text-[13px] text-slate-700 bg-white outline-none transition focus:border-indigo-500"
          />
        </div>

        {/* Message */}
        <div className="flex flex-col gap-[5px]">
          <label className="flex items-center gap-[5px] text-[11px] font-bold text-slate-400 uppercase tracking-[0.05em]">
            <FiAlignLeft size={11} />
            Message
          </label>

          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            placeholder="Write your email here…"
            className="w-full border border-slate-200 rounded-[10px] px-[13px] py-[10px] text-[13px] resize-none leading-[1.65] text-slate-700 bg-white outline-none transition focus:border-indigo-500"
          />

          <p className="text-right text-[11px] text-slate-300">
            {body.length} chars
          </p>
        </div>

        <AttachmentUpload
          fileRef={fileRef}
          attachments={attachments}
          setAttachments={setAttachments}
          addFiles={addFiles}
        />

        {/* Footer */}
        <div className="flex items-center justify-between pt-[2px]">
          <span className="text-[12px] text-slate-400">
            {allTo.length > 1 && (
              <span className="flex items-center gap-[5px] text-indigo-500 font-semibold">
                <FiUsers size={13} />
                Sending to {allTo.length} people
              </span>
            )}
          </span>

          {sentSuccess ? (
            <div className="flex items-center gap-[8px] px-[18px] py-[8px] rounded-[10px] bg-emerald-100 text-emerald-900 text-[13px] font-semibold">
              <FiCheck size={14} />
              {allTo.length > 1 ? `Sent to ${allTo.length}!` : "Sent!"}
            </div>
          ) : (
            <button
              onClick={handleSend}
              disabled={!canSend || sending}
              className={`flex items-center gap-[7px] px-[16px] py-[8px] rounded-[10px] text-[13px] font-semibold transition
              ${
                canSend
                  ? "bg-indigo-500 text-white hover:bg-indigo-600"
                  : "bg-indigo-500 text-white opacity-45 cursor-not-allowed"
              }`}
            >
              {sending ? (
                <>
                  <FiRefreshCw size={13} className="animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <FiSend size={13} />
                  {allTo.length > 1 ? `Send to ${allTo.length}` : "Send Email"}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailFormCard;
