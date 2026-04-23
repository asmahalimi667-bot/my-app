import { useState } from "react";
import "./Register.css";

export default function Register({ onBack, onBackToLogin }) {
  const [phase, setPhase]   = useState("idle"); // idle | loading | success
  const [focused, setFocused] = useState(null);
  const [form, setForm]     = useState({
    name: "", email: "", password: "", confirm: ""
  });

  const handleChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.password || !form.confirm) return;
    if (form.password !== form.confirm) return;
    setPhase("loading");
    setTimeout(() => setPhase("success"), 1800);
  };

  const fields = [
    { key: "name",     label: "Full Name",        type: "text",     placeholder: "Ada Lovelace",        icon: "👤" },
    { key: "email",    label: "Email Address",     type: "email",    placeholder: "founder@startup.io",  icon: "✉"  },
    { key: "password", label: "Password",          type: "password", placeholder: "••••••••••••",        icon: "🔒" },
    { key: "confirm",  label: "Confirm Password",  type: "password", placeholder: "••••••••••••",        icon: "🔒" },
  ];

  return (
    <div className="reg-page">
      {/* Backgrounds */}
      <div className="reg-grid" />
      <div className="reg-orb reg-orb-1" />
      <div className="reg-orb reg-orb-2" />
      <div className="reg-orb reg-orb-3" />

      {/* Back */}
      <button className="reg-back" onClick={onBackToLogin}>
        <span className="reg-back-arrow">←</span>
        Back to Login
      </button>

      {/* Layout */}
      <div className="reg-layout">

        {/* ── Left Panel ── */}
        <div className="reg-left">
          <div className="reg-brand">
            <div className="reg-brand-icon">⚠</div>
            <div className="reg-brand-name">StartFail · Sim</div>
            <div className="reg-brand-tag">// Memoir Research Platform</div>
          </div>

          <div className="reg-left-body">
            <h2 className="reg-left-title">
              Join the<br />
              <span className="reg-hl">Simulation.</span>
            </h2>
            <p className="reg-left-desc">
              Create your free account and start running AI-powered startup failure simulations.
              Learn from 500+ real post-mortems before making costly mistakes.
            </p>

            <div className="reg-perks">
              {[
                { icon: "🌳", text: "Decision Tree engine" },
                { icon: "⚙️", text: "Dynamic simulation functions" },
                { icon: "📋", text: "Expert rules system" },
                { icon: "🔓", text: "Free access — no credit card" },
              ].map((p) => (
                <div className="reg-perk" key={p.text}>
                  <span className="reg-perk-icon">{p.icon}</span>
                  <span className="reg-perk-text">{p.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="reg-left-foot">
            <span className="reg-foot-label">Already have an account?</span>
            <button className="reg-foot-link" onClick={onBackToLogin}>Sign in →</button>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="reg-right">

          {phase !== "success" ? (
            <>
              <div className="reg-form-header">
                <div className="reg-form-tag">// Create Account</div>
                <h1 className="reg-form-title">Get Started Free</h1>
                <p className="reg-form-sub">Set up your simulation workspace in seconds</p>
              </div>

              <div className="reg-fields">
                {fields.map((f) => (
                  <div
                    key={f.key}
                    className={`reg-field${focused === f.key ? " focused" : ""}${
                      f.key === "confirm" && form.confirm && form.password !== form.confirm
                        ? " error" : ""
                    }`}
                  >
                    <label className="reg-label">{f.label}</label>
                    <div className="reg-field-wrap">
                      <span className="reg-field-icon">{f.icon}</span>
                      <input
                        className="reg-input"
                        type={f.type}
                        placeholder={f.placeholder}
                        value={form[f.key]}
                        onChange={handleChange(f.key)}
                        onFocus={() => setFocused(f.key)}
                        onBlur={() => setFocused(null)}
                      />
                    </div>
                    {f.key === "confirm" && form.confirm && form.password !== form.confirm && (
                      <span className="reg-error-msg">Passwords don't match</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="reg-terms">
                <input type="checkbox" id="reg-check" className="reg-checkbox" />
                <label htmlFor="reg-check" className="reg-terms-label">
                  I agree to the <span className="reg-link">Terms of Service</span> and{" "}
                  <span className="reg-link">Privacy Policy</span>
                </label>
              </div>

              <button
                className={`reg-submit${phase === "loading" ? " loading" : ""}`}
                onClick={handleSubmit}
                disabled={phase === "loading"}
              >
                {phase === "loading"
                  ? <span className="reg-spinner" />
                  : "Create My Account →"}
              </button>

              <div className="reg-divider"><span>or sign up with</span></div>

              <div className="reg-socials">
                {[{ icon: "G", label: "Google" }, { icon: "⌥", label: "GitHub" }].map((s) => (
                  <button className="reg-social" key={s.label}>
                    <span>{s.icon}</span><span>{s.label}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="reg-success">
              <div className="reg-success-ring">
                <div className="reg-success-icon">✓</div>
              </div>
              <h2 className="reg-success-title">Account Created!</h2>
              <p className="reg-success-sub">Welcome to StartFail · Sim</p>
              <p className="reg-success-desc">
                Your workspace is ready. Redirecting to your first simulation…
              </p>
              <button className="reg-submit" style={{ marginTop: "28px" }} onClick={onBackToLogin}>
                Go to Login →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}