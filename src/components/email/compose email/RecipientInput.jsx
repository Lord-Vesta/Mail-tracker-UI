import { FiUsers, FiX } from "react-icons/fi";

const RecipientInput = ({
  recipients,
  removeRecipient,
  recipientInput,
  setRecipientInput,
  handleRecipientKey,
  addRecipient
}) => {

  return (
    <div className="flex flex-col gap-[5px]">

      {/* Label Row */}
      <div className="flex items-center justify-between">

        <label className="flex items-center gap-[5px] text-[11px] font-bold text-slate-400 uppercase tracking-[0.05em]">
          <FiUsers size={11} />
          To

          {recipients.length > 1 && (
            <span className="ml-[4px] text-[10px] font-medium text-indigo-500 bg-indigo-50 px-[7px] py-[1px] rounded-full">
              Mass send · {recipients.length} recipients
            </span>
          )}

        </label>

      </div>

      {/* Input Container */}
      <div
        onClick={(e) => e.currentTarget.querySelector("input")?.focus()}
        className="min-h-[44px] border border-slate-200 rounded-[10px] px-[10px] py-[6px] flex flex-wrap gap-[5px] items-center bg-white cursor-text transition-colors"
      >

        {recipients.map((r, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-[4px] bg-indigo-50 border border-indigo-200 rounded-[7px] px-[8px] py-[3px] text-[12px] text-indigo-600 font-medium shrink-0"
          >
            {r}

            <button
              onClick={() => removeRecipient(r)}
              className="text-indigo-400 hover:text-indigo-500 flex"
            >
              <FiX size={10} />
            </button>

          </span>
        ))}

        <input
          value={recipientInput}
          onChange={(e) => setRecipientInput(e.target.value)}
          onKeyDown={handleRecipientKey}
          onBlur={() => {
            if (recipientInput.trim()) addRecipient(recipientInput);
          }}
          placeholder={
            recipients.length === 0
              ? "hiring@company.com — press Enter to add more"
              : "Add another email…"
          }
          className="border-none outline-none text-[12.5px] text-slate-700 bg-transparent flex-grow min-w-[200px]"
        />

      </div>

      {/* Helper text */}
      <p className="text-[11px] text-slate-400">

        Press{" "}

        <kbd className="text-[10px] bg-slate-100 border border-slate-200 rounded-[4px] px-[5px] py-[1px]">
          Enter
        </kbd>{" "}

        after each address to add it as a chip

      </p>

    </div>
  );
};

export default RecipientInput;