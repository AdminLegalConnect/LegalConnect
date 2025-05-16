// pages/AvisDetail.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../services/AuthContext";

const AvisDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [avis, setAvis] = useState(null);
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [newFiles, setNewFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const fetchAvis = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/avis/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvis(res.data.avis);
      setTitre(res.data.avis.titre);
      setDescription(res.data.avis.description);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger l'avis");
    }
  };

  useEffect(() => { fetchAvis(); }, [id]);

  const handleUploadFiles = async () => {
    if (newFiles.length === 0) return;
    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      for (const file of newFiles) {
        const formData = new FormData();
        formData.append("fichier", file);
        formData.append("avisId", id);

        await axios.post(`http://localhost:5000/api/avis/coffre-fort`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }
      setSuccess("Fichier(s) ajouté(s) avec succès !");
      setNewFiles([]);
      fetchAvis();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'envoi des fichiers");
    } finally {
      setUploading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/avis/chat`, {
        avisId: id,
        texte: newMessage.trim(),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewMessage("");
      fetchAvis();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'envoi du message");
    }
  };

  if (!avis) return <p style={{ padding: "2rem" }}>Chargement...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Détail de l'avis</h2>

      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}

      <p><strong>Titre :</strong> {titre}</p>
      <p><strong>Description :</strong> {description}</p>

      <div style={styles.coffreContainer}>
        <h3>Fichiers :</h3>
        {avis.coffreFort.length === 0 ? (
          <p style={styles.info}>Aucun fichier.</p>
        ) : (
          <ul style={styles.fileList}>
            {avis.coffreFort.map((file, i) => (
              <li key={i} style={styles.fileItem}>
                <a href={`http://localhost:5000/${file.fichier}`} target="_blank" rel="noreferrer" style={styles.link}>
                  {file.fichier.split("/").pop()}
                </a>
                <span style={styles.meta}>{new Date(file.dateAjout).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h3>Ajouter des fichiers :</h3>
        <input type="file" multiple onChange={(e) => setNewFiles(Array.from(e.target.files))} />
        {newFiles.length > 0 && (
          <ul style={styles.fileList}>
            {newFiles.map((file, i) => <li key={i} style={styles.fileItem}>{file.name}</li>)}
          </ul>
        )}
        <button onClick={handleUploadFiles} style={styles.uploadButton} disabled={uploading}>
          {uploading ? "Envoi..." : "Ajouter"}
        </button>
      </div>

      <div style={{ marginTop: "3rem" }}>
        <h3>Chat :</h3>
        <div style={styles.chatBox}>
          {avis.chat.length === 0 ? (
            <p style={styles.info}>Aucun message.</p>
          ) : (
            avis.chat.map((msg, i) => (
              <div key={i} style={styles.message}>
                <strong>{msg.auteurId?.email || "Utilisateur"}</strong>
                <p>{msg.texte}</p>
                <small>{new Date(msg.date).toLocaleString()}</small>
              </div>
            ))
          )}
        </div>

        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          rows={3}
          placeholder="Votre message..."
          style={styles.textarea}
        />
        <button onClick={handleSendMessage} style={styles.button}>Envoyer</button>
      </div>

      <button onClick={() => navigate("/mes-avis")} style={styles.back}>
        ⬅ Retour à mes avis
      </button>
    </div>
  );
};

const styles = {
  container: { maxWidth: "600px", margin: "2rem auto", padding: "2rem", fontFamily: "sans-serif" },
  heading: { fontSize: "1.5rem", marginBottom: "1rem" },
  error: { color: "red" },
  success: { color: "green" },
  coffreContainer: { marginTop: "1rem" },
  fileList: { listStyle: "none", padding: 0 },
  fileItem: { display: "flex", gap: "0.5rem", marginBottom: "0.5rem" },
  link: { color: "#1d4ed8", textDecoration: "underline" },
  meta: { fontSize: "0.85rem", color: "#6b7280" },
  uploadButton: { marginTop: "1rem", backgroundColor: "#16a34a", color: "white", border: "none", padding: "0.6rem 1rem", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
  chatBox: { marginTop: "1rem", background: "#f3f4f6", padding: "1rem", borderRadius: "8px", maxHeight: "300px", overflowY: "auto" },
  message: { marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "1px solid #e5e7eb" },
  textarea: { marginTop: "1rem", width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #ccc" },
  button: { marginTop: "1rem", backgroundColor: "#2563EB", color: "white", padding: "0.6rem 1.2rem", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
  back: { marginTop: "2rem", background: "none", border: "none", color: "#2563EB", cursor: "pointer", fontWeight: "bold" },
  info: { fontStyle: "italic", color: "#555" },
};

export default AvisDetail;
