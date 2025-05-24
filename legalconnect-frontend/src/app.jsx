import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthContext } from "./services/AuthContext";
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
import MainLayout from "./components/Layout/MainLayout";
import ChercherAvis from "./pages/ChercherAvis";
import AvisDetailJuridique from "./pages/AvisDetailJuridique";
import FacturationJuridique from "./pages/FacturationJuridique";
import ChercherPlainte from "./pages/ChercherPlainte";
import PlainteDetailJuridique from "./pages/PlainteDetailJuridique";
import Juridiques from "./components/Juridiques";

function App() {
  const { user } = useContext(AuthContext); // ✅

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/deposer-plainte" element={<DeposerPlainte />} />
        <Route path="/mes-plaintes" element={<MesPlaintes />} />
        <Route path="/mes-plaintes/:id" element={
          user?.role === "juridique" ? <PlainteDetailJuridique /> : <PlainteDetail />
        } />
        <Route path="/profil" element={<Profile />} />
        <Route path="/deposer-dossier" element={<DeposerAvis />} />
        <Route path="/deposer-avis" element={<DeposerAvis />} />
        <Route path="/mes-avis" element={<MesAvis />} />
        <Route path="/mes-avis/:id" element={<AvisDetail />} />
        <Route path="/thematiques" element={<Forum />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/forum/nouveau" element={<CreatePost />} />
        <Route path="/forum/:id" element={<ForumDetail />} />
        <Route path="/recherche-avis" element={<ChercherAvis />} />
        <Route path="/avis/:id" element={<AvisDetail />} />
        <Route path="/juridique/avis/:id" element={<AvisDetailJuridique />} />
        <Route path="/facturation" element={<FacturationJuridique />} />
        <Route path="/recherche-plainte" element={<ChercherPlainte />} />
        <Route path="/plainte-juridique/:id" element={<PlainteDetailJuridique />} />
        <Route path="/juridiques" element={<Juridiques />} />
      </Route>
    </Routes>
  );
}

export default App;
