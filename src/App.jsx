import { useState } from "react";
import Home            from "./components/Home";
import Login           from "./components/Login";
import ForgotPassword  from "./components/ForgotPassword";
import Register        from "./components/Register";
import Dashboard       from "./components/Dashboard";
import Simulation      from "./components/Simulation";
import History         from "./components/History";
import Recommendations from "./components/Recommendations";
import Profile         from "./components/Profile";

export default function App() {
  const [page,       setPage]       = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* navigation helpers */
  const go   = (p) => setPage(p);
  const goSim  = () => isLoggedIn ? go("simulation") : go("login");
  const goDash = () => go("dashboard");

  /* pages that need login */
  const PROTECTED = ["dashboard","simulation","history","recommendations","profile"];
  const currentPage = PROTECTED.includes(page) && !isLoggedIn ? "login" : page;

  return (
    <>
      {currentPage === "home"            && <Home            onLoginClick={() => go("login")} onSimulateClick={goSim} />}
      {currentPage === "login"           && <Login           onBack={() => go("home")} onForgot={() => go("forgot")} onRegister={() => go("register")} onSuccess={() => { setIsLoggedIn(true); go("dashboard"); }} />}
      {currentPage === "forgot"          && <ForgotPassword  onBack={() => go("register")} onBackToLogin={() => go("login")} />}
      {currentPage === "register"        && <Register        onBack={() => go("home")} onBackToLogin={() => go("login")} />}
      {currentPage === "dashboard"       && <Dashboard       onSimulate={goSim} onBack={() => go("home")} onHistory={() => go("history")} onRecommendations={() => go("recommendations")} onProfile={() => go("profile")} />}
      {currentPage === "simulation"      && <Simulation      onBack={goDash} />}
      {currentPage === "history"         && <History         onBack={goDash} onSimulate={goSim} />}
      {currentPage === "recommendations" && <Recommendations onBack={goDash} onSimulate={goSim} />}
      {currentPage === "profile"         && <Profile         onBack={goDash} onSimulate={goSim} />}
    </>
  );
}