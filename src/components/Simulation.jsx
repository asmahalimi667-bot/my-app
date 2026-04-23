import { useState, useCallback } from "react";
import "./Simulation.css";

const API = "http://localhost:8000";

/* ══════════════════════════════════════════════════════════════
   VARIABLE GROUPS — labels clairs, pas de noms techniques
   ══════════════════════════════════════════════════════════════ */
const VAR_GROUPS = [
  {
    icon: "💰", label: "Situation Financière", color: "fin",
    vars: [
      { key: "runway_months",   label: "Mois de survie sans nouveaux revenus",  hint: "Runway",     min: 0, max: 60, step: 1,    def: 12,  pL: "0 mois",          pR: "60 mois",          fmt: v => `${v} mois` },
      { key: "burn_rate_level", label: "Niveau de dépenses mensuel",            hint: "Burn rate",  min: 0, max: 1,  step: 0.05, def: 0.4, pL: "Très faible",     pR: "Très élevé",       fmt: v => `${Math.round(v*100)}%` },
    ],
  },
  {
    icon: "📈", label: "Position sur le Marché", color: "mkt",
    vars: [
      { key: "pmf_score", label: "Le produit répond-il à un vrai besoin ?",    hint: "PMF",        min: 0, max: 1,  step: 0.05, def: 0.5, pL: "Aucune adéquation", pR: "Adéquation parfaite", fmt: v => `${Math.round(v*100)}%` },
      { key: "traction",  label: "Dynamique de croissance actuelle",            hint: "Traction",   min: 0, max: 1,  step: 0.05, def: 0.4, pL: "Nulle",            pR: "Forte",               fmt: v => `${Math.round(v*100)}%` },
    ],
  },
  {
    icon: "🧭", label: "Stratégie & Agilité", color: "str",
    vars: [
      { key: "adaptability", label: "Capacité à changer de direction rapidement", hint: "Adaptabilité", min: 0, max: 1, step: 0.05, def: 0.6, pL: "Rigide",  pR: "Très agile", fmt: v => `${Math.round(v*100)}%` },
      { key: "pivot_delay",  label: "Temps pour décider un pivot stratégique",    hint: "Délai pivot",  min: 0, max: 1, step: 0.05, def: 0.3, pL: "Rapide",  pR: "Très lent",  fmt: v => `${Math.round(v*100)}%` },
    ],
  },
  {
    icon: "👥", label: "Force de l'Équipe", color: "org",
    vars: [
      { key: "team_strength", label: "Solidité et cohésion de l'équipe fondatrice", hint: "Team", min: 0, max: 1, step: 0.05, def: 0.7, pL: "Équipe fragile", pR: "Équipe solide", fmt: v => `${Math.round(v*100)}%` },
    ],
  },
  {
    icon: "⚙️", label: "Maturité Technique", color: "tech",
    vars: [
      { key: "tech_debt",   label: "Dette technique accumulée dans le produit", hint: "Tech debt",   min: 0, max: 1, step: 0.05, def: 0.3, pL: "Nulle",        pR: "Critique",       fmt: v => `${Math.round(v*100)}%` },
      { key: "scalability", label: "Capacité du produit à supporter la croissance", hint: "Scalabilité", min: 0, max: 1, step: 0.05, def: 0.7, pL: "Non scalable", pR: "Très scalable",  fmt: v => `${Math.round(v*100)}%` },
    ],
  },
  {
    icon: "🌍", label: "Environnement Externe", color: "ext",
    vars: [
      { key: "regulatory_risk", label: "Risque réglementaire ou légal", hint: "Réglementation", min: 0, max: 1, step: 0.05, def: 0.1, pL: "Nul", pR: "Critique", fmt: v => `${Math.round(v*100)}%` },
    ],
  },
];

const DEFAULT_VARS = VAR_GROUPS.flatMap(g => g.vars).reduce((a, v) => ({ ...a, [v.key]: v.def }), {});

