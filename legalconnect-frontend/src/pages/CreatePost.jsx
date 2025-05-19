import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../services/AuthContext";

function CreatePost() {
const { user } = useContext(AuthContext);
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [thematique, setThematique] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.token) {
      alert("Vous devez être connecté pour créer un sujet.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/forum/posts",
        {
          titre,
          contenu,
          thematique,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setMessage("Sujet créé avec succès !");
      setTimeout(() => navigate("/forum"), 1500);
    } catch (error) {
      console.error("Erreur lors de la création du sujet :", error);
      setMessage("Erreur lors de la création du sujet.");
    }
  };



   return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Créer un nouveau sujet</h2>
      {message && <p className="mb-4 text-red-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <label className="block font-medium">Titre</label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Contenu</label>
          <textarea
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            required
            rows={6}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Thématique</label>
          <select
            value={thematique}
            onChange={(e) => setThematique(e.target.value)}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">-- Choisir une thématique --</option>
            <option value="consommation">Droit de la consommation</option>
            <option value="travail">Droit du travail</option>
            <option value="logement">Logement / Immobilier</option>
            <option value="famille">Famille</option>
            <option value="administratif">Litige administratif</option>
            <option value="autre">Autre</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Publier
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
