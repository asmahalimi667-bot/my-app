import { useEffect, useRef, useState } from "react";
import "./Home.css";

/* ─── Data ───────────────────────────────────────────────────── */
const METHODS = [
  {
    num: "01",
    icon: "🌳",
    title: "Decision Tree",
    desc: "Navigates branching failure paths with probabilistic outcomes. Each node represents a critical decision point, and each branch leads to quantified risk states — modeled from real startup post-mortems.",
    tags: ["Probabilistic", "Branching Logic", "Risk Scoring"],
  },
  {
    num: "02",
    icon: "⚙️",
    title: "Simulation Function",
    desc: "Mathematical models simulate dynamic startup ecosystems. Functions encode market volatility, cash-burn rates, and feedback loops to generate realistic failure trajectories over time.",
    tags: ["Monte Carlo", "Dynamic Model", "Time-Series"],
  },
  {
    num: "03",
    icon: "📋",
    title: "Rules Engine",
    desc: "Encodes expert heuristics from 500+ failed startups. If-then rules fire based on operational triggers — when runway drops below threshold, when churn exceeds growth, when team cohesion breaks.",
    tags: ["Heuristics", "Expert System", "Pattern Match"],
  },
];

const FEATURES = [
  { dot: "red",    title: "Real-time Risk Scoring",        desc: "Live danger metrics update as you make decisions — see your startup's probability of failure shift in real time." },
  { dot: "teal",   title: "Failure Scenario Library",      desc: "50+ curated scenarios drawn from real startup post-mortems across fintech, SaaS, consumer, and deeptech." },
  { dot: "orange", title: "AI Decision Advisor",           desc: "Integrated AI engine evaluates your choices against historical patterns and warns of incoming failure cascades." },
  { dot: "red",    title: "Outcome Replay",                desc: "After each simulation, replay the critical decision forks and see alternate timelines that could have saved the company." },
  { dot: "teal",   title: "Team Mode",                     desc: "Simulate co-founder conflicts, investor pressure, and team dynamics with multi-player decision rounds." },
];

const RISKS = [
  { cls: "r1", icon: "💸", title: "Cash Runway Crisis", desc: "Model burn rates, fundraising delays, and revenue shortfalls that drain runway below survival threshold.", sev: "Critical" },
  { cls: "r2", icon: "📉", title: "Market Timing Failure", desc: "Simulate early-mover vs. late-mover scenarios and the cost of entering a market that isn't ready.", sev: "High" },
  { cls: "r3", icon: "🤝", title: "Co-founder Conflict", desc: "Equity disputes, vision misalignment, and role ambiguity — the silent killers of early-stage startups.", sev: "High" },
  { cls: "r4", icon: "🚫", title: "Product-Market Fit Miss", desc: "Build the wrong product, target wrong customers, and watch retention collapse despite strong press.", sev: "Moderate" },
];

const STATS = [
  { num: "90%",  label: "Startup Failure Rate" },
  { num: "50+",  label: "Failure Scenarios" },
  { num: "3",    label: "AI Methods" },
  { num: "500+", label: "Post-Mortems Analyzed" },
];

