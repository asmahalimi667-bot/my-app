import "./Recommendations.css";

/* ── Mock last simulation result ─────────────────────────────── */
const LAST_SIM = {
  R: 0.61,
  target: 0.28,
  Rfin: 0.72, Rmkt: 0.58, Rstr: 0.45,
  Rorg: 0.38, Rtech: 0.52, Rext: 0.15,
};

const PLAN = {
  court: {
    icon:"🚨", label:"Court terme", badge:"0–30 jours", cls:"col-court",
    items: [
      { txt:"Réduire immédiatement le burn rate de 25–30% — suspendre les dépenses non-critiques.", tag:"Financier" },
      { txt:"Conduire 20 entretiens clients pour valider/invalider les hypothèses PMF actuelles.", tag:"Marché" },
      { txt:"Identifier et résoudre les 3 principaux points de friction équipe.", tag:"Organisationnel" },
    ],
  },
  moyen: {
    icon:"⚡", label:"Moyen terme", badge:"1–3 mois", cls:"col-moyen",
    items: [
      { txt:"Lancer une campagne de bridge financing — préparer un deck investisseur actualisé.", tag:"Financier" },
      { txt:"Réaligner le roadmap produit sur les signaux marché — prioriser les features à forte rétention.", tag:"Stratégique" },
      { txt:"Mettre en place un plan de réduction de la dette technique — sprint dédié.", tag:"Tech" },
    ],
  },
  long: {
    icon:"🎯", label:"Long terme", badge:"3–6 mois", cls:"col-long",
    items: [
      { txt:"Atteindre un runway de 18+ mois avant la prochaine levée de fonds.", tag:"Financier" },
      { txt:"Atteindre un NPS > 40 et un taux de rétention M1 > 60% comme signal PMF solide.", tag:"Marché" },
      { txt:"Documenter et automatiser les processus clés pour réduire la dépendance aux fondateurs.", tag:"Organisationnel" },
    ],
  },
};

const DIMS_REC = [
  { cls:"dim-fin",  key:"Rfin",  label:"Financier",      rec:"Réduire le burn rate et sécuriser un runway > 12 mois avant toute croissance aggressive." },
  { cls:"dim-mkt",  key:"Rmkt",  label:"Marché",          rec:"Intensifier la validation client — le PMF score doit dépasser 0.6 avant de scaler." },
  { cls:"dim-str",  key:"Rstr",  label:"Stratégique",     rec:"Améliorer l'agilité décisionnelle — réduire le délai de pivot à moins de 30 jours." },
  { cls:"dim-org",  key:"Rorg",  label:"Organisationnel", rec:"Renforcer la cohésion équipe — score > 0.7 pour maintenir la qualité décisionnelle." },
  { cls:"dim-tech", key:"Rtech", label:"Technologique",   rec:"Allouer 20% de la vélocité à la réduction de la dette technique chaque sprint." },
  { cls:"dim-ext",  key:"Rext",  label:"Externe",         rec:"Surveiller l'environnement réglementaire — consulter un expert légal si risque > 30%." },
];

const BENCHMARKS = [
  { cls:"bench-a", sector:"SaaS B2B",    val:"34%", label:"Risque moyen sectoriel",   vs:"+27pts vs vous", better:false },
  { cls:"bench-b", sector:"FinTech",     val:"48%", label:"Risque moyen sectoriel",   vs:"+13pts vs vous", better:false },
  { cls:"bench-c", sector:"Top 10%",     val:"18%", label:"Startups les + solides",   vs:"+43pts à combler",better:false },
  { cls:"bench-d", sector:"Objectif",    val:"28%", label:"Cible recommandée 6 mois", vs:"−33pts possibles",better:true },
];

const scoreCls = v => v>0.65?"sc-crit":v>0.45?"sc-high":"sc-mod";

