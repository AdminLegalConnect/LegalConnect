// pages/ChercherPlainte.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../services/AuthContext";
import { useNavigate } from "react-router-dom";

const ChercherPlainte = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/complaints", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComplaints(res.data.complaints);
      } catch (err) {
        setError("Erreur lors de la récupération des plaintes");
        console.error(err);
      }
    };

    if (user?.role === "juridique") {
      fetchComplaints();
    }
  }, [user]);

  const handleClick = (id) => {
    navigate(`/mes-plaintes/${id}`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Plaintes déposées par des particuliers</h1>
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.grid}>
        {complaints.map((plainte) => (
          <div
            key={plainte._id}
            style={styles.card}
            onClick={() => handleClick(plainte._id)}
          >
            <h2 style={styles.cardTitle}>{plainte.titre}</h2>
            <p style={styles.cardText}>{plainte.description.slice(0, 120)}...</p>
            <p style={styles.meta}>
              Statut : <strong>{plainte.statut}</strong> • Déposé le : {new Date(plainte.date_creation).toLocaleDateString()}
            </p>
            <p style={styles.meta}>
              Visibilité : {plainte.visibilite === "publique" ? "🟢 Publique" : "🔒 Privée"}
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

export default ChercherPlainte;
