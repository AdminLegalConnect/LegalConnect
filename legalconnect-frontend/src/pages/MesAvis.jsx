// MesAvis.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../services/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Layout/Header";

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

        setAvisList(res.data.avis);
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
      <Header />
      <div style={styles.container}>
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
                  <span><strong>Statut :</strong> {avis.statut}</span> •{" "}
                  <span><strong>Déposé le :</strong>{" "}
                    {new Date(avis.dateDepot).toLocaleDateString()}</span>
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
  },
  error: {
    color: "red",
  },
  info: {
    fontStyle: "italic",
  },
};

export default MesAvis;
