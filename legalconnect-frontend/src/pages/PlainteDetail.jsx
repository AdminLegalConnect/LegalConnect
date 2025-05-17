// pages/PlainteDetail.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../services/AuthContext";
import Header from "../components/Layout/Header";

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
  const [activeTab, setActiveTab] = useState("details");

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
        <h2 style={styles.heading}>Plainte : {complaint.titre}</h2>

        <div style={styles.tabBar}>
          <button onClick={() => setActiveTab("details")} style={activeTab === "details" ? styles.activeTab : styles.tab}>Détails</button>
          <button onClick={() => setActiveTab("chat")} style={activeTab === "chat" ? styles.activeTab : styles.tab}>Chat</button>
          <button onClick={() => setActiveTab("files")} style={activeTab === "files" ? styles.activeTab : styles.tab}>Coffre-fort</button>
          <button onClick={() => setActiveTab("settings")} style={activeTab === "settings" ? styles.activeTab : styles.tab}>Paramètres</button>
        </div>

        {activeTab === "details" && (
          <form onSubmit={handleUpdate} style={styles.form}>
            <label>Titre :</label>
            <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} style={styles.input} />

            <label>Description :</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} style={styles.textarea} />

            <button type="submit" style={styles.button}>Enregistrer</button>
          </form>
        )}

        {activeTab === "chat" && (
          <div style={styles.chatBox}>
            {complaint.chat.length === 0 ? <p>Aucun message</p> : (
              complaint.chat.map((msg) => (
                <div key={msg._id} style={styles.message}>
                  <strong>{msg.expediteur?.prenom || msg.expediteur?.email || "Utilisateur"}</strong>
                  <p>{msg.message}</p>
                  <small>{new Date(msg.date).toLocaleString()}</small>
                </div>
              ))
            )}
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={3}
              placeholder="Votre message..."
              style={styles.textarea}
            />
            <button onClick={handleSendMessage} style={styles.button}>Envoyer</button>
          </div>
        )}

        {activeTab === "files" && (
          <div>
            <h3>Fichiers :</h3>
            {complaint.coffre_fort.length === 0 ? <p>Aucun fichier</p> : (
              <ul>
                {complaint.coffre_fort.map((file) => (
                  <li key={file._id}>
                    <a href={`http://localhost:5000${file.url}`} target="_blank" rel="noopener noreferrer">{file.nom_fichier}</a>
                  </li>
                ))}
              </ul>
            )}
            <input type="file" multiple onChange={(e) => setNewFiles(Array.from(e.target.files))} />
            <button onClick={handleUploadFiles} style={styles.uploadButton} disabled={uploading}>
              {uploading ? "Envoi..." : "Ajouter fichier"}
            </button>
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <p>🔒 Paramètres à venir : inviter des participants, partager, supprimer...</p>
          </div>
        )}

        <button onClick={() => navigate("/mes-plaintes")} style={styles.back}>⬅ Retour</button>
      </div>
    </>
  );
};

const styles = {
  container: { maxWidth: "700px", margin: "2rem auto", padding: "2rem" },
  heading: { fontSize: "1.8rem", marginBottom: "1rem" },
  tabBar: { display: "flex", gap: "1rem", marginBottom: "1rem" },
  tab: { padding: "0.5rem 1rem", backgroundColor: "#e5e7eb", border: "none", borderRadius: "6px", cursor: "pointer" },
  activeTab: { padding: "0.5rem 1rem", backgroundColor: "#2563EB", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  input: { padding: "0.6rem", borderRadius: "8px", border: "1px solid #ccc" },
  textarea: { padding: "0.6rem", borderRadius: "8px", border: "1px solid #ccc" },
  button: { marginTop: "1rem", padding: "0.8rem", backgroundColor: "#2563EB", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" },
  back: { marginTop: "2rem", background: "none", border: "none", color: "#2563EB", cursor: "pointer" },
  chatBox: { display: "flex", flexDirection: "column", gap: "1rem" },
  message: { backgroundColor: "#f3f4f6", padding: "1rem", borderRadius: "8px" },
  uploadButton: { marginTop: "1rem", backgroundColor: "#16a34a", color: "white", border: "none", padding: "0.6rem 1rem", borderRadius: "8px" }
};

export default PlainteDetail;
