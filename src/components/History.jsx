import { useState, useMemo } from "react";
import "./History.css";

const ALL_HISTORY = [
  { id:1,  date:"28 Mar 2025", scenario:"Crise de trésorerie — Série A",       method:"all",          risk:0.78, verdict:"Critique", duration:"2m 14s" },
  { id:2,  date:"25 Mar 2025", scenario:"Faible PMF — B2C SaaS",               method:"decision_tree", risk:0.61, verdict:"Élevé",    duration:"1m 42s" },
  { id:3,  date:"22 Mar 2025", scenario:"Conflit co-fondateurs",                method:"rules",         risk:0.54, verdict:"Élevé",    duration:"1m 08s" },
  { id:4,  date:"18 Mar 2025", scenario:"Dette technique critique",             method:"function",      risk:0.42, verdict:"Modéré",   duration:"1m 55s" },
  { id:5,  date:"14 Mar 2025", scenario:"Entrée marché — FinTech",              method:"all",           risk:0.29, verdict:"Modéré",   duration:"2m 31s" },
  { id:6,  date:"10 Mar 2025", scenario:"Runway 6 mois restants",              method:"decision_tree", risk:0.71, verdict:"Critique",  duration:"1m 19s" },
  { id:7,  date:"06 Mar 2025", scenario:"Scalabilité insuffisante",             method:"function",      risk:0.38, verdict:"Modéré",   duration:"1m 44s" },
  { id:8,  date:"02 Mar 2025", scenario:"Risque réglementaire — LegalTech",    method:"rules",         risk:0.65, verdict:"Élevé",    duration:"1m 02s" },
  { id:9,  date:"26 Fév 2025", scenario:"Équipe fragile — early stage",         method:"all",           risk:0.57, verdict:"Élevé",    duration:"2m 08s" },
  { id:10, date:"22 Fév 2025", scenario:"PMF fort — croissance organique",      method:"decision_tree", risk:0.18, verdict:"Faible",   duration:"1m 33s" },
];

const CHART_HISTORY = ALL_HISTORY.slice().reverse();

const methodBadge = m => ({
  decision_tree: { cls:"m-dt",    label:"🌳 DT" },
  function:      { cls:"m-fn",    label:"⚙️ Fonction" },
  rules:         { cls:"m-rules", label:"📋 Rules" },
  all:           { cls:"m-all",   label:"⚡ All ×3" },
}[m] || { cls:"m-all", label:m });

const riskCls = v => v>0.65?"r-crit":v>0.45?"r-high":"r-mod";
const scoreCls= v => v>0.65?"sc-crit":v>0.45?"sc-high":"sc-mod";

function HistoryChart({ data }) {
  const W=640, H=150, P={t:14,r:16,b:26,l:38};
  const iW=W-P.l-P.r, iH=H-P.t-P.b;
  const n=data.length;
  const x=i=>P.l+(i/(n-1))*iW;
  const y=v=>P.t+(1-v)*iH;
  const path=data.map((d,i)=>`${i===0?"M":"L"}${x(i)},${y(d.risk)}`).join(" ");
  const area=`${path} L${x(n-1)},${y(0)} L${x(0)},${y(0)} Z`;
  const ticks=[0.25,0.5,0.75];
  return (
    <div>
      <svg className="his-chart-svg" viewBox={`0 0 ${W} ${H}`}>
        {ticks.map(t=>(
          <g key={t}>
            <line className="his-chart-grid" x1={P.l} y1={y(t)} x2={W-P.r} y2={y(t)}/>
            <text className="his-chart-lbl" x={P.l-6} y={y(t)+3} textAnchor="end">{Math.round(t*100)}%</text>
          </g>
        ))}
        {data.map((d,i)=>(
          <text key={i} className="his-chart-lbl" x={x(i)} y={H-4} textAnchor="middle">S{i+1}</text>
        ))}
        <path d={area} fill="var(--accent)" className="his-chart-area"/>
        <path d={path} stroke="var(--accent)" className="his-chart-line"/>
        {data.map((d,i)=>(
          <circle key={i} className="his-chart-dot" cx={x(i)} cy={y(d.risk)} r={3.5}
            fill={d.risk>0.65?"var(--accent)":d.risk>0.45?"var(--accent2)":"var(--accent3)"}/>
        ))}
      </svg>
      <div className="his-chart-leg">
        <div className="his-chart-leg-item"><div className="his-chart-leg-dot" style={{background:"var(--accent)"}}/>Critique (&gt;65%)</div>
        <div className="his-chart-leg-item"><div className="his-chart-leg-dot" style={{background:"var(--accent2)"}}/>Élevé (45–65%)</div>
        <div className="his-chart-leg-item"><div className="his-chart-leg-dot" style={{background:"var(--accent3)"}}/>Modéré (&lt;45%)</div>
      </div>
    </div>
  );
}

