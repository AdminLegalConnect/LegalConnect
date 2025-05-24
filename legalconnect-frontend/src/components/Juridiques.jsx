import React, { useState, useEffect } from "react";
import axios from "axios";

const Juridiques = () => {
  const [query, setQuery] = useState("");
  const [juridiques, setJuridiques] = useState([]);
  const [mesDossiers, setMesDossiers] = useState([]);
  const [selectedDossier, setSelectedDossier] = useState("");
  const [selectedJurId, setSelectedJurId] = useState("");

  const rechercher = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/juridiques/recherche?q=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJuridiques(res.data);
    } catch (err) {
      console.error("Erreur recherche juridiques :", err);
    }
  };

  const fetchMesDossiers = async () => {
    try {
      const token = localStorage.getItem("token");
      const plaintes = await axios.get("http://localhost:5000/api/my-complaints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const avis = await axios.get("http://localhost:5000/api/avis/mes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const dossiers = [
        ...plaintes.data.complaints.map((p) => ({ ...p, type: "plainte" })),
        ...avis.data.avis.map((a) => ({ ...a, type: "avis" })),
      ];

      setMesDossiers(dossiers);
    } catch (err) {
      console.error("Erreur récupération dossiers :", err);
    }
  };

  const inviterJuridique = async () => {
    if (!selectedJurId || !selectedDossier) return;
    try {
      const token = localStorage.getItem("token");
      const { id, type } = JSON.parse(selectedDossier);
      const endpoint = type === "plainte"
        ? `http://localhost:5000/api/complaints/${id}/inviter`
        : `http://localhost:5000/api/avis/${id}/inviter`;

      const res = await axios.post(endpoint, { email: juridiques.find(j => j._id === selectedJurId).email }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Juridique invité avec succès !");
    } catch (err) {
      console.error("Erreur invitation :", err);
      alert("Erreur lors de l'invitation.");
    }
  };

  useEffect(() => {
    rechercher();
    fetchMesDossiers();
  }, []);

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h2>🔎 Explorer les juridiques</h2>
      <input
        type="text"
        placeholder="Rechercher par nom ou spécialité"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: "0.5rem", width: "60%", marginRight: "1rem" }}
      />
      <button onClick={rechercher} style={{ padding: "0.5rem 1rem" }}>Rechercher</button>

      <div style={{ marginTop: "2rem" }}>
        {juridiques.length === 0 ? (
          <p>Aucun résultat</p>
        ) : (
          juridiques.map(j => (
            <div key={j._id} style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem"
            }}>
              <h3>{j.prenom} {j.nom}</h3>
              <p><strong>Spécialité :</strong> {j.specialite}</p>
              <p><strong>Email :</strong> {j.email}</p>
              <p><strong>Note moyenne :</strong> {j.moyenneNote ? `⭐ ${j.moyenneNote}/5` : "Non noté"}</p>

              <button onClick={() => alert("Fonction de messagerie en cours de développement")} style={{ marginRight: "1rem" }}>
                Envoyer un message
              </button>

              <select
                value={selectedJurId === j._id ? selectedDossier : ""}
                onChange={(e) => {
                  setSelectedJurId(j._id);
                  setSelectedDossier(e.target.value);
                }}
                style={{ marginRight: "1rem", padding: "0.3rem" }}
              >
                <option value="">Ajouter à un de mes dossiers</option>
                {mesDossiers.map((d) => (
                  <option key={d._id} value={JSON.stringify({ id: d._id, type: d.type })}>
                    [{d.type}] {d.titre}
                  </option>
                ))}
              </select>

              <button onClick={inviterJuridique}>Ajouter</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Juridiques;
