import React, { useEffect, useState } from "react";
import axios from "axios";

const FacturationJuridique = () => {
  const [paiements, setPaiements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/profil/facturation", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPaiements(res.data.paiements);
      } catch (err) {
        console.error("Erreur lors du chargement de la facturation", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: "2rem", maxWidth: 800, margin: "auto" }}>
      <h2 style={{ marginBottom: "1rem", color: "#1e3a8a" }}>Historique de vos paiements reçus</h2>
      {paiements.length === 0 ? (
        <p>Aucun paiement pour le moment.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {paiements.map((p, i) => (
            <li key={i} style={{ marginBottom: "1rem", padding: "1rem", background: "#f1f5f9", borderRadius: "8px" }}>
              <p><strong>Avis :</strong> {p.titre}</p>
              <p><strong>Acheteur :</strong> {p.acheteur.prenom} {p.acheteur.nom} ({p.acheteur.email})</p>
              <p><strong>Date :</strong> {new Date(p.date).toLocaleString("fr-FR")}</p>
              <p><strong>Montant estimé :</strong> {p.montantEstime} €</p>
              <p><strong>Fichier concerné :</strong> <a href={`http://localhost:5000/${p.fichier}`} target="_blank">Télécharger</a></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FacturationJuridique;