export default function History({ onBack, onSimulate }) {
  const [search,      setSearch]      = useState("");
  const [filterMethod,setFilterMethod]= useState("all");
  const [filterRisk,  setFilterRisk]  = useState("all");

  const filtered = useMemo(() => {
    return ALL_HISTORY.filter(h => {
      const matchSearch = h.scenario.toLowerCase().includes(search.toLowerCase());
      const matchMethod = filterMethod==="all" || h.method===filterMethod;
      const matchRisk   =
        filterRisk==="all"      ||
        (filterRisk==="critique" && h.risk>0.65) ||
        (filterRisk==="eleve"    && h.risk>0.45 && h.risk<=0.65) ||
        (filterRisk==="modere"   && h.risk<=0.45);
      return matchSearch && matchMethod && matchRisk;
    });
  }, [search, filterMethod, filterRisk]);

  return (
    <div className="his-page">
      <header className="his-top">
        <div className="his-top-logo">⚠</div>
        <div className="his-top-title">StartFail · Sim</div>
        <div className="his-top-sep"/>
        <div className="his-top-sub">// Historique</div>
        <div className="his-top-right">
          <button className="his-back" onClick={onSimulate}>▶ Nouvelle simulation</button>
          <button className="his-back" onClick={onBack}>← Dashboard</button>
        </div>
      </header>

      <div className="his-body">
        {/* Header */}
        <div className="his-hd">
          <div className="his-hd-left">
            <div className="his-tag">// Historique des simulations</div>
            <div className="his-title">Toutes vos simulations</div>
            <div className="his-sub">{ALL_HISTORY.length} simulations enregistrées — filtrez et analysez vos résultats</div>
          </div>
        </div>

        {/* Filters */}
        <div className="his-filters">
          <div className="his-search-wrap">
            <span className="his-search-icon">🔍</span>
            <input className="his-search" placeholder="Rechercher un scénario…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          {[
            {id:"all",          label:"Toutes méthodes", cls:""},
            {id:"decision_tree",label:"🌳 DT",           cls:""},
            {id:"function",     label:"⚙️ Fonction",     cls:"f-teal"},
            {id:"rules",        label:"📋 Rules",         cls:"f-purple"},
          ].map(f=>(
            <button key={f.id} className={`his-filter-btn ${f.cls}${filterMethod===f.id?" active":""}`} onClick={()=>setFilterMethod(f.id)}>{f.label}</button>
          ))}
          <div className="his-top-sep"/>
          {[
            {id:"all",      label:"Tous niveaux"},
            {id:"critique", label:"Critique"},
            {id:"eleve",    label:"Élevé",   cls:"f-orange"},
            {id:"modere",   label:"Modéré",  cls:"f-teal"},
          ].map(f=>(
            <button key={f.id} className={`his-filter-btn ${f.cls||""}${filterRisk===f.id?" active":""}`} onClick={()=>setFilterRisk(f.id)}>{f.label}</button>
          ))}
        </div>

        {/* Chart */}
        <div className="his-chart-card">
          <div className="his-chart-hd">
            <div className="his-chart-title">Évolution du risque — {CHART_HISTORY.length} simulations</div>
            <div className="his-chart-tag">// Score global par simulation</div>
          </div>
          <HistoryChart data={CHART_HISTORY}/>
        </div>

        {/* Table */}
        <div className="his-table-card">
          <div className="his-table-hd">
            <div className="his-chart-title">Détail des simulations</div>
            <div className="his-count">{filtered.length} résultat{filtered.length!==1?"s":""}</div>
          </div>
          {filtered.length === 0 ? (
            <div className="his-empty">
              <div className="his-empty-icon">🔍</div>
              <div className="his-empty-txt">Aucune simulation ne correspond à vos filtres</div>
            </div>
          ) : (
            <table className="his-table">
              <thead>
                <tr>
                  <th>Scénario</th>
                  <th>Méthode</th>
                  <th>Score</th>
                  <th>Niveau</th>
                  <th>Durée</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(h=>{
                  const mb=methodBadge(h.method);
                  return (
                    <tr key={h.id}>
                      <td>{h.scenario}</td>
                      <td><span className={`tbl-method ${mb.cls}`}>{mb.label}</span></td>
                      <td><span className={`tbl-score ${scoreCls(h.risk)}`}>{Math.round(h.risk*100)}%</span></td>
                      <td><span className={`tbl-risk ${riskCls(h.risk)}`}>{h.verdict}</span></td>
                      <td className="tbl-date">{h.duration}</td>
                      <td className="tbl-date">{h.date}</td>
                      <td><button className="tbl-btn" onClick={onSimulate}>Rejouer</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}