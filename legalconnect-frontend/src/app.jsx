import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import DeposerPlainte from "./pages/DeposerPlainte";
import MesPlaintes from "./pages/MesPlaintes";
import PlainteDetail from "./pages/PlainteDetail";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Forum from "./pages/Forum";
import ForumDetail from "./pages/ForumDetail";
import DeposerAvis from "./pages/DeposerAvis";
import MesAvis from "./pages/MesAvis";
import AvisDetail from "./pages/AvisDetail";
import MainLayout from "./components/Layout/MainLayout"; // 💡 à ajouter

function App() {
  return (
    <Routes>
      {/* Routes sans header */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Routes avec header via layout */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/deposer-plainte" element={<DeposerPlainte />} />
        <Route path="/mes-plaintes" element={<MesPlaintes />} />
        <Route path="/mes-plaintes/:id" element={<PlainteDetail />} />
        <Route path="/profil" element={<Profile />} />
        <Route path="/deposer-dossier" element={<DeposerAvis />} />
        <Route path="/deposer-avis" element={<DeposerAvis />} />
        <Route path="/mes-avis" element={<MesAvis />} />
        <Route path="/mes-avis/:id" element={<AvisDetail />} />
        <Route path="/thematiques" element={<Forum />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/forum/nouveau" element={<CreatePost />} />
        <Route path="/forum/:id" element={<ForumDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
