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
  FiLink2,
} from "react-icons/fi";

import DraftPicker from "./DraftPicker";
import RecipientInput from "./RecipientInput";
import AttachmentUpload from "./AttachmentUpload";
import { useEffect, useRef, useState } from "react";
import { DRAFT_TEMPLATES } from "../../../data/dashboardData";

const EmailFormCard = ({
  setSubject,
  setBody,
  setAllTo,
  allTo,
  subject,
  body,
  setSentList,
  // handleSend,
}) => {
  const [showCCBcc, setShowCCBcc] = useState(false);
  const [showDraftPicker, setShowDraftPicker] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [recipientInput, setRecipientInput] = useState("");
  const [ccRecipientInput, setCCRecipientInput] = useState("");
  const [bccRecipientInput, setBCCRecipientInput] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [ccRecipients, setCCRecipients] = useState([]);
  const [bccRecipients, setBCCRecipients] = useState([]);
  const fileRef = useRef(null);

  const addRecipient = (val) => {
    const v = val.trim().replace(/,$/, "");
    if (v && !recipients.includes(v)) {
      setRecipients((r) => [...r, v]);
    }
    setRecipientInput("");
  };

  const removeCCRecipient = (r) =>
    setCCRecipients((rs) => rs.filter((x) => x !== r));

  const handleCCRecipientKey = (e) => {
    if (["Enter", ",", " "].includes(e.key)) {
      e.preventDefault();
      addCCRecipient(ccRecipientInput);
    }
  };

  const addCCRecipient = (val) => {
    const v = val.trim().replace(/,$/, "");
    if (v && !ccRecipients.includes(v)) {
      setCCRecipients((r) => [...r, v]);
    }
    setCCRecipientInput("");
  };

  const addBCCRecipient = (val) => {
    const v = val.trim().replace(/,$/, "");
    if (v && !bccRecipients.includes(v)) {
      setBCCRecipients((r) => [...r, v]);
    }
    setBCCRecipientInput("");
  };

  const handleBCCRecipientKey = (e) => {
    if (["Enter", ",", " "].includes(e.key)) {
      e.preventDefault();
      addBCCRecipient(bccRecipientInput);
    }
  };

  const handleRecipientKey = (e) => {
    if (["Enter", ",", " "].includes(e.key)) {
      e.preventDefault();
      addRecipient(recipientInput);
    }
  };

  const removeRecipient = (r) =>
    setRecipients((rs) => rs.filter((x) => x !== r));

  const removeBCCRecipient = (r) =>
    setRecipients((rs) => rs.filter((x) => x !== r));

  allTo = [
    ...recipients,
    ...(recipientInput.trim() ? [recipientInput.trim()] : []),
  ];

  useEffect(() => {
    setAllTo(allTo);
  }, [allTo]);

  const addFiles = (files) => {
    const nf = Array.from(files).filter(
      (f) => !attachments.find((a) => a.name === f.name && a.size === f.size),
    );

    setAttachments((p) => [...p, ...nf]);
  };

  const handleSend = () => {
    const targets = [
      ...recipients,
      ...(recipientInput.trim() ? [recipientInput.trim()] : []),
    ];

    if (!targets.length || !subject.trim() || !body.trim()) return;

    setSending(true);

    setTimeout(() => {
      const now = new Date();

      const newMails = targets.map((email) => ({
        id: Date.now() + Math.random(),
        to: email
          .split("@")[0]
          .replace(/[._]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        email,
        subject,
        body,
        sentAt: now,
        date: now.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
        status: "Delivered",
        opens: 0,
        replies: 0,
        name: email.split("@")[0].replace(/[._]/g, " "),
      }));

      setSentList((p) => [...newMails, ...p]);

      setSending(false);
      setSentSuccess(true);

      setRecipients([]);
      setRecipientInput("");
      setSubject("");
      setBody("");
      setAttachments([]);

      setTimeout(() => {
        setSentSuccess(false);
        setTab("sent");
      }, 1800);
    }, 1400);
  };

  const canSend = allTo.length > 0 && subject.trim() && body.trim();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-y-scroll h-full shadow-sm">
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

        <button
          onClick={() => setShowCCBcc(!showCCBcc)}
          className="flex items-center gap-[6px] text-[12px] font-semibold text-indigo-500 hover:text-indigo-600 transition py-[4px]"
        >
          <FiLink2 size={12} />
          {showCCBcc ? "Hide" : "Add"} CC/BCC
          {showCCBcc ? <FiChevronUp size={11} /> : <FiChevronDown size={11} />}
        </button>

        {showCCBcc && (
          <div className="flex flex-col gap-[12px] pt-[4px] pb-[8px] border-l-2 border-indigo-200 pl-[14px]">
            {/* CC Recipients */}
            <RecipientInput
              recipients={ccRecipients}
              removeRecipient={removeCCRecipient}
              recipientInput={ccRecipientInput}
              setRecipientInput={setCCRecipientInput}
              handleRecipientKey={handleCCRecipientKey}
              addRecipient={addCCRecipient}
              label="CC"
              variant="secondary"
            />

            {/* BCC Recipients */}
            <RecipientInput
              recipients={bccRecipients}
              removeRecipient={removeBCCRecipient}
              recipientInput={bccRecipientInput}
              setRecipientInput={setBCCRecipientInput}
              handleRecipientKey={handleBCCRecipientKey}
              addRecipient={addBCCRecipient}
              label="BCC"
              variant="secondary"
            />
          </div>
        )}

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
