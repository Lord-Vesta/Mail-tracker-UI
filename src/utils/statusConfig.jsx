import { FiAlertCircle, FiCheck, FiCornerUpRight, FiEye } from "react-icons/fi";

export const statusConfig = {
  Booked: { bg: "#d1fae5", color: "#065f46" },
  Replied: { bg: "#dbeafe", color: "#1e40af" },
  Opened: { bg: "#fef9c3", color: "#854d0e" },
  Ignored: { bg: "#fee2e2", color: "#991b1b" },
};

export const tagConfig = {
  "Top priority": { bg: "#ede9fe", color: "#5b21b6" },
  "Meeting booked": { bg: "#d1fae5", color: "#065f46" },
  "Follow-up": { bg: "#fef3c7", color: "#92400e" },
  Cold: { bg: "#f1f5f9", color: "#475569" },
  "Warm lead": { bg: "#fce7f3", color: "#9d174d" },
};

export const sentStatusConfig = {
  Delivered: { bg: "#dbeafe", color: "#1e40af", icon: <FiCheck size={10} /> },
  Opened: { bg: "#fef9c3", color: "#854d0e", icon: <FiEye size={10} /> },
  Replied: {
    bg: "#d1fae5",
    color: "#065f46",
    icon: <FiCornerUpRight size={10} />,
  },
  Bounced: {
    bg: "#fee2e2",
    color: "#991b1b",
    icon: <FiAlertCircle size={10} />,
  },
};

export const followStatusConfig = {
  Active: { bg: "#dbeafe", color: "#1e40af", dot: "#3b82f6" },
  Due: { bg: "#fef9c3", color: "#854d0e", dot: "#eab308" },
  Overdue: { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
  Paused: { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" },
  Done: { bg: "#d1fae5", color: "#065f46", dot: "#10b981" },
};

export const priorityConfig = {
  High: { color: "#ef4444", bg: "#fee2e2" },
  Medium: { color: "#f59e0b", bg: "#fef3c7" },
  Low: { color: "#10b981", bg: "#d1fae5" },
};
