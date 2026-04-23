import { useState } from "react";
import "./Dashboard.css";

/* ── Mock data ───────────────────────────────────────────────── */
const HISTORY = [
  { id: 1, date: "28 Mar 2025", scenario: "Crise de trésorerie — Série A",  method: "all",           risk: 0.78, verdict: "Critique" },
  { id: 2, date: "25 Mar 2025", scenario: "Faible PMF — B2C SaaS",          method: "decision_tree",  risk: 0.61, verdict: "Élevé"    },
  { id: 3, date: "22 Mar 2025", scenario: "Conflit fondateurs",              method: "rules",          risk: 0.54, verdict: "Élevé"    },
  { id: 4, date: "18 Mar 2025", scenario: "Dette technique critique",        method: "function",       risk: 0.42, verdict: "Modéré"   },
  { id: 5, date: "14 Mar 2025", scenario: "Entrée marché — FinTech",         method: "all",            risk: 0.29, verdict: "Modéré"   },
  { id: 6, date: "10 Mar 2025", scenario: "Runway 6 mois restants",         method: "decision_tree",  risk: 0.71, verdict: "Critique"  },
];

const SAVED = [
  { cls: "sc-a", name: "Crise Runway", risk: "78% — Critique", desc: "Trésorerie épuisée sous 6 mois, burn rate élevé, PMF insuffisant.", tags: ["Financier", "Critique"] },
  { cls: "sc-b", name: "PMF Miss",     risk: "52% — Élevé",    desc: "Produit sans adéquation marché claire, traction quasi nulle.", tags: ["Marché", "Élevé"] },
  { cls: "sc-c", name: "Tech Debt",    risk: "44% — Modéré",   desc: "Dette technique > 70%, scalabilité compromise, équipe épuisée.", tags: ["Tech", "Modéré"] },
  { cls: "sc-d", name: "Team Split",   risk: "61% — Élevé",    desc: "Conflit co-fondateurs, cohésion équipe < 40%, décisions bloquées.", tags: ["Org", "Élevé"] },
];

/* ── Chart data — évolution du risque (8 dernières semaines) ── */
const CHART_DATA = [
  { label: "S1",  dt: 0.45, fn: 0.42, rules: 0.48 },
  { label: "S2",  dt: 0.52, fn: 0.49, rules: 0.55 },
  { label: "S3",  dt: 0.48, fn: 0.45, rules: 0.50 },
  { label: "S4",  dt: 0.61, fn: 0.58, rules: 0.63 },
  { label: "S5",  dt: 0.71, fn: 0.68, rules: 0.74 },
  { label: "S6",  dt: 0.65, fn: 0.62, rules: 0.67 },
  { label: "S7",  dt: 0.54, fn: 0.51, rules: 0.57 },
  { label: "S8",  dt: 0.78, fn: 0.75, rules: 0.80 },
];

/* ── Helpers ─────────────────────────────────────────────────── */
const riskCls = v => v > 0.65 ? "r-crit" : v > 0.45 ? "r-high" : "r-mod";

const methodBadge = (m) => {
  const map = {
    decision_tree: { cls: "m-dt",    label: "🌳 DT" },
    function:      { cls: "m-fn",    label: "⚙️ Fonction" },
    rules:         { cls: "m-rules", label: "📋 Rules" },
    all:           { cls: "m-all",   label: "⚡ All ×3" },
  };
  return map[m] || { cls: "m-all", label: m };
};

