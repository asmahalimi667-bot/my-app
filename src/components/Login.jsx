import { useState, useRef, useEffect } from "react";
import "./Login.css";

/* ─── Animated scenario ticker ───────────────────────────────── */
const SCENARIOS = [
  "💸  Cash Runway Crisis · Active Simulation",
  "📉  Market Timing Failure · Loading…",
  "🤝  Co-founder Conflict · Standby",
  "🚫  Product-Market Fit Miss · Queued",
];

export default function Login({ onBack }) {
  const [phase, setPhase]     = useState("idle"); // idle | loading | success
  const [form, setForm]       = useState({ email: "", password: "" });
  const [focused, setFocused] = useState(null);
  const [tickerIdx, setTickerIdx] = useState(0);

  /* Rotate ticker every 2.8s */
  useEffect(() => {
    const id = setInterval(() =>
      setTickerIdx((i) => (i + 1) % SCENARIOS.length), 2800);
    return () => clearInterval(id);
  }, []);

  const handleChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = () => {
    if (!form.email || !form.password) return;
    setPhase("loading");
    setTimeout(() => setPhase("success"), 1800);
  };

  return (
    <div className="login-page">
      {/* Backgrounds */}
      <div className="login-grid" />
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />
      <div className="login-orb login-orb-3" />

      {/* Back link */}
      <a className="login-back" onClick={onBack} href="#">
        <span className="login-back-arrow">←</span>
        Back to Home
      </a>

      {/* Main card */}
      <div className="login-layout">

        {/* ── Left Panel ── */}
        <div className="login-left">

          {/* Brand */}
          <div className="login-brand">
            <div className="login-brand-icon">⚠</div>
            <div className="login-brand-name">StartFail · Sim</div>
            <div className="login-brand-tag">// Memoir Research Platform</div>
          </div>

          {/* Headline */}
          <div className="login-left-body">
            <h2 className="login-left-title">
              Simulate.<br />
              <span className="hl">Fail.</span><br />
              Learn.
            </h2>
            <p className="login-left-desc">
              Access your AI simulation workspace. Run startup failure scenarios
              powered by Decision Trees, Dynamic Functions, and Expert Rule engines.
            </p>

            <div className="login-stats">
              {[
                { num: "90%",  lbl: "Failure Rate" },
                { num: "50+",  lbl: "Scenarios" },
                { num: "3",    lbl: "AI Methods" },
              ].map((s) => (
                <div key={s.lbl}>
                  <div className="login-stat-num">{s.num}</div>
                  <div className="login-stat-lbl">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Live ticker */}
          <div className="login-ticker">
            <div className="login-ticker-label">Live Scenario Engine</div>
            <div className="login-ticker-item" key={tickerIdx}>
              <div className="login-ticker-dot" />
              <span className="login-ticker-text">{SCENARIOS[tickerIdx]}</span>
            </div>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="login-right">

          {phase !== "success" ? (
            <>
              {/* Form header */}
              <div className="login-form-header">
                <div className="login-form-tag">// Secure Access Portal</div>
                <h1 className="login-form-title">Welcome Back</h1>
                <p className="login-form-sub">
                  Sign in to your simulation workspace
                </p>
              </div>

              {/* Fields */}
              <div className="login-fields">
                {[
                  {
                    key: "email",
                    label: "Email Address",
                    type: "email",
                    placeholder: "founder@startup.io",
                    icon: "✉",
                  },
                  {
                    key: "password",
                    label: "Password",
                    type: "password",
                    placeholder: "••••••••••••",
                    icon: "🔒",
                  },
                ].map((f) => (
                  <div
                    key={f.key}
                    className={`login-field${focused === f.key ? " focused" : ""}`}
                  >
                    <label className="login-field-label">{f.label}</label>
                    <div className="login-field-wrap">
                      <span className="login-field-icon">{f.icon}</span>
                      <input
                        className="login-input"
                        type={f.type}
                        placeholder={f.placeholder}
                        value={form[f.key]}
                        onChange={handleChange(f.key)}
                        onFocus={() => setFocused(f.key)}
                        onBlur={() => setFocused(null)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Options */}
              <div className="login-options">
                <label className="login-remember">
                  <input type="checkbox" />
                  Remember me
                </label>
                <span className="login-forgot">Forgot password?</span>
              </div>

              {/* Submit */}
              <button
                className="login-submit"
                onClick={handleSubmit}
                disabled={phase === "loading"}
              >
                {phase === "loading" ? (
                  <span className="login-spinner" />
                ) : (
                  <>Enter Simulation <span>→</span></>
                )}
              </button>

              {/* Divider */}
              <div className="login-divider">
                <span>or continue with</span>
              </div>

              {/* Socials */}
              <div className="login-socials">
                {[
                  { icon: "G", label: "Google" },
                  { icon: "⌥", label: "GitHub" },
                ].map((s) => (
                  <button className="login-social" key={s.label}>
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>

              {/* Sign up */}
              <p className="login-signup">
                No account?{" "}
                <span className="login-signup-link">Create one free</span>
              </p>
            </>
          ) : (
            /* Success state */
            <div className="login-success">
              <div className="login-success-ring">
                <div className="login-success-icon">✓</div>
              </div>
              <h2 className="login-success-title">Access Granted</h2>
              <p className="login-success-sub">Launching your workspace…</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}