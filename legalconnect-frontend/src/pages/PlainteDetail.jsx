// pages/PlainteDetail.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../services/AuthContext";
import Header from "../components/Layout/Header"; // Ajout du Header

const PlainteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [complaint, setComplaint] = useState(null);
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [newFiles, setNewFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const fetchComplaint = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/complaints/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaint(res.data.complaint);
      setTitre(res.data.complaint.titre);
      setDescription(res.data.complaint.description);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger la plainte");
    }
  };

  useEffect(() => { fetchComplaint(); }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/complaints/${id}`, { titre, description }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Plainte mise à jour avec succès !");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la mise à jour");
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm("Supprimer ce fichier définitivement ?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/complaints/${id}/coffre-fort/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComplaint();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression du fichier");
    }
  };

  const handleUploadFiles = async () => {
    if (newFiles.length === 0) return;
    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      for (const file of newFiles) {
        const formData = new FormData();
        formData.append("file", file);
        await axios.post(`http://localhost:5000/api/complaints/${id}/coffre-fort`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }
      setSuccess("Fichier(s) ajouté(s) avec succès !");
      setNewFiles([]);
      fetchComplaint();
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
      await axios.post(`http://localhost:5000/api/complaints/${id}/chat`, {
        message: newMessage.trim(),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewMessage("");
      fetchComplaint();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'envoi du message");
    }
  };

  if (!complaint) return <p style={{ padding: "2rem" }}>Chargement...</p>;

  return (
    <>
      <Header />
      <div style={styles.container}>
        <h2 style={styles.heading}>Détail de la plainte</h2>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <form onSubmit={handleUpdate} style={styles.form}>
          <label>Titre :</label>
          <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} style={styles.input} />

          <label>Description :</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} style={styles.textarea} />

          <button type="submit" style={styles.button}>Enregistrer les modifications</button>
        </form>

        <div style={styles.coffreContainer}>
          <h3>Fichiers du coffre-fort :</h3>
          {complaint.coffre_fort.length === 0 ? (
            <p style={styles.info}>Aucun fichier joint.</p>
          ) : (
            <ul style={styles.fileList}>
              {complaint.coffre_fort.map((file) => (
                <li key={file._id} style={styles.fileItem}>
                  <a href={`http://localhost:5000${file.url}`} target="_blank" rel="noopener noreferrer" style={styles.link}>
                    {file.nom_fichier}
                  </a>
                  <span style={styles.meta}>({file.type} – {new Date(file.date_upload).toLocaleDateString()})</span>
                  <button onClick={() => handleDeleteFile(file._id)} style={styles.deleteButton} title="Supprimer">🗑</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ marginTop: "2rem" }}>
          <h3>Ajouter de nouveaux fichiers :</h3>
          <input type="file" multiple onChange={(e) => setNewFiles(Array.from(e.target.files))} />
          {newFiles.length > 0 && (
            <ul style={styles.fileList}>
              {newFiles.map((file, i) => <li key={i} style={styles.fileItem}>{file.name}</li>)}
            </ul>
          )}
          <button onClick={handleUploadFiles} style={styles.uploadButton} disabled={uploading}>
            {uploading ? "Téléversement..." : "Ajouter au coffre-fort"}
          </button>
        </div>

        <div style={{ marginTop: "3rem" }}>
          <h3>Discussion :</h3>
          <div style={styles.chatBox}>
            {complaint.chat.length === 0 ? (
              <p style={styles.info}>Aucun message pour le moment.</p>
            ) : (
              complaint.chat.map((msg) => {
                const isParticulier = msg.expediteur?.role === "particulier";
                return (
                  <div
                    key={msg._id}
                    style={{
                      ...styles.message,
                      alignSelf: isParticulier ? "flex-end" : "flex-start",
                      backgroundColor: isParticulier ? "#dbeafe" : "#f3f4f6",
                    }}
                  >
                    <strong>{msg.expediteur?.prenom || msg.expediteur?.email || "Utilisateur"}</strong>
                    {msg.expediteur?.role && (
                      <span
                        style={{
                          ...styles.tag,
                          backgroundColor: isParticulier ? "#a5b4fc" : "#cbd5e1",
                          color: isParticulier ? "#1e3a8a" : "#374151",
                        }}
                      >
                        {msg.expediteur.role}
                      </span>
                    )}
                    <p>{msg.message}</p>
                    <small>{new Date(msg.date).toLocaleString()}</small>
                  </div>
                );
              })
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

        <button onClick={() => navigate("/mes-plaintes")} style={styles.back}>
          ⬅ Retour à mes plaintes
        </button>
      </div>
    </>
  );
};

const styles = {
  container: { maxWidth: "600px", margin: "2rem auto", padding: "2rem", fontFamily: "sans-serif" },
  heading: { fontSize: "1.5rem", marginBottom: "1rem" },
  form: { display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" },
  input: { padding: "0.6rem", fontSize: "1rem", borderRadius: "8px", border: "1px solid #ccc" },
  textarea: { padding: "0.6rem", fontSize: "1rem", borderRadius: "8px", border: "1px solid #ccc" },
  button: { padding: "0.8rem", backgroundColor: "#2563EB", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
  back: { marginTop: "2rem", background: "none", border: "none", color: "#2563EB", cursor: "pointer", fontWeight: "bold" },
  error: { color: "red" },
  success: { color: "green" },
  coffreContainer: { marginTop: "1rem" },
  fileList: { listStyle: "none", padding: 0, marginTop: "0.5rem" },
  fileItem: { marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" },
  link: { color: "#1d4ed8", textDecoration: "underline" },
  meta: { fontSize: "0.85rem", color: "#6b7280" },
  deleteButton: { background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "1rem" },
  uploadButton: { marginTop: "1rem", padding: "0.6rem 1rem", backgroundColor: "#16a34a", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "1rem" },
  info: { fontStyle: "italic", color: "#555" },
  chatBox: { marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem", maxHeight: "300px", overflowY: "auto" },
  message: { padding: "1rem", borderRadius: "12px", maxWidth: "80%", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", fontSize: "0.95rem" },
  tag: { marginLeft: "0.5rem", fontSize: "0.75rem", padding: "2px 6px", borderRadius: "6px", fontWeight: "bold" },
};

export default PlainteDetail;
