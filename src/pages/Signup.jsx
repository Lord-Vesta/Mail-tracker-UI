import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FiCheck, FiArrowLeft } from "react-icons/fi";
import AuthLayout from "../layouts/AuthLayout.jsx";
import { useNavigate } from "react-router-dom";

const token = {
  indigo: "#6366f1",
  indigoDark: "#4f46e5",
  slate900: "#0f172a",
  slate400: "#94a3b8",
  slate200: "#e2e8f0",
  white: "#ffffff",
};

const css = `
  * { box-sizing: border-box; }

  .sp-root { font-family: 'DM Sans', sans-serif; }

  .sp-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: rgba(16,185,129,0.08);
    color: #059669;
    font-size: 11.5px;
    font-weight: 600;
    padding: 3px 9px;
    border-radius: 99px;
    border: 1px solid rgba(16,185,129,0.2);
  }

  .google-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 14px;
    background: #fff;
    border: 1.5px solid ${token.slate200};
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    transition: all 0.2s ease;
  }

  .google-btn:hover {
    background: #f9fafb;
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  }

  .google-btn:active {
    transform: translateY(0);
  }

  .back-button {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: transparent;
    border: 1px solid ${token.slate200};
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    color: ${token.slate900};
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'DM Sans', sans-serif;
  }

  .back-button:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }

  .benefits-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid #e2e8f0;
  }

  .benefit-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: ${token.slate400};
  }

  .benefit-icon {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: rgba(16,185,129,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
`;

const SignupPage = () => {
  const navigate = useNavigate();

  // Handle Google OAuth - redirect to backend
  const handleGoogleAuth = () => {
    // Replace with your actual backend endpoint
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}api/auth/googleSignin`;
  };

  const onBack = () => {
    navigate("/");
  };

  return (
    <AuthLayout onBack={onBack}>
      <style>{css}</style>

      <div className="sp-root">
        {/* Header */}
        <div style={{ marginBottom: 28, marginTop: 20 }}>
          <span className="sp-badge" style={{ marginBottom: 14 }}>
            <FiCheck size={11} strokeWidth={3} />
            Free forever
          </span>

          <h1
            style={{
              fontSize: 27,
              fontWeight: 800,
              color: token.slate900,
              margin: "0 0 6px",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            Get started instantly
          </h1>

          <p
            style={{
              fontSize: 13.5,
              color: token.slate400,
              margin: 0,
            }}
          >
            Sign in with your Google account to access the full platform
          </p>
        </div>

        {/* Google Button */}
        <div style={{ marginTop: 20 }}>
          <button className="google-btn" onClick={handleGoogleAuth}>
            <FcGoogle size={20} />
            Continue with Google
          </button>
        </div>

        {/* Info text */}
        <p
          style={{
            marginTop: 16,
            fontSize: 12,
            color: token.slate400,
            textAlign: "center",
          }}
        >
          We only use your Google account for secure authentication. No
          passwords required.
        </p>

        {/* Benefits List */}
        <div className="benefits-list">
          <div className="benefit-item">
            <div className="benefit-icon">
              <FiCheck size={10} color="#10b981" />
            </div>
            <span>No password to remember</span>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">
              <FiCheck size={10} color="#10b981" />
            </div>
            <span>Secure authentication via Google</span>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">
              <FiCheck size={10} color="#10b981" />
            </div>
            <span>Instant access to all features</span>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;
