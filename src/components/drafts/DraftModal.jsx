import { FiX, FiEdit, FiRefreshCw } from "react-icons/fi";
import AttachmentZone from "./AttachmentZone.jsx";
import AttachmentList from "./AttachmentList.jsx";
import { useRef, useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import AttachmentPreviewModal from "./AttachmentPreviewModal.jsx";

const DraftModal = ({
  modalMode,
  title,
  subject,
  body,
  attachments,
  setTitle,
  setSubject,
  setBody,
  setAttachments,
  close,
  save,
  setModalMode,
  isSaving = false, // ← added
}) => {
  const isView = modalMode === "view";
  const isEdit = modalMode === "edit";
  const [previewFile, setPreviewFile] = useState(null);
  // const editorRef = useRef(null);

  // useEffect(() => {
  //   if (editorRef.current && body) {
  //     editorRef.current.innerHTML = body;
  //   }
  // }, [modalMode]);

  const isFormInvalid =
    !title?.trim() || !subject?.trim() || !body?.replace(/<[^>]*>/g, "").trim();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
        autolink: true, // Detect links while typing
        linkOnPaste: true, // Convert pasted URLs
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-700",
        },
      }),
    ],
    content: body || "",
    editable: !isView && !isSaving,

    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setBody(html);
    },

    editorProps: {
      attributes: {
        class:
          "w-full border border-slate-200 rounded-[9px] px-[12px] py-[9px] text-[13px] min-h-[120px] outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    if (body !== editor.getHTML()) {
      editor.commands.setContent(body || "", false);
    }
  }, [editor, body]);

  useEffect(() => {
    if (!editor) return;

    editor.setEditable(!isView && !isSaving);
  }, [editor, isView, isSaving]);
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[18px] w-[540px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.18)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-[22px] py-[18px] border-b border-slate-100">
          <div className="flex items-center gap-[10px]">
            <h2 className="text-[15px] font-bold text-slate-900">
              {isView ? "View Draft" : isEdit ? "Edit Draft" : "Create Draft"}
            </h2>

            {isView && (
              <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-[2px] rounded-full font-semibold">
                Read only
              </span>
            )}
            {isEdit && (
              <span className="text-[11px] bg-indigo-50 text-indigo-500 px-2 py-[2px] rounded-full font-semibold">
                Editing
              </span>
            )}
            {isSaving && (
              <span className="flex items-center gap-[5px] text-[11px] bg-amber-50 text-amber-500 px-2 py-[2px] rounded-full font-semibold">
                <FiRefreshCw size={10} className="animate-spin" />
                Saving…
              </span>
            )}
          </div>

          <button
            onClick={close}
            disabled={isSaving}
            className="hover:cursor-pointer p-[4px] rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-[22px] py-[20px] flex flex-col gap-[16px] max-h-[65vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.05em] block mb-[7px]">
              Draft Title
            </label>
            {isView ? (
              <p className="text-[13px] font-semibold text-slate-900">
                {title || (
                  <span className="text-slate-300 font-normal">No title</span>
                )}
              </p>
            ) : (
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. React Developer Outreach"
                disabled={isSaving}
                className="w-full border border-slate-200 rounded-[9px] px-[12px] py-[9px] text-[13px] text-slate-700 outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50"
              />
            )}
          </div>

          {/* Subject */}
          <div>
            <label className="text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.05em] block mb-[7px]">
              Subject
            </label>
            {isView ? (
              <p className="text-[14px] font-semibold text-slate-900">
                {subject || (
                  <span className="text-slate-300 font-normal">No subject</span>
                )}
              </p>
            ) : (
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Quick question about your product"
                disabled={isSaving}
                className="w-full border border-slate-200 rounded-[9px] px-[12px] py-[9px] text-[13px] text-slate-700 outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50"
              />
            )}
          </div>

          <div className="border-t border-slate-100" />

          {/* Body */}
          <div>
            <label className="text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.05em] block mb-[7px]">
              Email Body
            </label>

            <div className="border border-slate-200 rounded-[9px] overflow-hidden">
              {!isView && (
                <div className="flex gap-1 p-2 bg-slate-50 border-b border-slate-200">
                  <button
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className="px-2 py-1 bg-white rounded hover:bg-indigo-50"
                  >
                    B
                  </button>

                  <button
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className="px-2 py-1 bg-white rounded hover:bg-indigo-50"
                  >
                    I
                  </button>
                </div>
              )}

              <EditorContent editor={editor} />
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Attachments */}
          <div>
            <label className="text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.05em] block mb-[8px]">
              Attachments
            </label>
            {isView ? (
              <AttachmentList
                attachment={attachments}
                onPreview={setPreviewFile}
              />
            ) : (
              <AttachmentZone
                attachments={attachments}
                onChange={setAttachments}
                disabled={isSaving} // ← pass to AttachmentZone if it supports it
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-[22px] py-[14px] border-t border-slate-100 bg-slate-50">
          <span className="text-[11.5px] text-slate-400">
            {attachments.length > 0
              ? `${attachments.length} attachment${attachments.length > 1 ? "s" : ""}`
              : "No attachments"}
          </span>

          <div className="flex gap-[8px]">
            {isView ? (
              <>
                <button
                  onClick={close}
                  className="hover:cursor-pointer inline-flex items-center gap-[6px] px-[16px] py-[8px] text-[13px] font-medium border border-slate-200 rounded-[10px] text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  onClick={() => setModalMode("edit")}
                  className="hover:cursor-pointer inline-flex items-center gap-[6px] px-[16px] py-[8px] text-[13px] font-semibold rounded-[10px] bg-indigo-500 text-white hover:bg-indigo-600 transition"
                >
                  <FiEdit size={13} />
                  Edit Draft
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={isEdit ? () => setModalMode("view") : close}
                  disabled={isSaving}
                  className="hover:cursor-pointer inline-flex items-center gap-[6px] px-[16px] py-[8px] text-[13px] font-medium border border-slate-200 rounded-[10px] text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                <button
                  onClick={save}
                  disabled={isSaving || isFormInvalid}
                  className={`inline-flex items-center gap-[6px] px-[16px] py-[8px] text-[13px] font-semibold rounded-[10px] transition
                    ${
                      isSaving || isFormInvalid
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-indigo-500 text-white hover:bg-indigo-600 hover:cursor-pointer "
                    }`}
                >
                  {isSaving ? (
                    <>
                      <FiRefreshCw size={13} className="animate-spin" />
                      {isEdit ? "Saving…" : "Creating…"}
                    </>
                  ) : isEdit ? (
                    "Save Changes"
                  ) : (
                    "Save Draft"
                  )}
                </button>
              </>
            )}
          </div>
        </div>
        <AttachmentPreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      </div>
    </div>
  );
};

export default DraftModal;
