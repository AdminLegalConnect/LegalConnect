// pages/ChercherAvis.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../services/AuthContext";
import { useNavigate } from "react-router-dom";

const ChercherAvis = () => {
  const { user } = useContext(AuthContext);
  const [avisList, setAvisList] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvis = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/avis/particuliers", {
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

    if (user?.role === "juridique") {
      fetchAvis();
    }
  }, [user]);

  const handleClick = (id) => {
    navigate(`/avis/${id}`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Avis déposés par des particuliers</h1>
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.grid}>
        {avisList.map((avis) => (
          <div key={avis._id} style={styles.card} onClick={() => handleClick(avis._id)}>
            <h2 style={styles.cardTitle}>{avis.titre}</h2>
            <p style={styles.cardText}>{avis.description.slice(0, 120)}...</p>
            <p style={styles.meta}>
              Statut : <strong>{avis.statut}</strong> • Déposé le :{" "}
              {new Date(avis.dateDepot).toLocaleDateString()}
            </p>
            <p style={styles.meta}>
              Par : {avis.utilisateurId?.prenom || avis.utilisateurId?.email}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "2rem",
    fontFamily: "sans-serif",
  },
  title: {
    fontSize: "2rem",
    color: "#1e3a8a",
    marginBottom: "1.5rem",
  },
  error: {
    color: "red",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: "12px",
    padding: "1.5rem",
    backgroundColor: "#f9f9f9",
    cursor: "pointer",
    transition: "box-shadow 0.2s",
  },
  cardTitle: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    color: "#1d4ed8",
    marginBottom: "0.5rem",
  },
  cardText: {
    color: "#444",
    marginBottom: "0.5rem",
  },
  meta: {
    fontSize: "0.9rem",
    color: "#666",
  },
};

export default ChercherAvis;
