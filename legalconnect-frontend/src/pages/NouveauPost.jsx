// src/pages/NouveauPost.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NouveauPost = () => {
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [thematique, setThematique] = useState("");
  const [fichier, setFichier] = useState(null);
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/forum/posts",
        { titre, contenu, thematique },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const postId = response.data.post._id;

      if (fichier) {
        const formData = new FormData();
        formData.append("fichier", fichier);
        await axios.post(`http://localhost:5000/api/forum/posts/${postId}/upload`, formData);
      }

      navigate("/forum");
    } catch (err) {
      console.error("Erreur lors de la création du post", err);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Nouveau sujet</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Titre du sujet"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />

        <textarea
          placeholder="Contenu du sujet"
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          rows={6}
          required
          className="w-full border p-2 rounded"
        />

        <select
          value={thematique}
          onChange={(e) => setThematique(e.target.value)}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Choisir une thématique</option>
          <option value="Voisinage">Voisinage</option>
          <option value="Travail">Travail</option>
          <option value="Immobilier">Immobilier</option>
          <option value="Famille">Famille</option>
          <option value="Consommation">Consommation</option>
        </select>

        <input
          type="file"
          onChange={(e) => setFichier(e.target.files[0])}
          className="w-full"
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Publier
        </button>
      </form>
    </div>
  );
};

export default NouveauPost;