/* ─── SimPreview Component ───────────────────────────────────── */
function SimPreview() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="sim-preview">
      <div className="sim-preview-header">
        <div className="sim-dot r" />
        <div className="sim-dot y" />
        <div className="sim-dot g" />
        <span className="sim-preview-title">STARTFAIL SIM · SCENARIO ENGINE</span>
      </div>
      <div className="sim-body">
        <div className="sim-scenario-label">Active Scenario</div>
        <div className="sim-scenario-title">Series A Bridge Collapse</div>

        {[
          { label: "Runway Risk",       pct: "72%", cls: "fill-red"    },
          { label: "Team Cohesion",     pct: "45%", cls: "fill-orange" },
          { label: "Market Confidence", pct: "88%", cls: "fill-teal"   },
        ].map((m) => (
          <div className="sim-meter" key={m.label}>
            <div className="sim-meter-label">
              <span>{m.label}</span>
              <span>{m.pct}</span>
            </div>
            <div className="sim-meter-bar">
              <div className={`sim-meter-fill ${m.cls}`} />
            </div>
          </div>
        ))}

        <div className="sim-decision-area">
          <div className="sim-decision-q">
            Your lead investor just cut their commitment by 40%. What do you do?
          </div>
          <div className="sim-choices">
            {[
              "A → Accelerate fundraising outreach",
              "B → Cut burn rate immediately",
              "C → Pivot to revenue-generating features",
            ].map((c, i) => (
              <button
                key={i}
                className={`sim-choice${selected === i ? " selected" : ""}`}
                onClick={() => setSelected(i)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Home Page ──────────────────────────────────────────────── */
export default function Home({ onLoginClick, onSimulateClick }) {
  const revealRefs = useRef([]);

  /* Scroll-reveal observer */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      }),
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addRef = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  /* Typing animation for hero */
  const [typed, setTyped] = useState("");
  const words = ["Startup Failure.", "Runway Collapse.", "Market Timing.", "Founder Conflict."];
  const wordRef = useRef(0);
  const charRef = useRef(0);
  const deleting = useRef(false);

  useEffect(() => {
    const tick = () => {
      const word = words[wordRef.current];
      if (!deleting.current) {
        setTyped(word.slice(0, charRef.current + 1));
        charRef.current++;
        if (charRef.current === word.length) {
          deleting.current = true;
          setTimeout(tick, 1800);
          return;
        }
      } else {
        setTyped(word.slice(0, charRef.current - 1));
        charRef.current--;
        if (charRef.current === 0) {
          deleting.current = false;
          wordRef.current = (wordRef.current + 1) % words.length;
        }
      }
      setTimeout(tick, deleting.current ? 55 : 85);
    };
    const t = setTimeout(tick, 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="page-wrapper">
      {/* Background */}
      <div className="grid-bg" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="nav-logo">
          <div className="nav-logo-icon">⚠</div>
          StartFail·Sim
        </div>
        <ul className="nav-links">
          <li><a href="#methods">Methods</a></li>
          <li><a href="#simulate">Simulate</a></li>
          <li><a href="#scenarios">Scenarios</a></li>
          <li><a href="#about">About</a></li>
        </ul>
        <button className="nav-cta" onClick={onSimulateClick}>Launch Simulation</button>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Memoir Research Platform · 2025
        </div>

        <h1 className="hero-title">
          <span className="line">Simulate</span>
          <span className="line glow-word">{typed}<span className="cursor" /></span>
          <span className="line accent-word">Survive.</span>
        </h1>

        <p className="hero-sub">
          An AI-powered simulation platform that recreates real startup failure scenarios
          using Decision Trees, Dynamic Functions, and Expert Rules — so founders learn
          before they burn.
        </p>

        <div className="hero-actions">
          <button className="btn-primary" onClick={onSimulateClick}>Start Simulation →</button>
          <button className="btn-secondary" onClick={onLoginClick}>Login →</button>
        </div>

        <div className="stats-strip">
          {STATS.map((s) => (
            <div className="stat-item" key={s.label}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Methods Section ── */}
      <section className="section methods-section" id="methods">
        <div ref={addRef} className="reveal">
          <div className="section-tag">// AI Methodology</div>
          <h2 className="section-title">Three Engines.<br />One Platform.</h2>
          <p className="section-sub">
            Each method captures a different dimension of startup failure intelligence —
            combined, they produce a comprehensive risk simulation.
          </p>
        </div>

        <div className="methods-grid" ref={addRef} style={{ transitionDelay: "0.15s" }}>
          {METHODS.map((m, i) => (
            <div className={`method-card reveal`} key={i} ref={addRef} style={{ transitionDelay: `${0.1 * i}s` }}>
              <div className="method-accent-bar" />
              <div className="method-number">{m.num} / 03</div>
              <div className="method-icon">{m.icon}</div>
              <div className="method-title">{m.title}</div>
              <div className="method-desc">{m.desc}</div>
              <div className="method-tags">
                {m.tags.map((t) => (
                  <span className="method-tag" key={t}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Simulate Section ── */}
      <section className="section" id="simulate">
        <div className="features-layout">
          <div>
            <div className="section-tag reveal" ref={addRef}>// Platform Features</div>
            <h2 className="section-title reveal" ref={addRef}>Built for<br />Risk Awareness.</h2>
            <p className="section-sub reveal" ref={addRef}>
              Every feature is designed to surface hidden failure modes
              before they become terminal — actionable intelligence, not just analytics.
            </p>
            <div className="features-list">
              {FEATURES.map((f, i) => (
                <div className="feature-item reveal" key={i} ref={addRef} style={{ transitionDelay: `${0.08 * i}s` }}>
                  <div className={`feature-dot ${f.dot}`} />
                  <div>
                    <div className="feature-title">{f.title}</div>
                    <div className="feature-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal" ref={addRef} style={{ transitionDelay: "0.2s" }}>
            <SimPreview />
          </div>
        </div>
      </section>

      {/* ── Risk Scenarios ── */}
      <section className="section risks-section" id="scenarios">
        <div className="reveal" ref={addRef}>
          <div className="section-tag">// Failure Scenarios</div>
          <h2 className="section-title">The Most Common<br />Killing Blows.</h2>
          <p className="section-sub">
            Drawn from 500+ real startup post-mortems. Each scenario is parameterized,
            replayable, and linked to real-world case studies.
          </p>
        </div>

        <div className="risks-grid">
          {RISKS.map((r, i) => (
            <div className={`risk-card ${r.cls} reveal`} key={i} ref={addRef} style={{ transitionDelay: `${0.1 * i}s` }}>
              <div className="risk-icon">{r.icon}</div>
              <div className="risk-title">{r.title}</div>
              <div className="risk-desc">{r.desc}</div>
              <span className="risk-severity">{r.sev} Severity</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="cta-section">
        <h2 className="cta-title reveal" ref={addRef}>
          Ready to<br />
          <span style={{ color: "var(--accent)" }}>Fail Fast</span>
          <br />and Learn Faster?
        </h2>
        <p className="cta-sub reveal" ref={addRef}>
          Join the simulation. Run your startup through 50+ failure scenarios
          and walk away with the risk awareness to survive the real thing.
        </p>
        <div className="reveal" ref={addRef}>
          <button className="btn-primary" onClick={onSimulateClick} style={{ fontSize: "0.8rem", padding: "18px 48px" }}>
            Launch Your First Simulation →
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-logo">⚠ StartFail·Sim</div>
        <p className="footer-copy">© 2025 — Memoir Research Project</p>
        <ul className="footer-links">
          <li><a href="#methods">Methodology</a></li>
          <li><a href="#scenarios">Scenarios</a></li>
          <li><a href="#about">About</a></li>
        </ul>
      </footer>
    </div>
  );
}