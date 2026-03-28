import { useState } from "react";
import Home from "./components/Home";
import Login from "./components/Login";

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <>
      {page === "home" && <Home onLoginClick={() => setPage("login")} />}
      {page === "login" && <Login onBack={() => setPage("home")} />}
    </>
  );
}