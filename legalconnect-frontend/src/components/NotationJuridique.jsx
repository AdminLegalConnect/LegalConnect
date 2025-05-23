import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../services/AuthContext';
import { useParams } from "react-router-dom";


const NotationJuridique = ({ avocatId, onSubmitSuccess }) => {
  const { id: plainteId } = useParams(); // ✅ déplacer ici
  const { user } = useContext(AuthContext);
  const [note, setNote] = useState(0);
  const [commentaire, setCommentaire] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!avocatId || !plainteId) {
      setError("avocatId ou plainteId manquant.");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // ✅ ajouté ici
      await axios.post(
        `http://localhost:5000/api/profil/note`,
        { avocatId, plainteId, note, commentaire },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Note envoyée avec succès !");
      onSubmitSuccess();
    } catch (err) {
      console.error("Erreur lors de l'envoi de la note:", err);
      setError("Erreur lors de l'envoi.");
    }
  };





  return (
    <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h4>Noter cet avocat</h4>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            onClick={() => setNote(n)}
            style={{
              fontSize: "1.5rem",
              cursor: "pointer",
              color: n <= note ? "#f59e0b" : "#d1d5db",
            }}
          >
            ★
          </span>
        ))}
      </div>
      <textarea
        value={commentaire}
        onChange={(e) => setCommentaire(e.target.value)}
        rows={3}
        placeholder="Laissez un commentaire (optionnel)"
        style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
      />
      <button
        onClick={handleSubmit}
        style={{ marginTop: "1rem", padding: "0.6rem 1.2rem", backgroundColor: "#2563EB", color: "white", border: "none", borderRadius: "6px" }}
      >
        Envoyer
      </button>
      {message && <p style={{ color: "green", marginTop: "0.5rem" }}>{message}</p>}
      {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
    </div>
  );
};

export default NotationJuridique;