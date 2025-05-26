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
      setDiscussions([]);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h2 style={styles.header}>📨 Messagerie</h2>
        <button style={styles.newButton} onClick={() => navigate("/messagerie/nouveau")}>
          Nouveau message
        </button>
      </div>

      {erreur && <p style={styles.error}>{erreur}</p>}

      {discussions.length === 0 && !erreur ? (
        <p style={styles.noDiscussion}>Aucune discussion pour le moment.</p>
      ) : (
        discussions.map((d) => (
  <div
    key={d.user._id}
    onClick={() => navigate(`/messagerie/${d.user._id}`)}
    style={{
      ...styles.discussionCard,
      backgroundColor: d.nonLus > 0 ? "#f0f9ff" : "white",
    }}
  >
    <div style={styles.cardTopRow}>
      <div style={styles.discussionName}>
        {d.user.prenom} {d.user.nom}
      </div>
      {d.nonLus > 0 && (
        <div style={styles.badge}>
          🔵 {d.nonLus}
        </div>
      )}
    </div>
    <div style={styles.lastMessage}>
      {d.lastMessage || "Aucun message"}
    </div>
  </div>
))

      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "700px",
    margin: "2rem auto",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    fontSize: "1.6rem",
    fontWeight: "bold",
  },
  newButton: {
    backgroundColor: "#2563EB",
    color: "white",
    padding: "0.6rem 1rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontWeight: "bold",
  },
  noDiscussion: {
    color: "#6b7280",
    fontStyle: "italic",
  },
  discussionCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "1rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  discussionName: {
    fontWeight: "bold",
    marginBottom: "0.25rem",
  },
  lastMessage: {
    fontSize: "0.9rem",
    color: "#6b7280",
  },
  cardTopRow: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
},
badge: {
  fontSize: "0.75rem",
  backgroundColor: "#2563EB",
  color: "white",
  padding: "0.2rem 0.5rem",
  borderRadius: "999px",
  fontWeight: "bold",
},

};

export default Messagerie;
