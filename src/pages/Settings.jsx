import { useState } from "react";
import {
  FiTrash2,
  FiCheckCircle,
  FiMail,
  FiPlus,
  FiAlertCircle,
  FiShield,
  FiRefreshCw,
  FiStar,
} from "react-icons/fi";

const GoogleIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

/* plain-english scope descriptions */
const SCOPES = [
  {
    Icon: FiMail,
    title: "Send emails",
    desc: "Lets us send outreach emails from your Gmail address on your behalf.",
    color: "text-indigo-500 bg-indigo-50 border-indigo-100",
  },
  {
    Icon: FiCheckCircle,
    title: "Read replies",
    desc: "Lets us detect when someone replies to an email you sent, so we can mark it as replied.",
    color: "text-emerald-500 bg-emerald-50 border-emerald-100",
  },
  {
    Icon: FiShield,
    title: "We never see your password",
    desc: "You sign in directly with Google. We only receive a secure access token — never your credentials.",
    color: "text-amber-500 bg-amber-50 border-amber-100",
  },
];

const AVATAR_COLORS = [
  "from-indigo-500 to-violet-400",
  "from-sky-500 to-cyan-400",
  "from-emerald-500 to-teal-400",
  "from-rose-500 to-pink-400",
  "from-amber-500 to-orange-400",
];

let nextId = 1;