/* ══════════════════════════════════════════════════════════════
   METHODS — noms corrects selon mémoire
   ══════════════════════════════════════════════════════════════ */
const METHODS = [
  {
    id: "decision_tree",
    apiKey: "decision_tree",
    cls: "a-dt", rcCls: "rc-dt",
    icon: "🌳",
    name: "Decision Tree",
    subname: "Intelligence Artificielle",
    desc: "Arbre de décision IA — chemins probabilistes basés sur seuils critiques",
    badge: "AI · DT",
    color: "var(--accent)",
  },
  {
    id: "function",
    apiKey: "function",
    cls: "a-fn", rcCls: "rc-fn",
    icon: "⚙️",
    name: "Modèle Fonctionnel",
    subname: "Approche Mathématique",
    desc: "Formule pondérée R = 0.30·Rfin + 0.25·Rmkt + … — modèle systémique Sterman",
    badge: "FONCTION",
    color: "var(--accent3)",
  },
  {
    id: "rules",
    apiKey: "rules",
    cls: "a-rules", rcCls: "rc-rules",
    icon: "📋",
    name: "Système de Règles",
    subname: "Base de Règles Expertes",
    desc: "14 règles explicites Si/Alors tirées de 500+ post-mortems startups",
    badge: "RULES",
    color: "var(--accent4)",
  },
  {
    id: "all",
    apiKey: "all",
    cls: "a-all", rcCls: null,
    icon: "⚡",
    name: "Les 3 Méthodes",
    subname: "Comparaison Parallèle",
    desc: "Lance les 3 moteurs simultanément et compare leurs résultats côte à côte",
    badge: "ALL ×3",
    color: "var(--accent2)",
  },
];

/* ── Helpers ─────────────────────────────────────────────────── */
const riskVerdict = r => r > 0.65 ? "Risque Critique" : r > 0.45 ? "Risque Élevé" : r > 0.25 ? "Risque Modéré" : "Risque Faible";
const riskCls     = r => r > 0.65 ? "sc-crit" : r > 0.45 ? "sc-high" : r > 0.25 ? "sc-mod" : "sc-low";

const DIMS = [
  { key: "Rfin",  label: "Financier",       w: "0.30" },
  { key: "Rmkt",  label: "Marché",           w: "0.25" },
  { key: "Rstr",  label: "Stratégique",      w: "0.15" },
  { key: "Rorg",  label: "Organisationnel",  w: "0.15" },
  { key: "Rtech", label: "Technologique",    w: "0.10" },
  { key: "Rext",  label: "Externe",          w: "0.05" },
];

