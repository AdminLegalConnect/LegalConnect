import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../services/AuthContext";

const ProfilLectureSeule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [profil, setProfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${id}`);
        console.log("Profil reçu :", res.data);
        setProfil(res.data.profil);
      } catch (err) {
        console.error("Erreur récupération profil public", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfil();
  }, [id]);

  if (loading) return <div>Chargement...</div>;
  if (!profil) return <div>Profil introuvable.</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Profil de {profil.prenom} {profil.nom}</h2>

      {profil.photo && (
        <img
          src={`http://localhost:5000${profil.photo}`}
          alt="Photo de profil"
          style={styles.avatar}
        />
      )}

      <p><strong>Email :</strong> {profil.email}</p>
      <p><strong>Rôle :</strong> {profil.role}</p>
      {profil.specialite && <p><strong>Spécialité :</strong> {profil.specialite}</p>}
      {profil.ville && <p><strong>Ville :</strong> {profil.ville}</p>}
      {profil.telephone && <p><strong>Téléphone :</strong> {profil.telephone}</p>}
      {profil.siteInternet && (
        <p>
          <strong>Site :</strong>{" "}
          <a href={profil.siteInternet} target="_blank" rel="noopener noreferrer" style={{ color: "#2563EB" }}>
            {profil.siteInternet}
          </a>
        </p>
      )}

      {profil.moyenneNote && (
        <p style={{ color: "#2563EB", fontWeight: "bold" }}>
          Note moyenne : ⭐ {profil.moyenneNote}/5
        </p>
      )}

      {user && (
        <button
          onClick={() => navigate(`/messagerie/${profil._id}`)}
          style={styles.button}
        >
          Envoyer un message
        </button>
      )}

      {/* 🔽 Commentaires pour les juridiques */}
      {profil.role === "juridique" && profil.commentaires && profil.commentaires.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#1e3a8a" }}>Commentaires reçus :</h3>
          {profil.commentaires.map((c, index) => (
            <div key={index} style={styles.comment}>
              <p style={{ marginBottom: "0.2rem" }}>
                <strong>{c.auteurNom} :</strong>
              </p>
              <p style={{ fontStyle: "italic" }}>{c.texte}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "2rem auto",
    padding: "2rem",
    background: "#f9fafb",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    fontFamily: "sans-serif",
  },
  heading: {
    fontSize: "1.8rem",
    marginBottom: "1.5rem",
    color: "#1e3a8a",
    textAlign: "center",
  },
  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    margin: "0 auto 1rem",
    display: "block",
    border: "2px solid #ccc",
  },
  button: {
    marginTop: "1.5rem",
    padding: "0.8rem",
    backgroundColor: "#2563EB",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    width: "100%",
  },
  comment: {
    background: "#fff",
    padding: "1rem",
    marginTop: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
};

export default ProfilLectureSeule;
