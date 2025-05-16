import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PlainteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`http://localhost:5000/api/complaints/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setComplaint(res.data.complaint);
        setTitre(res.data.complaint.titre);
        setDescription(res.data.complaint.description);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger la plainte");
      }
    };

    fetchComplaint();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/complaints/${id}`,
        { titre, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Plainte mise à jour avec succès !");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la mise à jour");
    }
  };

  if (!complaint) return <p style={{ padding: "2rem" }}>Chargement...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Détail de la plainte</h2>

      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}

      <form onSubmit={handleUpdate} style={styles.form}>
        <label>Titre :</label>
        <input
          type="text"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          style={styles.input}
        />

        <label>Description :</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          Enregistrer les modifications
        </button>
      </form>

      {/* 📁 Affichage des fichiers du coffre-fort */}
      <div style={styles.coffreContainer}>
        <h3>Fichiers du coffre-fort :</h3>
        {complaint.coffre_fort.length === 0 ? (
          <p style={styles.info}>Aucun fichier joint.</p>
        ) : (
          <ul style={styles.fileList}>
            {complaint.coffre_fort.map((file) => (
              <li key={file._id} style={styles.fileItem}>
                <a
                  href={`http://localhost:5000${file.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.link}
                >
                  {file.nom_fichier}
                </a>{" "}
                <span style={styles.meta}>
                  ({file.type} – {new Date(file.date_upload).toLocaleDateString()})
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={() => navigate("/mes-plaintes")} style={styles.back}>
        ⬅ Retour à mes plaintes
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "2rem auto",
    padding: "2rem",
    fontFamily: "sans-serif",
  },
  heading: {
    fontSize: "1.5rem",
    marginBottom: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "2rem",
  },
  input: {
    padding: "0.6rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  textarea: {
    padding: "0.6rem",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "0.8rem",
    backgroundColor: "#2563EB",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  back: {
    marginTop: "2rem",
    background: "none",
    border: "none",
    color: "#2563EB",
    cursor: "pointer",
    fontWeight: "bold",
  },
  error: {
    color: "red",
  },
  success: {
    color: "green",
  },
  coffreContainer: {
    marginTop: "1rem",
  },
  fileList: {
    listStyle: "none",
    padding: 0,
    marginTop: "0.5rem",
  },
  fileItem: {
    marginBottom: "0.5rem",
  },
  link: {
    color: "#1d4ed8",
    textDecoration: "underline",
  },
  meta: {
    fontSize: "0.85rem",
    color: "#6b7280",
    marginLeft: "0.5rem",
  },
  info: {
    fontStyle: "italic",
    color: "#555",
  },
};

export default PlainteDetail;