const Settings = () => {
  const [accounts, setAccounts]             = useState([]);
  const [loading, setLoading]               = useState(false);
  const [confirmId, setConfirmId]           = useState(null); // id of account pending disconnect
  const [settingPrimaryId, setPrimaryId]    = useState(null);

  const primaryAccount = accounts.find(a => a.isPrimary) ?? accounts[0] ?? null;

  const connectGmail = () => {
    setLoading(true);
    setTimeout(() => {
      const id = nextId++;
      const emails = [
        "yashvardhan@gmail.com",
        "work.yash@gmail.com",
        "outreach.team@gmail.com",
        "newsletter@gmail.com",
      ];
      const email = emails[(id - 1) % emails.length];
      setAccounts(prev => {
        const isFirst = prev.length === 0;
        return [...prev, { id, email, isPrimary: isFirst, connectedAt: new Date() }];
      });
      setLoading(false);
    }, 1600);
  };

  const disconnect = (id) => {
    setAccounts(prev => {
      const remaining = prev.filter(a => a.id !== id);
      // if we removed the primary and others exist, promote first
      const wasRemoved = prev.find(a => a.id === id);
      if (wasRemoved?.isPrimary && remaining.length > 0) {
        remaining[0] = { ...remaining[0], isPrimary: true };
      }
      return remaining;
    });
    setConfirmId(null);
  };

  const makePrimary = (id) => {
    setAccounts(prev => prev.map(a => ({ ...a, isPrimary: a.id === id })));
  };

  const fmtDate = (d) =>
    d?.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="flex flex-col gap-6 w-full">

      {/* ── Page heading ── */}
      <div>
        <h1 className="text-[17px] font-extrabold text-slate-900 tracking-tight mb-1">Settings</h1>
        <p className="text-[12.5px] text-slate-400">Manage your connected Gmail accounts and app preferences.</p>
      </div>

      {/* ── Connected accounts ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden w-full">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center shadow-sm flex-shrink-0">
              <GoogleIcon size={18} />
            </div>
            <div>
              <p className="text-[13.5px] font-bold text-slate-900 leading-tight">Gmail Accounts</p>
              <p className="text-[11.5px] text-slate-400">
                {accounts.length === 0
                  ? "No accounts connected yet"
                  : `${accounts.length} account${accounts.length > 1 ? "s" : ""} connected`}
              </p>
            </div>
          </div>

          {/* <button
            onClick={connectGmail}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12.5px] font-bold bg-indigo-500 text-white hover:bg-indigo-600 active:scale-95 transition-all shadow-md shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0"
          >
            {loading
              ? <FiRefreshCw size={13} className="animate-spin" />
              : <FiPlus size={13} />}
            {loading ? "Connecting…" : "Add Gmail account"}
          </button> */}
        </div>

        {/* Empty state */}
        {accounts.length === 0 && !loading && (
          <div className="flex flex-col items-center gap-4 py-12 px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
              <FiMail className="text-slate-300" size={24} />
            </div>
            <div>
              <p className="text-[14px] font-bold text-slate-900 mb-1">No Gmail accounts connected</p>
              <p className="text-[12.5px] text-slate-400 max-w-xs leading-relaxed">
                Connect a Gmail account to start sending outreach emails and tracking replies.
              </p>
            </div>
            <button
              onClick={connectGmail}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold bg-indigo-500 text-white hover:bg-indigo-600 active:scale-95 transition-all shadow-md shadow-indigo-200"
            >
              <GoogleIcon size={14} />
              Sign in with Google
            </button>
          </div>
        )}

        {/* Connecting spinner inline */}
        {loading && accounts.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-12">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <FiRefreshCw className="text-indigo-500 animate-spin" size={18} />
            </div>
            <p className="text-[13px] font-semibold text-slate-700">Opening Google sign-in…</p>
            <p className="text-[11.5px] text-slate-400">Complete authorization in the popup window</p>
          </div>
        )}

        {/* Account list */}
        {accounts.length > 0 && (
          <div className="divide-y divide-slate-50">
            {accounts.map((acc, idx) => (
              <div
                key={acc.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors"
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} flex items-center justify-center text-white text-[14px] font-extrabold flex-shrink-0`}>
                  {acc.email[0].toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[13.5px] font-semibold text-slate-900 truncate">{acc.email}</p>
                    {acc.isPrimary && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full flex-shrink-0">
                        <FiStar size={9} />
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-[11.5px] text-slate-400 mt-0.5">
                    Connected {fmtDate(acc.connectedAt)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>

                  {/* Make primary */}
                  {!acc.isPrimary && (
                    <button
                      onClick={() => makePrimary(acc.id)}
                      className="px-3 py-1.5 text-[11.5px] font-semibold text-slate-500 border border-slate-200 rounded-lg hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                    >
                      Set primary
                    </button>
                  )}

                  {/* Disconnect */}
                  {confirmId === acc.id ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setConfirmId(null)}
                        className="px-2.5 py-1.5 text-[11.5px] font-semibold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => disconnect(acc.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-[11.5px] font-bold text-red-500 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <FiTrash2 size={11} /> Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(acc.id)}
                      className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Primary account tip */}
        {accounts.length > 1 && (
          <div className="flex items-start gap-2.5 px-5 py-3 bg-indigo-50/60 border-t border-indigo-100">
            <FiAlertCircle size={13} className="text-indigo-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11.5px] text-indigo-500 leading-relaxed">
              <span className="font-bold">Primary account</span> is used by default for all campaigns. You can change it per campaign when composing.
            </p>
          </div>
        )}
      </div>

      {/* ── What we access ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden w-full">
        <div className="px-5 py-4 border-b border-slate-100">
          <p className="text-[13.5px] font-bold text-slate-900 leading-tight">What we access</p>
          <p className="text-[11.5px] text-slate-400 mt-0.5">
            Plain English — exactly what Outreach Manager can and cannot do with your Gmail.
          </p>
        </div>

        <div className="grid grid-cols-3 divide-x divide-slate-100">
          {SCOPES.map(({ Icon, title, desc, color }) => (
            <div key={title} className="flex flex-col gap-3 p-5">
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon size={16} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-slate-900 mb-1">{title}</p>
                <p className="text-[12px] text-slate-400 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-5 py-3 bg-slate-50 border-t border-slate-100">
          <FiShield size={12} className="text-slate-400 flex-shrink-0" />
          <p className="text-[11px] text-slate-400">
            Authorization uses Google OAuth 2.0. You can revoke access anytime at{" "}
            <a href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer" className="text-indigo-500 font-semibold underline underline-offset-2">
              myaccount.google.com/permissions
            </a>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Settings;