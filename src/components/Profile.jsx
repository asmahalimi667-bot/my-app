import { useState, useEffect } from "react";
import "./Profile.css";

const THEMES = [
  { dot:"#07080d", name:"Dark · Défaut" },
  { dot:"#0f172a", name:"Dark Navy"     },
  { dot:"#1a1a2e", name:"Midnight Blue" },
];

export default function Profile({ user, setUser, onBack, onSimulate }) {
  const [editing,   setEditing]  = useState(false);
  const [theme,     setTheme]    = useState(0);
  const [showPwd,   setShowPwd]  = useState(false);
  const [localForm, setLocalForm] = useState({ ...user });
  const [pwd,       setPwd]      = useState({ current:"", next:"", confirm:"" });

  /* Sync localForm si user change depuis App.jsx */
  useEffect(() => {
    if (!editing) setLocalForm({ ...user });
  }, [user, editing]);

  /* Save → update global state in App.jsx */
  const handleSave = () => {
    setUser({ ...localForm });
    setEditing(false);
  };

  /* Cancel → restore from global user */
  const handleCancel = () => {
    setLocalForm({ ...user });
    setEditing(false);
  };

  const initials = `${user.firstName?.[0]||""}${user.lastName?.[0]||""}`.toUpperCase();

  return (
    <div className="prof-page">
      <header className="prof-top">
        <div className="prof-top-logo">⚠</div>
        <div className="prof-top-title">StartFail · Sim</div>
        <div className="prof-top-sep"/>
        <div className="prof-top-sub">// Profil</div>
        <div className="prof-top-right">
          <button className="prof-back" onClick={onSimulate}>▶ Simulation</button>
          <button className="prof-back" onClick={onBack}>← Dashboard</button>
        </div>
      </header>

      <div className="prof-body">

        {/* ── LEFT ── */}
        <div className="prof-left">

          <div className="prof-avatar-card">
            <div className="prof-avatar">{initials}</div>
            <div className="prof-name">{user.firstName} {user.lastName}</div>
            <div className="prof-email">{user.email}</div>
            <div className="prof-role-badge">Chercheur · Mémoire</div>
            <div className="prof-member-since">Membre depuis Mars 2025</div>
          </div>

          <div className="prof-mini-stats">
            {[
              { cls:"s1", val:"10",  lbl:"Simulations" },
              { cls:"s2", val:"61%", lbl:"Risque moyen" },
              { cls:"s3", val:"4",   lbl:"Scénarios"   },
              { cls:"s4", val:"3",   lbl:"Méthodes"    },
            ].map((s,i) => (
              <div key={i} className={`prof-mini-stat ${s.cls}`}>
                <div className="prof-mini-val">{s.val}</div>
                <div className="prof-mini-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>

          <div className="prof-theme-card">
            <div className="prof-card-title">Thème de l'interface</div>
            <div className="prof-theme-options">
              {THEMES.map((t,i) => (
                <div key={i} className={`prof-theme-opt${theme===i?" selected":""}`} onClick={() => setTheme(i)}>
                  <div className="prof-theme-dot" style={{background:t.dot,border:"1px solid rgba(255,255,255,.15)"}}/>
                  <span className="prof-theme-name">{t.name}</span>
                  {theme===i && <span className="prof-theme-check">✓</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="prof-right">

          <div className="prof-form-card">
            <div className="prof-form-hd">
              <div className="prof-card-title">Informations personnelles</div>
              <div style={{display:"flex",gap:8}}>
                {editing ? (
                  <>
                    <button className="prof-edit-btn" onClick={handleCancel}>Annuler</button>
                    <button className="prof-save-btn" onClick={handleSave}>✓ Sauvegarder</button>
                  </>
                ) : (
                  <button className="prof-edit-btn" onClick={() => setEditing(true)}>✏ Modifier</button>
                )}
              </div>
            </div>
            <div className="prof-fields">
              {[
                { key:"firstName", label:"Prénom",        placeholder:"Ada"              },
                { key:"lastName",  label:"Nom",           placeholder:"Founder"          },
                { key:"email",     label:"Email",         placeholder:"email@startup.io" },
                { key:"org",       label:"Organisation",  placeholder:"Nom organisation" },
              ].map(f => (
                <div key={f.key} className="prof-field">
                  <label className="prof-label">{f.label}</label>
                  <input
                    className="prof-input"
                    value={localForm[f.key] || ""}
                    placeholder={f.placeholder}
                    disabled={!editing}
                    onChange={e => setLocalForm(p => ({...p,[f.key]:e.target.value}))}
                  />
                </div>
              ))}
              <div className="prof-field full">
                <label className="prof-label">Bio</label>
                <input
                  className="prof-input"
                  value={localForm.bio || ""}
                  disabled={!editing}
                  onChange={e => setLocalForm(p => ({...p, bio:e.target.value}))}
                />
              </div>
            </div>
          </div>

          <div className="prof-pwd-card">
            <div className="prof-form-hd">
              <div className="prof-card-title">Changer le mot de passe</div>
              <button className={`prof-edit-btn${showPwd?" active":""}`} onClick={() => setShowPwd(p=>!p)}>
                {showPwd ? "Annuler" : "Modifier"}
              </button>
            </div>
            {showPwd && (
              <div className="prof-fields">
                {[
                  { key:"current", label:"Mot de passe actuel"  },
                  { key:"next",    label:"Nouveau mot de passe"  },
                  { key:"confirm", label:"Confirmer le nouveau"  },
                ].map(f => (
                  <div key={f.key} className="prof-field">
                    <label className="prof-label">{f.label}</label>
                    <input className="prof-input" type="password" placeholder="••••••••••••"
                      value={pwd[f.key]} onChange={e => setPwd(p => ({...p,[f.key]:e.target.value}))}/>
                  </div>
                ))}
                <div className="prof-field">
                  <button className="prof-save-btn" style={{width:"100%",padding:"12px"}}>
                    Mettre à jour
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="prof-stats-card">
            <div className="prof-card-title">Statistiques du compte</div>
            <div className="prof-stats-grid">
              {[
                { cls:"si-1", val:"10",  lbl:"Simulations lancées"   },
                { cls:"si-2", val:"61%", lbl:"Risque global moyen"    },
                { cls:"si-3", val:"4",   lbl:"Scénarios sauvegardés"  },
                { cls:"si-4", val:"23j", lbl:"Jours d'utilisation"    },
              ].map((s,i) => (
                <div key={i} className={`prof-stat-item ${s.cls}`}>
                  <div className="prof-stat-val">{s.val}</div>
                  <div className="prof-stat-lbl">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}