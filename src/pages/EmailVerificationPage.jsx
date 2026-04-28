import React, { useState, useEffect, useRef } from "react";
import {
  FiMail,
  FiRefreshCw,
  FiArrowLeft,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";

const token = {
  indigo: "#6366f1",
  indigoLight: "#818cf8",
  indigoDark: "#4f46e5",
  indigoGhost: "rgba(99,102,241,0.08)",
  red: "#ef4444",
  amber: "#f59e0b",
  green: "#10b981",
  slate900: "#0f172a",
  slate700: "#334155",
  slate500: "#64748b",
  slate400: "#94a3b8",
  slate200: "#e2e8f0",
  slate100: "#f1f5f9",
  white: "#ffffff",
};

const css = `
  * { box-sizing: border-box; }

  .ev-root {
    font-family: 'DM Sans', sans-serif;
    animation: ev-fadein 0.5s ease both;
  }

  @keyframes ev-fadein {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .ev-header {
    display: flex;
    align-items: center;
    margin-bottom: 28px;
  }

  .ev-back-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: ${token.slate400};
    padding: 8px;
    border-radius: 8px;
    transition: color 0.2s, background 0.2s;
    display: flex;
    align-items: center;
    margin-right: 12px;
    line-height: 0;
  }

  .ev-back-btn:hover {
    color: ${token.slate700};
    background: ${token.slate100};
  }

  .ev-content {
    flex: 1;
  }

  .ev-title {
    font-size: 27px;
    font-weight: 800;
    color: ${token.slate900};
    margin: 0 0 8px;
    letter-spacing: -0.03em;
    line-height: 1.15;
  }

  .ev-subtitle {
    font-size: 13.5px;
    color: ${token.slate400};
    margin: 0;
    font-weight: 400;
  }

  .ev-email-display {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: ${token.indigoGhost};
    color: ${token.indigo};
    padding: 5px 11px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    margin-top: 4px;
    border: 1px solid rgba(99,102,241,0.15);
  }

  .ev-icon {
    width: 15px;
    height: 15px;
    display: flex;
    align-items: center;
  }

  .ev-card {
    background: ${token.white};
    border: 1.5px solid ${token.slate200};
    border-radius: 14px;
    padding: 24px;
    margin-bottom: 20px;
  }

  .ev-otp-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 4px;
  }

  .ev-label {
    font-size: 11px;
    font-weight: 700;
    color: ${token.slate400};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 2px;
  }

  .ev-otp-inputs {
    display: flex;
    gap: 10px;
    justify-content: space-between;
  }

  .ev-otp-input {
    width: calc(20% - 8px);
    aspect-ratio: 1;
    border: 1.5px solid ${token.slate200};
    border-radius: 12px;
    font-size: 18px;
    font-weight: 700;
    color: ${token.slate900};
    background: ${token.white};
    text-align: center;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
    cursor: text;
  }

  .ev-otp-input:focus {
    outline: none;
    border-color: ${token.indigo};
    box-shadow: 0 0 0 3.5px rgba(99,102,241,0.12);
    transform: scale(1.05);
  }

  .ev-otp-input.error {
    border-color: ${token.red};
    background: rgba(239,68,68,0.02);
    animation: ev-shake 0.4s ease;
  }

  .ev-otp-input.error:focus {
    box-shadow: 0 0 0 3.5px rgba(239,68,68,0.1);
  }

  .ev-otp-input.filled {
    background: ${token.indigoGhost};
    border-color: ${token.indigo};
  }

  @keyframes ev-shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }

  .ev-timer {
    font-size: 12px;
    color: ${token.slate500};
    font-weight: 500;
  }

  .ev-timer.warning {
    color: ${token.amber};
  }

  .ev-timer.expired {
    color: ${token.red};
  }

  .ev-resend-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 12px;
    border-top: 1px solid ${token.slate100};
  }

  .ev-resend-btn {
    background: none;
    border: none;
    color: ${token.indigo};
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    transition: color 0.2s, background 0.2s;
    display: flex;
    align-items: center;
    gap: 5px;
    line-height: 0;
  }

  .ev-resend-btn:hover:not(:disabled) {
    background: ${token.indigoGhost};
    color: ${token.indigoDark};
  }

  .ev-resend-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .ev-verify-btn {
    width: 100%;
    padding: 14px;
    background: ${token.indigo};
    color: ${token.white};
    border: none;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14.5px;
    font-weight: 700;
    letter-spacing: 0.01em;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 14px rgba(99,102,241,0.35);
    margin-top: 8px;
  }

  .ev-verify-btn:hover:not(:disabled) {
    background: ${token.indigoDark};
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(99,102,241,0.42);
  }

  .ev-verify-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .ev-verify-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .ev-spin {
    animation: ev-spin 0.75s linear infinite;
  }

  @keyframes ev-spin {
    to { transform: rotate(360deg); }
  }

  .ev-alert {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 14px;
    border-radius: 10px;
    font-size: 12.5px;
    font-weight: 500;
    margin-bottom: 16px;
  }

  .ev-alert.success {
    background: rgba(16,185,129,0.08);
    color: #059669;
    border: 1px solid rgba(16,185,129,0.2);
  }

  .ev-alert.error {
    background: rgba(239,68,68,0.08);
    color: ${token.red};
    border: 1px solid rgba(239,68,68,0.2);
  }

  .ev-alert-icon {
    margin-top: 2px;
    flex-shrink: 0;
  }

  .ev-success-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 32px 24px;
  }

  .ev-success-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: rgba(16,185,129,0.1);
    border: 2px solid ${token.green};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${token.green};
    animation: ev-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes ev-pop {
    0% { transform: scale(0.5); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }

  .ev-success-title {
    font-size: 18px;
    font-weight: 700;
    color: ${token.slate900};
    margin: 0;
  }

  .ev-success-subtitle {
    font-size: 13px;
    color: ${token.slate500};
    margin: 0;
    text-align: center;
  }

  .ev-continue-btn {
    width: 100%;
    padding: 14px;
    background: ${token.green};
    color: ${token.white};
    border: none;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14.5px;
    font-weight: 700;
    letter-spacing: 0.01em;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }

  .ev-continue-btn:hover {
    background: #059669;
    transform: translateY(-1px);
  }
`;

const EmailVerificationPage = ({
  email,
  onBack,
  onVerificationSuccess,
  onResendOTP,
  onVerifyOTP,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isExpired, setIsExpired] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [verified, setVerified] = useState(false);
  const inputRefs = useRef([]);

  // Timer logic
  useEffect(() => {
    if (verified || isExpired) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          clearInterval(timer);
          return 0;
        }
        if (prev <= 60) {
          setCanResend(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [verified, isExpired]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOTPChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").slice(0, 6);

    if (digits.length === 6) {
      setOtp(digits.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call your API to verify OTP
      await onVerifyOTP(email, otpCode);
      setVerified(true);
      toast.success("Email verified successfully!");

      // Redirect after 2 seconds
      setTimeout(() => {
        onVerificationSuccess();
      }, 2000);
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
      // Shake animation on error
      inputRefs.current.forEach((ref) => {
        if (ref) ref.classList.add("error");
      });
      setTimeout(() => {
        inputRefs.current.forEach((ref) => {
          if (ref) ref.classList.remove("error");
        });
      }, 400);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true);
      await onResendOTP(email);
      setOtp(["", "", "", "", "", ""]);
      setError("");
      setTimeLeft(300);
      setIsExpired(false);
      setCanResend(false);
      toast.success("OTP resent successfully!");
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
      toast.error("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  if (verified) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: token.slate100, padding: "20px" }}>
        <style>{css}</style>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div className="ev-card ev-success-state">
            <div className="ev-success-icon">
              <FiCheck size={32} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="ev-success-title">Email Verified!</h2>
              <p className="ev-success-subtitle">
                Your email address has been confirmed. Redirecting you now...
              </p>
            </div>
            <button className="ev-continue-btn" onClick={onVerificationSuccess}>
              Continue to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: token.slate100, padding: "20px" }}>
      <style>{css}</style>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Header */}
        <div className="ev-header">
          <button className="ev-back-btn" onClick={onBack}>
            <FiArrowLeft size={18} />
          </button>
          <div className="ev-content">
            <h1 className="ev-title">Verify Email</h1>
            <p className="ev-subtitle">
              We've sent a code to{" "}
              <span className="ev-email-display">
                <FiMail size={13} />
                {email}
              </span>
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="ev-card">
          {error && (
            <div className="ev-alert error">
              <div className="ev-alert-icon">
                <FiAlertCircle size={14} />
              </div>
              <span>{error}</span>
            </div>
          )}

          {/* OTP Input Section */}
          <div className="ev-otp-section">
            <label className="ev-label">6-Digit Code</label>
            <div className="ev-otp-inputs" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleOTPKeyDown(index, e)}
                  className={`ev-otp-input ${digit ? "filled" : ""}`}
                  disabled={isExpired || loading || verified}
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </div>

          {/* Timer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 14,
              paddingTop: 12,
              borderTop: `1px solid ${token.slate100}`,
            }}
          >
            <span
              className={`ev-timer ${
                isExpired ? "expired" : timeLeft < 60 ? "warning" : ""
              }`}
            >
              {isExpired ? "Code expired" : `Expires in ${formatTime(timeLeft)}`}
            </span>
            <button
              className="ev-resend-btn"
              onClick={handleResendOTP}
              disabled={!canResend || loading || isExpired}
              title={
                canResend || isExpired
                  ? "Resend OTP"
                  : "Wait before requesting a new code"
              }
            >
              <FiRefreshCw size={13} className={loading ? "ev-spin" : ""} />
              Resend
            </button>
          </div>

          {/* Verify Button */}
          <button
            className="ev-verify-btn"
            onClick={handleVerify}
            disabled={otp.join("").length !== 6 || loading || isExpired}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <FiRefreshCw size={14} className="ev-spin" />
                Verifying…
              </span>
            ) : (
              "Verify Code →"
            )}
          </button>
        </div>

        {/* Info */}
        <p style={{ fontSize: 12, color: token.slate400, textAlign: "center", marginTop: 16, margin: "16px 0 0" }}>
          Didn't receive the code? Check your spam folder or request a new one.
        </p>
      </div>
    </div>
  );
};

export default EmailVerificationPage;