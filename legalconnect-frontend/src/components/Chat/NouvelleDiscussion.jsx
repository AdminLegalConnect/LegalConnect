// Legalconnect-frontend/src/components/Chat/NouvelleDiscussion.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NouvelleDiscussion = () => {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fetchUtilisateurs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUtilisateurs(res.data);
    } catch (err) {
      console.error("Erreur chargement utilisateurs", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedId || !message) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/messages`,
        { destinataireId: selectedId, texte: message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/messagerie/chat/${selectedId}`);
    } catch (err) {
      console.error("Erreur envoi message initial", err);
    }
  };

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">✉️ Nouvelle discussion</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          className="w-full border rounded p-2"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">Sélectionner un destinataire</option>
          {utilisateurs.map((u) => (
            <option key={u._id} value={u._id}>
              {u.prenom} {u.nom} ({u.email})
            </option>
          ))}
        </select>
        <textarea
          placeholder="Votre message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border rounded p-2 h-32"
        ></textarea>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          Envoyer
        </button>
      </form>
    </div>
  );
};

export default NouvelleDiscussion;
