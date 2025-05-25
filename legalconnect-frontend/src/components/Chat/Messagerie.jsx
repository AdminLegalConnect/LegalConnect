// Legalconnect-frontend/src/components/Chat/Messagerie.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Messagerie = () => {
  const [discussions, setDiscussions] = useState([]);
  const [erreur, setErreur] = useState(null);
  const navigate = useNavigate();

  const fetchDiscussions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("http://localhost:5000/api/messages/discussions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDiscussions(res.data);
    } catch (err) {
      console.error("Erreur discussions", err);
      setErreur("Impossible de récupérer vos discussions.");
      setDiscussions([]); // fallback
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">📨 Messagerie</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/messagerie/nouveau")}
        >
          Nouveau message
        </button>
      </div>

      {erreur && (
        <p className="text-red-600 mb-4">{erreur}</p>
      )}

      {discussions.length === 0 && !erreur ? (
        <p>Aucune discussion encore.</p>
      ) : (
        discussions.map((d) => (
          <div
            key={d.user._id}
            onClick={() => navigate(`/messagerie/${d.user._id}`)}
            className="border rounded-lg p-4 mb-2 cursor-pointer hover:bg-gray-50"
          >
            <h4 className="font-semibold">{d.user.prenom} {d.user.nom}</h4>
            <p className="text-sm text-gray-600">{d.lastMessage}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Messagerie;