/* ── Inline SVG Line Chart ───────────────────────────────────── */
function RiskChart() {
  const W = 600, H = 160, PAD = { top: 16, right: 16, bottom: 28, left: 36 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const n = CHART_DATA.length;

  const xPos = (i) => PAD.left + (i / (n - 1)) * innerW;
  const yPos = (v) => PAD.top + (1 - v) * innerH;

  const makePath = (key) =>
    CHART_DATA.map((d, i) => `${i === 0 ? "M" : "L"}${xPos(i)},${yPos(d[key])}`).join(" ");

  const makeArea = (key) =>
    `${makePath(key)} L${xPos(n - 1)},${yPos(0)} L${xPos(0)},${yPos(0)} Z`;

  const LINES = [
    { key: "dt",    color: "#e63946", label: "Decision Tree" },
    { key: "fn",    color: "#2ec4b6", label: "Modèle Fonctionnel" },
    { key: "rules", color: "#a78bfa", label: "Système de Règles" },
  ];

  // Y grid lines
  const yTicks = [0.2, 0.4, 0.6, 0.8];

  return (
    <div className="db-chart-wrap">
      <svg className="db-chart-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        {/* Grid */}
        {yTicks.map(t => (
          <g key={t}>
            <line
              className="db-chart-grid"
              x1={PAD.left} y1={yPos(t)}
              x2={W - PAD.right} y2={yPos(t)}
            />
            <text className="db-chart-label" x={PAD.left - 6} y={yPos(t) + 3} textAnchor="end">
              {Math.round(t * 100)}%
            </text>
          </g>
        ))}

        {/* X labels */}
        {CHART_DATA.map((d, i) => (
          <text key={i} className="db-chart-label" x={xPos(i)} y={H - 4} textAnchor="middle">
            {d.label}
          </text>
        ))}

        {/* Areas + Lines + Dots */}
        {LINES.map(l => (
          <g key={l.key}>
            <path d={makeArea(l.key)} fill={l.color} className="db-chart-area" />
            <path d={makePath(l.key)} stroke={l.color} className="db-chart-line" />
            {CHART_DATA.map((d, i) => (
              <circle
                key={i}
                className="db-chart-dot"
                cx={xPos(i)} cy={yPos(d[l.key])}
                r={3} fill={l.color}
              />
            ))}
          </g>
        ))}
      </svg>

      <div className="db-chart-legend">
        {LINES.map(l => (
          <div key={l.key} className="db-chart-leg-item">
            <div className="db-chart-leg-dot" style={{ background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DASHBOARD COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default function Dashboard({ onSimulate, onBack, onHistory, onRecommendations, onProfile, user }) {
  const [activeNav, setActiveNav] = useState("dashboard");

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });

  const avgRisk = (HISTORY.reduce((a, h) => a + h.risk, 0) / HISTORY.length * 100).toFixed(0);

  return (
    <div className="db-shell">

      {/* ══ Sidebar ══ */}
      <aside className="db-sidebar">
        <div className="db-brand">
          <div className="db-brand-icon">⚠</div>
          <div className="db-brand-name">StartFail·Sim</div>
        </div>

        {[
          { id: "dashboard",       icon: "📊", label: "Dashboard",        action: () => {} },
          { id: "simulation",      icon: "⚡", label: "Simulation",       action: onSimulate },
          { id: "history",         icon: "📋", label: "Historique",       action: onHistory },
          { id: "recommendations", icon: "💡", label: "Recommandations",  action: onRecommendations },
          { id: "profile",         icon: "👤", label: "Profil",           action: onProfile },
        ].map(n => (
          <button
            key={n.id}
            className={`db-nav-item${activeNav === n.id ? " active" : ""}`}
            onClick={() => { setActiveNav(n.id); n.action(); }}
          >
            <span className="db-nav-icon">{n.icon}</span>
            <span className="db-nav-label">{n.label}</span>
            <div className="db-nav-dot" />
          </button>
        ))}

        <div className="db-sidebar-spacer" />
        <div className="db-nav-divider" />

        <button className="db-nav-item" onClick={onBack}>
          <span className="db-nav-icon">🏠</span>
          <span className="db-nav-label">Accueil</span>
        </button>

        <div className="db-user" onClick={onProfile} style={{cursor:"pointer"}}>
          <div className="db-user-avatar">
            {`${user?.firstName?.[0]||""}${user?.lastName?.[0]||""}`.toUpperCase()}
          </div>
          <div>
            <div className="db-user-name">{user?.firstName} {user?.lastName}</div>
            <div className="db-user-role">Chercheur →</div>
          </div>
        </div>
      </aside>

      {/* ══ Topbar ══ */}
      <header className="db-topbar">
        <div className="db-topbar-title">Dashboard</div>
        <div className="db-topbar-sep" />
        <div className="db-topbar-sub">// Vue d'ensemble</div>
        <div className="db-topbar-right">
          <button className="db-sim-btn" onClick={onSimulate}>
            ▶ Nouvelle simulation
          </button>
          <button className="db-topbar-back" onClick={onBack}>← Accueil</button>
        </div>
      </header>

      {/* ══ Main ══ */}
      <main className="db-main">

        {/* Welcome */}
        <div className="db-welcome">
          <div>
            <div className="db-welcome-title">
              Bonjour, <span>{user?.firstName || "Ada"}</span> 👋
            </div>
            <div className="db-welcome-sub">
              Voici l'état de vos simulations — plateforme StartFail·Sim
            </div>
          </div>
          <div className="db-welcome-date">{today}</div>
        </div>

        {/* Stats */}
        <div className="db-stats">
          {[
            { cls:"s1", icon:"⚡", val: HISTORY.length,  label:"Simulations totales",   delta:"+2",  up:true  },
            { cls:"s2", icon:"📊", val: `${avgRisk}%`,    label:"Risque moyen global",   delta:"-5%", up:false },
            { cls:"s3", icon:"📁", val: SAVED.length,     label:"Scénarios sauvegardés", delta:"+1",  up:true  },
            { cls:"s4", icon:"🎯", val: "3",               label:"Méthodes d'analyse",    delta:"",    up:null  },
          ].map((s, i) => (
            <div key={i} className={`db-stat ${s.cls}`}>
              <div className="db-stat-icon">{s.icon}</div>
              <div className="db-stat-val">{s.val}</div>
              <div className="db-stat-label">{s.label}</div>
              {s.delta && (
                <div className={`db-stat-delta ${s.up ? "delta-up" : "delta-down"}`}>
                  {s.up ? "↑" : "↓"} {s.delta}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Chart + Quick actions */}
        <div className="db-mid">

          {/* Line chart */}
          <div className="db-chart-card">
            <div className="db-card-hd">
              <div className="db-card-title">Évolution du risque — 8 dernières semaines</div>
              <div className="db-card-tag">// Comparaison méthodes</div>
            </div>
            <RiskChart />
          </div>

          {/* Quick actions */}
          <div className="db-quick">
            <div className="db-card-hd">
              <div className="db-card-title">Actions rapides</div>
            </div>

            <button className="db-quick-btn primary" onClick={onSimulate}>
              <span className="db-quick-ico">⚡</span>
              <div className="db-quick-txt">
                <div className="db-quick-name">Nouvelle simulation</div>
                <div className="db-quick-sub">Decision Tree · Fonction · Rules</div>
              </div>
              <span className="db-quick-arr">→</span>
            </button>

            {[
              { ico:"🌳", name:"Decision Tree",       sub:"Simulation IA probabiliste",  action: onSimulate },
              { ico:"⚙️", name:"Modèle Fonctionnel",  sub:"Formule Sterman pondérée",    action: onSimulate },
              { ico:"📋", name:"Système de Règles",   sub:"14 règles expertes actives",  action: onSimulate },
              { ico:"📥", name:"Exporter rapport",    sub:"PDF — dernière simulation",   action: () => {} },
            ].map((b, i) => (
              <button key={i} className="db-quick-btn" onClick={b.action}>
                <span className="db-quick-ico">{b.ico}</span>
                <div className="db-quick-txt">
                  <div className="db-quick-name">{b.name}</div>
                  <div className="db-quick-sub">{b.sub}</div>
                </div>
                <span className="db-quick-arr">→</span>
              </button>
            ))}
          </div>
        </div>

        {/* History + Saved */}
        <div className="db-bottom">

          {/* History */}
          <div className="db-history-card">
            <div style={{ padding:"18px 20px", borderBottom:"1px solid var(--border)" }}>
              <div className="db-card-hd" style={{ marginBottom:0 }}>
                <div className="db-card-title">Historique des simulations</div>
                <button
                  onClick={onHistory}
                  style={{background:"none",border:"none",cursor:"pointer",fontFamily:"var(--font-mono)",fontSize:".58rem",letterSpacing:".08em",textTransform:"uppercase",color:"var(--accent3)"}}
                >
                  Voir tout →
                </button>
              </div>
            </div>
            <table className="db-table">
              <thead>
                <tr>
                  <th>Scénario</th>
                  <th>Méthode</th>
                  <th>Risque</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {HISTORY.map(h => {
                  const mb = methodBadge(h.method);
                  return (
                    <tr key={h.id}>
                      <td>{h.scenario}</td>
                      <td>
                        <span className={`db-tbl-method ${mb.cls}`}>{mb.label}</span>
                      </td>
                      <td>
                        <span className={`db-risk-pill ${riskCls(h.risk)}`}>
                          {Math.round(h.risk * 100)}% — {h.verdict}
                        </span>
                      </td>
                      <td className="db-tbl-date">{h.date}</td>
                      <td>
                        <button className="db-tbl-btn" onClick={onHistory}>Voir détail</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Saved scenarios */}
          <div className="db-saved-card">
            <div className="db-card-hd">
              <div className="db-card-title">Scénarios sauvegardés</div>
              <button
                onClick={onRecommendations}
                style={{background:"none",border:"none",cursor:"pointer",fontFamily:"var(--font-mono)",fontSize:".58rem",letterSpacing:".08em",textTransform:"uppercase",color:"var(--accent4)"}}
              >
                Recommandations →
              </button>
            </div>

            {SAVED.map((s, i) => (
              <div key={i} className={`db-scenario ${s.cls}`} onClick={onHistory} style={{cursor:"pointer"}}>
                <div className="db-sc-top">
                  <div className="db-sc-name">{s.name}</div>
                  <div className="db-sc-risk">{s.risk}</div>
                </div>
                <div className="db-sc-desc">{s.desc}</div>
                <div className="db-sc-tags">
                  {s.tags.map(t => (
                    <span key={t} className="db-sc-tag">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}