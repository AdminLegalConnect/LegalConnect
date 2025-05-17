import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Dashboard from "./pages/Dashboard";
import DeposerPlainte from "./pages/DeposerPlainte";
import MesPlaintes from "./pages/MesPlaintes";
import PlainteDetail from "./pages/PlainteDetail";
import Profile from "./pages/Profile"; // assure-toi que ce fichier existe bien

// 👉 nouvelles pages
import DeposerAvis from "./pages/DeposerAvis";
import MesAvis from "./pages/MesAvis";
import AvisDetail from "./pages/AvisDetail"; // à créer après

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/deposer-plainte" element={<DeposerPlainte />} />
      <Route path="/mes-plaintes" element={<MesPlaintes />} />
      <Route path="/mes-plaintes/:id" element={<PlainteDetail />} />
      <Route path="/profil" element={<Profile />} />
      
      {/* ✅ nouvelles routes */}
      <Route path="/deposer-dossier" element={<DeposerAvis />} />
      <Route path="/mes-avis" element={<MesAvis />} />
      <Route path="/mes-avis/:id" element={<AvisDetail />} />
    </Routes>
  );
}

export default App;