export default function Recommendations({ onBack, onSimulate }) {
  const improvement = Math.round((LAST_SIM.R - LAST_SIM.target) * 100);
  const pct = Math.round((improvement / (LAST_SIM.R * 100)) * 100);

  return (
    <div className="rec-page">
      <header className="rec-top">
        <div className="rec-top-logo">⚠</div>
        <div className="rec-top-title">StartFail · Sim</div>
        <div className="rec-top-sep"/>
        <div className="rec-top-sub">// Recommandations</div>
        <div className="rec-top-right">
          <button className="rec-back" onClick={onSimulate}>▶ Nouvelle simulation</button>
          <button className="rec-back" onClick={onBack}>← Dashboard</button>
        </div>
      </header>

      <div className="rec-body">

        {/* Page header */}
        <div className="rec-page-hd">
          <div>
            <div className="rec-tag">// Analyse & Recommandations</div>
            <div className="rec-title">Plan d'action personnalisé</div>
            <div className="rec-sub">Basé sur votre dernière simulation — Score global : {Math.round(LAST_SIM.R*100)}% · Risque Élevé. Voici comment réduire votre risque d'échec de {improvement} points.</div>
          </div>
        </div>

        {/* Score amélioration */}
        <div className="rec-score-card">
          <div className="rec-score-left">
            <div className="rec-score-current">{Math.round(LAST_SIM.R*100)}%</div>
            <div className="rec-score-lbl">Score actuel</div>
          </div>
          <div className="rec-score-arrow">→</div>
          <div style={{textAlign:"center",flexShrink:0}}>
            <div className="rec-score-target">{Math.round(LAST_SIM.target*100)}%</div>
            <div className="rec-score-lbl">Cible 6 mois</div>
          </div>
          <div className="rec-score-info">
            <div className="rec-score-info-title">Réduction possible : −{improvement} points ({pct}%)</div>
            <div className="rec-score-info-desc">
              En appliquant les recommandations ci-dessous, votre startup peut atteindre un niveau de risque modéré en 6 mois. Les actions financières et marché ont le plus fort impact.
            </div>
            <div className="rec-improvement-bar">
              <div className="rec-improvement-fill" style={{width:`${pct}%`}}/>
            </div>
            <div className="rec-improvement-labels">
              <span>Situation actuelle</span>
              <span>Potentiel d'amélioration : {pct}%</span>
            </div>
          </div>
        </div>

        {/* Plan d'action 3 colonnes */}
        <div className="rec-plan">
          <div className="rec-plan-title">Plan d'action — 3 horizons temporels</div>
          <div className="rec-plan-grid">
            {Object.values(PLAN).map(col => (
              <div key={col.cls} className={`rec-plan-col ${col.cls}`}>
                <div className="rec-plan-col-hd">
                  <span className="rec-plan-col-icon">{col.icon}</span>
                  <span className="rec-plan-col-label">{col.label}</span>
                  <span className="rec-plan-col-badge">{col.badge}</span>
                </div>
                <div className="rec-plan-items">
                  {col.items.map((item,i) => (
                    <div key={i} className="rec-plan-item">
                      <span className="rec-plan-item-num">0{i+1}</span>
                      <div>
                        <div className="rec-plan-item-txt">{item.txt}</div>
                        <span className="rec-plan-item-tag">{item.tag}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommandations par dimension */}
        <div className="rec-dims">
          <div className="rec-dims-title">Recommandations par dimension de risque</div>
          <div className="rec-dims-grid">
            {DIMS_REC.map(d => (
              <div key={d.key} className={`rec-dim-card ${d.cls}`}>
                <div className="rec-dim-hd">
                  <div className="rec-dim-name">{d.label}</div>
                  <div className={`rec-dim-score ${scoreCls(LAST_SIM[d.key])}`}>
                    {Math.round(LAST_SIM[d.key]*100)}%
                  </div>
                </div>
                <div className="rec-dim-bar">
                  <div className="rec-dim-fill" style={{width:`${LAST_SIM[d.key]*100}%`}}/>
                </div>
                <div className="rec-dim-rec">{d.rec}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Benchmarks */}
        <div className="rec-bench">
          <div className="rec-bench-title">Comparaison avec les benchmarks sectoriels</div>
          <div className="rec-bench-grid">
            {BENCHMARKS.map((b,i) => (
              <div key={i} className={`rec-bench-card ${b.cls}`}>
                <div className="rec-bench-sector">{b.sector}</div>
                <div className="rec-bench-val">{b.val}</div>
                <div className="rec-bench-label">{b.label}</div>
                <div className={`rec-bench-vs ${b.better?"vs-better":"vs-worse"}`}>{b.vs}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}