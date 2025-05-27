import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";


const NouvelleDiscussion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const destIdFromQuery = queryParams.get("dest");

  const [utilisateurs, setUtilisateurs] = useState([]);
  const [selectedId, setSelectedId] = useState(destIdFromQuery || "");
  const [message, setMessage] = useState("");
  const [recherche, setRecherche] = useState("");


  const fetchUtilisateurs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUtilisateurs(res.data);
    } catch (err) {
      console.error("Erreur chargement utilisateurs", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedId || !message) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/messages`,
        { destinataireId: selectedId, texte: message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/messagerie/${selectedId}`);
    } catch (err) {
      console.error("Erreur envoi message initial", err);
    }
  };

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  const utilisateursFiltres = utilisateurs.filter((u) =>
    `${u.prenom} ${u.nom} ${u.email}`
      .toLowerCase()
      .includes(recherche.toLowerCase())
  );

  useEffect(() => {
  if (destIdFromQuery && utilisateurs.length > 0) {
    const existe = utilisateurs.some(u => u._id === destIdFromQuery);
    if (existe) {
      setSelectedId(destIdFromQuery);
    }
  }
}, [utilisateurs, destIdFromQuery]);


  return (
    <div style={styles.container}>
      <h2 style={styles.header}>✉️ Nouvelle discussion</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Rechercher un utilisateur :</label>
        <input
          type="text"
          placeholder="Nom, prénom ou email..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>Destinataire :</label>
        <div style={styles.userList}>
          {utilisateursFiltres.map((u) => (
            <div
              key={u._id}
              onClick={() => setSelectedId(u._id)}
              style={{
                ...styles.userCard,
                backgroundColor: selectedId === u._id ? "#dbeafe" : "#f9fafb",
              }}
            >
              {u.photo ? (
                <img
                  src={`http://localhost:5000${u.photo}`}
                  alt="Profil"
                  style={styles.avatar}
                />
              ) : (
                <div style={styles.emoji}>
                  {u.role === "juridique" ? "🧑‍⚖️" : "🙋"}
                </div>
              )}
              <div>
                <div style={styles.userName}>
                  {u.prenom} {u.nom}
                </div>
                <div style={styles.userEmail}>{u.email}</div>
              </div>
            </div>
          ))}
        </div>

        <label style={styles.label}>Message :</label>
        <textarea
          placeholder="Votre message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={styles.textarea}
        ></textarea>

        <button type="submit" style={styles.button}>
          Envoyer
        </button>
      </form>
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
  header: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  label: {
    fontWeight: "bold",
    fontSize: "0.95rem",
  },
  input: {
    padding: "0.6rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  userList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    maxHeight: "300px",
    overflowY: "auto",
    border: "1px solid #e5e7eb",
    padding: "0.5rem",
    borderRadius: "8px",
    backgroundColor: "#fff",
  },
  userCard: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.6rem",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  emoji: {
    fontSize: "1.5rem",
    width: "40px",
    textAlign: "center",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "999px",
    objectFit: "cover",
  },
  userName: {
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: "0.85rem",
    color: "#6b7280",
  },
  textarea: {
    padding: "0.8rem",
    borderRadius: "10px",
    border: "1px solid #ccc",
    resize: "none",
    minHeight: "100px",
    fontSize: "1rem",
  },
  button: {
    backgroundColor: "#2563EB",
    color: "white",
    padding: "0.8rem 1.5rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
};

export default NouvelleDiscussion;