/* ══════════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default function Simulation({ onBack }) {
  const [method,   setMethod]   = useState(null);
  const [vars,     setVars]     = useState(DEFAULT_VARS);
  const [phase,    setPhase]    = useState("idle");   // idle | loading | results | error
  const [results,  setResults]  = useState(null);
  const [errMsg,   setErrMsg]   = useState("");
  const [loadStep, setLoadStep] = useState(0);

  const setVar = useCallback((key, val) => {
    setVars(p => ({ ...p, [key]: parseFloat(val) }));
  }, []);

  const sliderPct = (v, min, max) => ({ "--p": `${((v - min) / (max - min)) * 100}%` });

  /* ── Launch ── */
  const launch = async () => {
    if (!method) return;
    setPhase("loading"); setLoadStep(0); setResults(null); setErrMsg("");
    [0,1,2].forEach(i => setTimeout(() => setLoadStep(i+1), i*550));

    try {
      const res = await fetch(`${API}/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: method === "function" ? "function" : method, ...vars }),
      });
      if (!res.ok) throw new Error((await res.json()).detail || "Erreur serveur");
      const data = await res.json();
      setTimeout(() => { setResults(data); setPhase("results"); }, 1900);
    } catch (e) {
      setTimeout(() => {
        setErrMsg(e.message || "Backend inaccessible — vérifiez que le serveur tourne sur localhost:8000");
        setPhase("error");
      }, 1900);
    }
  };

  const reset = () => { setPhase("idle"); setResults(null); setMethod(null); setVars(DEFAULT_VARS); };

  /* ── Which cards to render ── */
  const activeMethods = METHODS.filter(m => m.id !== "all" && results?.[m.apiKey]);
  const colsClass = `cols-${Math.max(1, activeMethods.length)}`;

  return (
    <div className="sim-page">

      {/* Topbar */}
      <header className="sim-top">
        <div className="sim-top-logo">⚠</div>
        <div className="sim-top-title">StartFail · Sim</div>
        <div className="sim-top-sep" />
        <div className="sim-top-sub">// Plateforme de Simulation</div>
        <div className="sim-top-right">
          <button className="sim-top-back" onClick={onBack}>← Accueil</button>
        </div>
      </header>

      <div className="sim-layout">

        {/* ══ LEFT ══ */}
        <aside className="sim-left">

          {/* Step 1 — Method */}
          <div>
            <div className="sim-blk-tag">// Étape 01</div>
            <div className="sim-blk-title">Choisir la méthode</div>
            <div className="sim-blk-sub">Sélectionnez un moteur ou comparez les 3 simultanément.</div>
          </div>

          <div className="sim-methods">
            {METHODS.map(m => (
              <button
                key={m.id}
                className={`sim-meth${method === m.id ? ` ${m.cls}` : ""}`}
                onClick={() => setMethod(m.id)}
              >
                <span className="sim-meth-ico">{m.icon}</span>
                <span className="sim-meth-name">{m.name}</span>
                <span className="sim-meth-desc">{m.desc}</span>
              </button>
            ))}
          </div>

          {/* Step 2 — Variables */}
          <div>
            <div className="sim-blk-tag">// Étape 02</div>
            <div className="sim-blk-title">Variables de votre startup</div>
            <div className="sim-blk-sub">Ajustez chaque paramètre selon votre situation actuelle.</div>
          </div>

          <div className="sim-vars">
            {VAR_GROUPS.map(g => (
              <div className="var-group" key={g.label}>
                <div className="var-group-hd">
                  <span>{g.icon}</span>{g.label}
                </div>
                {g.vars.map(vr => (
                  <div className="var-item" key={vr.key}>
                    <div className="var-top">
                      <span className="var-label">{vr.label}</span>
                      <span className="var-hint">{vr.hint}</span>
                    </div>
                    <div className="var-slider-row">
                      <input
                        type="range"
                        className={`var-slider sl-${g.color}`}
                        min={vr.min} max={vr.max} step={vr.step}
                        value={vars[vr.key]}
                        style={sliderPct(vars[vr.key], vr.min, vr.max)}
                        onChange={e => setVar(vr.key, e.target.value)}
                      />
                      <span className="var-badge">{vr.fmt(vars[vr.key])}</span>
                    </div>
                    <div className="var-poles">
                      <span>{vr.pL}</span><span>{vr.pR}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Launch */}
          <div className="sim-launch-wrap">
            <button className="sim-launch" onClick={launch} disabled={!method || phase === "loading"}>
              {phase === "loading"
                ? <><span className="btn-spin" /> Analyse en cours…</>
                : "▶  Lancer la simulation"}
            </button>
            <button className="sim-reset" onClick={reset}>↺  Réinitialiser</button>
          </div>

        </aside>

        {/* ══ RIGHT ══ */}
        <section className="sim-right">

          {/* Idle */}
          {phase === "idle" && (
            <div className="sim-idle">
              <div className="sim-idle-icon">🎯</div>
              <div className="sim-idle-title">Prêt à analyser</div>
              <div className="sim-idle-sub">
                Choisissez une méthode à gauche, configurez les variables
                de votre startup, puis lancez la simulation.
                Les résultats apparaîtront ici côte à côte.
              </div>
            </div>
          )}

          {/* Loading */}
          {phase === "loading" && (
            <div className="sim-loading">
              <div className="sim-ring" />
              <div className="sim-load-txt">Calcul en cours…</div>
              <div className="sim-load-steps">
                {["Envoi des données au backend FastAPI",
                  "Exécution des moteurs sélectionnés",
                  "Calcul des dimensions de risque"].map((s, i) => (
                  <div key={i} className={`sim-load-step${loadStep > i ? " done" : ""}`}>{s}</div>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {phase === "error" && (
            <div className="sim-err">
              <div className="sim-err-title">// ERREUR CONNEXION BACKEND</div>
              {errMsg}
              <br/><br/>
              <code style={{fontSize:"0.72rem", opacity:0.6}}>
                uvicorn main:app --reload --port 8000
              </code>
            </div>
          )}

          {/* Results — side by side */}
          {phase === "results" && results && (
            <>
              <div className="sim-res-hd">
                <div className="sim-blk-tag">// Résultats de simulation</div>
                <div className="sim-blk-title">Analyse du risque d'échec</div>
                <div className="sim-blk-sub">
                  Scores calculés selon la formule Sterman pondérée — comparaison des méthodes.
                </div>
              </div>

              <div className={`sim-res-cols ${colsClass}`}>
                {activeMethods.map(m => {
                  const d = results[m.apiKey];
                  if (!d) return null;
                  return (
                    <div key={m.id} className={`sim-rcard ${m.rcCls}`}>

                      {/* Card header */}
                      <div className="sim-rcard-top">
                        <span className="sim-rcard-ico">{m.icon}</span>
                        <div style={{flex:1}}>
                          <div className="sim-rcard-name">{m.name}</div>
                          <div style={{fontSize:"0.62rem", color:"var(--muted)", fontFamily:"var(--font-mono)", letterSpacing:"0.06em"}}>
                            {m.subname}
                          </div>
                        </div>
                        <span className="sim-rcard-badge">{m.badge}</span>
                      </div>

                      <div className="sim-rcard-body">

                        {/* Score global */}
                        <div className="sim-score-row">
                          <div className={`sim-score-big ${riskCls(d.R)}`}>
                            {(d.R * 100).toFixed(1)}%
                          </div>
                          <div className="sim-score-info">
                            <div className="sim-score-lbl">Score risque global</div>
                            <div className="sim-score-vrd">{riskVerdict(d.R)}</div>
                          </div>
                        </div>

                        {/* Dimensions */}
                        <div className="sim-dims">
                          {DIMS.map(dim => (
                            <div className="sim-dim" key={dim.key}>
                              <div className="sim-dim-row">
                                <span className="sim-dim-name">
                                  {dim.label}
                                  <span style={{opacity:0.4, fontSize:"0.6rem", marginLeft:"4px"}}>×{dim.w}</span>
                                </span>
                                <span className="sim-dim-pct">{((d[dim.key]||0)*100).toFixed(0)}%</span>
                              </div>
                              <div className="sim-dim-bar">
                                <div className="sim-dim-fill" style={{width:`${(d[dim.key]||0)*100}%`}} />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Recommendation */}
                        <div className="sim-rec">
                          <div className="sim-rec-lbl">// Recommandation</div>
                          <div className="sim-rec-txt">{d.recommendation}</div>
                        </div>

                        {/* Fired rules — Rules Engine only */}
                        {m.id === "rules" && d.fired_rules?.length > 0 && (
                          <div className="sim-fired">
                            <div className="sim-fired-lbl">// Règles déclenchées</div>
                            {d.fired_rules.map((r, i) => (
                              <div key={i} className="sim-fired-item">{r}</div>
                            ))}
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="sim-res-actions">
                <button className="sim-launch" onClick={reset}>↺  Nouvelle simulation</button>
                <button className="sim-reset" onClick={onBack}>← Accueil</button>
              </div>
            </>
          )}

        </section>
      </div>
    </div>
  );
}