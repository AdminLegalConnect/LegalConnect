// pages/MesPlaintes.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../services/AuthContext";
import { useNavigate } from "react-router-dom";

const MesPlaintes = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/my-complaints", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setComplaints(res.data.complaints.sort((a, b) => new Date(b.date_creation) - new Date(a.date_creation)));
      } catch (err) {
        setError("Erreur lors de la récupération des plaintes");
        console.error(err);
      }
    };

    if (!user) navigate("/");
    else fetchComplaints();
  }, [user, navigate]);

  return (
    <>
      <div style={styles.container}>
        <div style={styles.newButtonBox}>
          <button onClick={() => navigate("/deposer-plainte")} style={styles.newButton}>
            + Nouveau dossier
          </button>
        </div>

        <h2 style={styles.heading}>Mes dossiers</h2>
        {error && <p style={styles.error}>{error}</p>}
        {complaints.length === 0 ? (
          <p style={styles.info}>Vous n’avez encore déposé aucune plainte.</p>
        ) : (
          <ul style={styles.list}>
            {complaints.map((complaint) => (
              <li key={complaint._id} style={styles.item}>
                <strong style={styles.title}>{complaint.titre}</strong>
                <p style={styles.desc}>
                  {complaint.description.length > 80
                    ? complaint.description.slice(0, 80) + "..."
                    : complaint.description}
                </p>
                <p style={styles.meta}>
                  <span style={{
                    padding: "0.2rem 0.6rem",
                    borderRadius: "999px",
                    backgroundColor:
                      complaint.statut === "en attente" ? "#fef3c7" :
                      complaint.statut === "en cours" ? "#bfdbfe" :
                      "#d1fae5",
                    color:
                      complaint.statut === "en attente" ? "#92400e" :
                      complaint.statut === "en cours" ? "#1e40af" :
                      "#065f46",
                    fontWeight: "bold",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                  }}>
                    {complaint.statut}
                  </span> • {" "}
                  <span><strong>Créée le :</strong> {new Date(complaint.date_creation).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}</span>
                </p>
                <button
                  onClick={() => navigate(`/mes-plaintes/${complaint._id}`)}
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

export default MesPlaintes;
