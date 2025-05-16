import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../services/AuthContext";

const DeposerAvis = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/avis",
        { titre, description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const avisId = res.data.avis._id;

      if (files.length > 0) {
        for (const file of files) {
          const formData = new FormData();
          formData.append("fichier", file);
          formData.append("avisId", avisId);

          await axios.post("http://localhost:5000/api/avis/coffre-fort", formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
        }
      }

      setSuccess("Avis et fichiers envoyés avec succès !");
      setError("");
      setTitre("");
      setDescription("");
      setFiles([]);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l’envoi.");
      setSuccess("");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Déposer un dossier pour avis</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Titre de l'avis"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
          style={styles.input}
        />
        <textarea
          placeholder="Description détaillée"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={6}
          style={styles.textarea}
        />
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files))}
          style={styles.input}
        />
        {files.length > 0 && (
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        )}
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <button type="submit" style={styles.button}>
          Envoyer
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "2rem auto",
    padding: "2rem",
    backgroundColor: "#f9f9f9",
    borderRadius: "12px",
    fontFamily: "sans-serif",
  },
  heading: {
    fontSize: "1.5rem",
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.8rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  textarea: {
    padding: "0.8rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
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
  error: { color: "red" },
  success: { color: "green" },
};

export default DeposerAvis;
