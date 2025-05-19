import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import DeposerPlainte from "./pages/DeposerPlainte";
import MesPlaintes from "./pages/MesPlaintes";
import PlainteDetail from "./pages/PlainteDetail";
import Profile from "./pages/Profile"; // assure-toi que ce fichier existe bien
import CreatePost from "./pages/CreatePost"; // adapte le chemin si nécessaire
import Forum from "./pages/Forum"; // ou le bon chemin relatif selon ton arborescence
import ForumDetail from "./pages/ForumDetail"; // adapte le chemin si besoin





// 👉 nouvelles pages
import DeposerAvis from "./pages/DeposerAvis";
import MesAvis from "./pages/MesAvis";
import AvisDetail from "./pages/AvisDetail"; // à créer après

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/deposer-plainte" element={<DeposerPlainte />} />
      <Route path="/mes-plaintes" element={<MesPlaintes />} />
      <Route path="/mes-plaintes/:id" element={<PlainteDetail />} />
      <Route path="/profil" element={<Profile />} />
      
      {/* ✅ nouvelles routes */}
      <Route path="/deposer-dossier" element={<DeposerAvis />} />
      <Route path="/mes-avis" element={<MesAvis />} />
      <Route path="/mes-avis/:id" element={<AvisDetail />} />
      <Route path="/deposer-avis" element={<DeposerAvis />} />
      <Route path="/mes-avis/:id" element={<AvisDetail />} />
      <Route path="/thematiques" element={<Forum />} />
      <Route path="/forum/nouveau" element={<CreatePost />} />
      <Route path="/forum" element={<Forum />} />
      <Route path="/forum/:id" element={<ForumDetail />} />






    </Routes>
  );
}

export default App;
