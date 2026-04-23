import { useState } from "react";
import "./ForgotPassword.css";

export default function ForgotPassword({ onBack, onBackToLogin }) {
  const [phase, setPhase]   = useState("idle"); // idle | loading | sent
  const [email, setEmail]   = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubmit = () => {
    if (!email) return;
    setPhase("loading");
    setTimeout(() => setPhase("sent"), 1800);
  };

  return (
    <div className="fp-page">
      {/* Backgrounds */}
      <div className="fp-grid" />
      <div className="fp-orb fp-orb-1" />
      <div className="fp-orb fp-orb-2" />

      {/* Back link */}
      <button className="fp-back" onClick={onBackToLogin}>
        <span className="fp-back-arrow">←</span>
        Back to Login
      </button>

      {/* Card */}
      <div className="fp-card">

        {/* Glow ring */}
        <div className="fp-ring" />

        {/* Header */}
        <div className="fp-header">
          <div className="fp-icon">🔑</div>
          <div className="fp-tag">// Password Recovery</div>
          <h1 className="fp-title">Forgot Password?</h1>
          <p className="fp-sub">
            Enter your email and we'll send you a reset link to recover your simulation workspace.
          </p>
        </div>

        {phase !== "sent" ? (
          <div className="fp-body">
            {/* Email field */}
            <div className={`fp-field${focused ? " focused" : ""}`}>
              <label className="fp-label">Email Address</label>
              <div className="fp-field-wrap">
                <span className="fp-field-icon">✉</span>
                <input
                  className="fp-input"
                  type="email"
                  placeholder="founder@startup.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              className={`fp-submit${phase === "loading" ? " loading" : ""}`}
              onClick={handleSubmit}
              disabled={phase === "loading"}
            >
              {phase === "loading"
                ? <span className="fp-spinner" />
                : "Send Reset Link →"}
            </button>

            {/* Divider */}
            <div className="fp-divider">
              <span>remembered it?</span>
            </div>

            <button className="fp-login-btn" onClick={onBackToLogin}>
              Back to Sign In
            </button>
          </div>
        ) : (
          /* Success */
          <div className="fp-success">
            <div className="fp-success-ring">
              <div className="fp-success-icon">✉</div>
            </div>
            <h2 className="fp-success-title">Check your inbox</h2>
            <p className="fp-success-desc">
              We sent a recovery link to <span className="fp-success-email">{email}</span>
            </p>
            <button className="fp-submit" style={{ marginTop: "28px" }} onClick={onBackToLogin}>
              Back to Login →
            </button>
          </div>
        )}

        {/* Footer note */}
        <p className="fp-note">
          No account yet?{" "}
          <span className="fp-note-link" onClick={onBack}>Create one free</span>
        </p>
      </div>
    </div>
  );
}