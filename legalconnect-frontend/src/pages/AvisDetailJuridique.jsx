// pages/AvisDetailJuridique.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../services/AuthContext";

const AvisDetailJuridique = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [avis, setAvis] = useState(null);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const fetchAvis = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/avis/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvis(res.data.avis);
      setStatus(res.data.avis.statut);
    } catch (err) {
      console.error(err);
      setError("Erreur de chargement de l'avis.");
    }
  };

  useEffect(() => {
    fetchAvis();
  }, [id]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/avis/${id}/chat`, {
        texte: message,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("");
      fetchAvis();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'envoi du message.");
    }
  };

  const handleStatusChange = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/avis/${id}`, {
        statut: status,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Statut mis à jour !");
      fetchAvis();
    } catch (err) {
      console.error(err);
      setError("Impossible de changer le statut.");
    }
  };

  if (!avis) return <p style={{ padding: "2rem" }}>Chargement...</p>;

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: "2rem" }}>
      <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem", color: "#1d4ed8" }}>
        Avis : {avis.titre}
      </h2>

      <p><strong>Description :</strong> {avis.description}</p>
      <p>
        <strong>Déposé par :</strong> {avis.utilisateurId?.prenom} {avis.utilisateurId?.nom} ({avis.utilisateurId?.email})
      </p>
      <p><strong>Date :</strong> {new Date(avis.dateDepot).toLocaleDateString()}</p>

      <hr style={{ margin: "1.5rem 0" }} />

      <div>
        <h3>Changer le statut</h3>
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: "0.5rem", marginRight: "1rem" }}>
          <option value="en attente">En attente</option>
          <option value="en cours">En cours</option>
          <option value="résolu">Résolu</option>
        </select>
        <button onClick={handleStatusChange} style={{ padding: "0.5rem 1rem", backgroundColor: "#2563EB", color: "white", border: "none", borderRadius: "6px" }}>
          Mettre à jour
        </button>
      </div>

      {/* Historique des statuts */}
      {avis.historiqueStatut && avis.historiqueStatut.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Historique des statuts</h3>
          <div style={{
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "1rem",
            backgroundColor: "#f9fafb",
          }}>
            <ul style={{ listStyle: "disc", paddingLeft: "1.5rem" }}>
              {avis.historiqueStatut.map((entry, index) => (
                <li key={index} style={{ marginBottom: "0.5rem" }}>
                  {new Date(entry.date).toLocaleString("fr-FR")} – <strong>{entry.statut}</strong> par {entry.modifiéPar?.prenom} {entry.modifiéPar?.nom} ({entry.modifiéPar?.email})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <hr style={{ margin: "2rem 0" }} />

      <h3>Réponse / messages</h3>
      <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #eee", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
        {avis.chat.map((msg) => (
          <div key={msg._id} style={{ marginBottom: "1rem", backgroundColor: "#f3f4f6", padding: "0.5rem", borderRadius: "8px" }}>
            <strong>{msg.auteurId?.prenom || msg.auteurId?.email}</strong> ({new Date(msg.date).toLocaleString()}):
            <p>{msg.texte}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <textarea
        rows={4}
        placeholder="Votre réponse..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", marginBottom: "1rem" }}
      />
      <button onClick={handleSendMessage} style={{ padding: "0.8rem 1.2rem", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "8px" }}>
        Envoyer
      </button>

      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AvisDetailJuridique;
