/* SuiviJuridique.jsx */
import React, { useState, useEffect } from "react";
import axios from "axios";

const statusColors = {
  "à faire": "#fbbf24",    // jaune
  "en cours": "#3b82f6",   // bleu
  "terminée": "#10b981"    // vert
};

const SuiviJuridique = ({ plainteId }) => {
  const [etapes, setEtapes] = useState([]);
  const [form, setForm] = useState({ titre: "", statut: "à faire", dateCible: "", commentaire: "" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchEtapes = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const res = await axios.get(`http://localhost:5000/api/plainte/${plainteId}/etapes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEtapes(res.data.etapes);
  };

  useEffect(() => {
    fetchEtapes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté pour ajouter une étape.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    if (file) formData.append("fichier", file);

    try {
      await axios.post(`http://localhost:5000/api/plainte/${plainteId}/etapes`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ titre: "", statut: "à faire", dateCible: "", commentaire: "" });
      setFile(null);
      fetchEtapes();
    } catch (err) {
      console.error("Erreur lors de l'ajout de l'étape:", err);
      alert("Erreur lors de l'envoi, veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const supprimerEtape = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    await axios.delete(`http://localhost:5000/api/etapes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchEtapes();
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <div style={{ background: "#f9fafb", padding: "1rem", borderRadius: "8px", border: "1px solid #ddd" }}>
        <h3>Ajouter une étape juridique</h3>
        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <input value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} placeholder="Titre" required />
          <select value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value })}>
            <option value="à faire">À faire</option>
            <option value="en cours">En cours</option>
            <option value="terminée">Terminée</option>
          </select>
          <input type="date" value={form.dateCible} onChange={(e) => setForm({ ...form, dateCible: e.target.value })} />
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <textarea value={form.commentaire} onChange={(e) => setForm({ ...form, commentaire: e.target.value })} placeholder="Commentaire" style={{ gridColumn: "1 / -1" }} />
          <button type="submit" style={{ gridColumn: "1 / -1", backgroundColor: "#2563eb", color: "white", padding: "0.5rem 1rem", borderRadius: "6px", border: "none", cursor: "pointer" }}>
            {loading ? "Ajout en cours..." : "Ajouter l'étape"}
          </button>
        </form>
      </div>

      <h3 style={{ marginTop: "2rem" }}>Étapes de suivi</h3>
      {etapes.map((e) => (
        <div key={e._id} style={{ borderLeft: `6px solid ${statusColors[e.statut]}`, padding: "1rem", marginTop: "1rem", background: "#fff", borderRadius: "6px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{e.titre} <span style={{ color: statusColors[e.statut], fontWeight: "normal" }}>• {e.statut}</span></div>
          {e.dateCible && <div style={{ fontSize: "0.9rem", color: "#555" }}>📅 Date cible : {new Date(e.dateCible).toLocaleDateString()}</div>}
          {e.commentaire && <p style={{ marginTop: "0.5rem" }}>{e.commentaire}</p>}
          {e.fichier && <a href={`http://localhost:5000/${e.fichier}`} target="_blank" rel="noopener noreferrer">📎 Voir la pièce jointe</a>}<br />
          <button onClick={() => supprimerEtape(e._id)} style={{ marginTop: "0.5rem", backgroundColor: "#dc2626", color: "white", border: "none", borderRadius: "4px", padding: "0.3rem 0.6rem", cursor: "pointer" }}>
            🗑️ Supprimer
          </button>
        </div>
      ))}
    </div>
  );
};

export default SuiviJuridique;
