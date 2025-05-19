// pages/ForumNouveau.jsx
import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../services/AuthContext";

const ForumNouveau = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [thematique, setThematique] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/forum/posts",
        { titre, contenu, thematique },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/forum");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la création du post.");
    }
  };

  return (
    <>
      <div style={{ maxWidth: "700px", margin: "2rem auto", padding: "1rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Nouveau sujet</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label>Titre :</label>
            <input
              type="text"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              required
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Thématique :</label>
            <input
              type="text"
              value={thematique}
              onChange={(e) => setThematique(e.target.value)}
              placeholder="Ex: Voisinage, Syndic, Contrat..."
              required
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Contenu :</label>
            <textarea
              rows={6}
              value={contenu}
              onChange={(e) => setContenu(e.target.value)}
              required
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <button
            type="submit"
            style={{ backgroundColor: "#2563EB", color: "white", padding: "0.5rem 1rem", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            Publier
          </button>
        </form>
      </div>
    </>
  );
};

export default ForumNouveau;
