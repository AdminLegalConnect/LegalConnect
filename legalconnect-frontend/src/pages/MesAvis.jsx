// pages/MesAvis.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../services/AuthContext";
import { useNavigate } from "react-router-dom";

const MesAvis = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [avisList, setAvisList] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAvis = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/avis/mes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAvisList(
          res.data.avis.sort((a, b) => new Date(b.dateDepot) - new Date(a.dateDepot))
        );
      } catch (err) {
        setError("Erreur lors de la récupération des avis");
        console.error(err);
      }
    };

    if (!user) navigate("/");
    else fetchAvis();
  }, [user, navigate]);

  return (
    <>
      <div style={styles.container}>
        <div style={styles.newButtonBox}>
          <button onClick={() => navigate("/deposer-avis")} style={styles.newButton}>
            + Nouveau dossier
          </button>
        </div>

        <h2 style={styles.heading}>Mes avis</h2>
        {error && <p style={styles.error}>{error}</p>}
        {avisList.length === 0 ? (
          <p style={styles.info}>Vous n’avez encore déposé aucun avis.</p>
        ) : (
          <ul style={styles.list}>
            {avisList.map((avis) => (
              <li key={avis._id} style={styles.item}>
                <strong style={styles.title}>{avis.titre}</strong>
                <p style={styles.desc}>
                  {avis.description.length > 80
                    ? avis.description.slice(0, 80) + "..."
                    : avis.description}
                </p>
                <p style={styles.meta}>
                  <span style={{
                    padding: "0.2rem 0.6rem",
                    borderRadius: "999px",
                    backgroundColor:
                      avis.statut === "en attente" ? "#fef3c7" :
                      avis.statut === "en cours" ? "#bfdbfe" :
                      "#d1fae5",
                    color:
                      avis.statut === "en attente" ? "#92400e" :
                      avis.statut === "en cours" ? "#1e40af" :
                      "#065f46",
                    fontWeight: "bold",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                  }}>
                    {avis.statut}
                  </span> • {" "}
                  <span><strong>Déposé le :</strong> {new Date(avis.dateDepot).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}</span>
                </p>
                <button
                  onClick={() => navigate(`/mes-avis/${avis._id}`)}
                  style={styles.button}
                >
                  Voir
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "2rem auto",
    padding: "1rem",
    fontFamily: "sans-serif",
  },
  newButtonBox: {
    textAlign: "right",
    marginBottom: "1rem",
  },
  newButton: {
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    padding: "0.6rem 1.2rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "0.9rem",
  },
  heading: {
    fontSize: "1.8rem",
    marginBottom: "1rem",
  },
  list: {
    listStyle: "none",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  item: {
    backgroundColor: "#f3f4f6",
    padding: "1rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  title: {
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  desc: {
    marginTop: "0.5rem",
    color: "#4b5563",
  },
  meta: {
    marginTop: "0.5rem",
    fontSize: "0.9rem",
    color: "#6b7280",
  },
  button: {
    marginTop: "0.8rem",
    padding: "0.4rem 0.8rem",
    backgroundColor: "#2563EB",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "bold",
    transition: "background-color 0.2s",
  },
  error: {
    color: "red",
  },
  info: {
    fontStyle: "italic",
  },
};

export default MesAvis;
