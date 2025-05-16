import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Dashboard from "./pages/Dashboard";
import DeposerPlainte from "./pages/DeposerPlainte"; // 👈 nouvel import
import MesPlaintes from "./pages/MesPlaintes";
import PlainteDetail from "./pages/PlainteDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/deposer-plainte" element={<DeposerPlainte />} /> {/* 👈 nouvelle route */}
      <Route path="/mes-plaintes" element={<MesPlaintes />} />
      <Route path="/mes-plaintes/:id" element={<PlainteDetail />} />
    </Routes>
  );
}

export default App;
