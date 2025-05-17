// pages/avisDetail.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../services/AuthContext";
import Header from "../components/Layout/Header";

const avisDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
};


  const [avis, setavis] = useState(null);
  useEffect(() => {
  if (avis && !avis.coffreFort) {
    setAvis((prev) => ({ ...prev, coffreFort: [] }));
  }
}, [avis]);

const [newFile, setNewFile] = useState(null);
const [fileDescription, setFileDescription] = useState("");
const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [newFiles, setNewFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [emailInvite, setEmailInvite] = useState("");

  const fetchavis = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = token
        ? `http://localhost:5000/api/avis/${id}`
        : `http://localhost:5000/api/public-avis/${id}`;

      const res = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setavis(res.data.avis);
      setTitre(res.data.avis.titre);
      setDescription(res.data.avis.description);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger la avis");
    }
  };

  useEffect(() => { fetchavis(); }, [id]);

  useEffect(() => {
  if (avis?.chat?.length) {
    scrollToBottom();
  }
}, [avis?.chat?.length]);

  useEffect(() => {
  if (avis && user) {
    console.log("User ID :", user._id);
    console.log("Créateur ID :", avis.utilisateur?._id);
  }
}, [avis, user]);


  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/avis/${id}`, { titre, description }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("avis mise à jour avec succès !");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la mise à jour");
    }
  };

  const handleInvite = async () => {
    if (!emailInvite.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/avis/${id}/inviter`, { email: emailInvite }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Participant invité avec succès !");
      setEmailInvite("");
      fetchavis();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'invitation");
    }
  };


  const handleDeleteavis = async () => {
    if (!window.confirm("Supprimer définitivement cette avis ?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/avis/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/mes-avis");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression de la avis");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setSuccess("Lien copié dans le presse-papiers");
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/avis/${id}/chat`, {
  texte: newMessage.trim(),
}, {
  headers: { Authorization: `Bearer ${token}` },
});
      setNewMessage("");
      fetchavis();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'envoi du message");
    }
  };

  const handleUploadFiles = async () => {
  if (!newFile || !user) return;
  setUploading(true);
  try {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("fichier", newFile);
    formData.append("avisId", id);
    formData.append("description", fileDescription);

    await axios.post(`http://localhost:5000/api/avis/coffre-fort`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    setSuccess("Fichier ajouté avec succès !");
    setNewFile(null);
    setFileDescription("");
    fetchavis();
  } catch (err) {
    console.error(err);
    setError("Erreur lors de l'envoi du fichier");
  } finally {
    setUploading(false);
  }
};


  const handleDeleteFile = async (fileId) => {
    if (!window.confirm("Supprimer ce fichier définitivement ?") || !user) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/avis/${id}/coffre-fort/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchavis();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression du fichier");
    }
  };

  const handleRemoveParticipant = async (participantId) => {
    if (!window.confirm("Retirer ce participant ?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/avis/${id}/participants/${participantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Participant retiré avec succès");
      fetchavis();
    } catch (err) {
      console.error(err);
      setError("Erreur lors du retrait du participant");
    }
  };

console.log("Contenu de user depuis le context :", user)

  if (!avis) return <p style={{ padding: "2rem" }}>Chargement...</p>;
const isCreator = user && avis.utilisateur && (user._id === avis.utilisateur._id || user.id === avis.utilisateur._id);

  return (
    <>
      <Header />
      <div style={styles.container}>
        <h2 style={styles.heading}>avis : {avis.titre}</h2>

        <div style={styles.tabBar}>
          <button onClick={() => setActiveTab("details")} style={activeTab === "details" ? styles.activeTab : styles.tab}>Détails</button>
          <button
    onClick={() => {
      setActiveTab("chat");
      setTimeout(() => scrollToBottom(), 100);
    }}
    style={activeTab === "chat" ? styles.activeTab : styles.tab}
  >
    Chat
  </button>
          <button onClick={() => setActiveTab("files")} style={activeTab === "files" ? styles.activeTab : styles.tab}>Coffre-fort</button>
          {user && (
            <button onClick={() => setActiveTab("settings")} style={activeTab === "settings" ? styles.activeTab : styles.tab}>Paramètres</button>
          )}
        </div>

        {success && <p style={{ color: "green" }}>{success}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {activeTab === "details" && (
  user && avis.utilisateurId && (user._id === avis.utilisateurId._id || user._id === avis.utilisateurId) ? (
    <form onSubmit={handleUpdate} style={styles.form}>
      <label>Titre :</label>
      <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} style={styles.input} />

      <label>Description :</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} style={styles.textarea} />

      <button type="submit" style={styles.button}>Enregistrer</button>
    </form>
  ) : (
    <div>
      <p><strong>Titre :</strong> {titre}</p>
      <p><strong>Description :</strong> {description}</p>
    </div>
  )
)}




        {activeTab === "chat" && (
  <div style={styles.chatContainer}>
    <div style={styles.chatMessages}>
      {avis.chat.map((msg) => {
  const auteur = msg.auteurId;
  const isCurrentUser = (user?.id || user?._id) === auteur?._id;
  const isJuridique = auteur?.role === "juridique";


        return (
          <div
            key={msg._id}
            style={{
              alignSelf: isCurrentUser ? "flex-end" : "flex-start",
              backgroundColor: isCurrentUser ? "#dbeafe" : isJuridique ? "#fef9c3" : "#e5e7eb",
              color: "#111827",
              borderRadius: "12px",
              padding: "0.8rem",
              maxWidth: "75%",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              marginBottom: "1rem",
            }}
          >
            <div style={{ fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.3rem" }}>
              {auteur?.role === "juridique" ? "🧑‍⚖️ " : "🙋 "} 
              {auteur?.prenom?.trim() ? auteur.prenom : auteur?.email}
              {auteur?.role ? ` - ${auteur.role}` : ""}
            </div>
            <div>{msg.texte}</div>
            <div style={{ fontSize: "0.75rem", marginTop: "0.5rem", color: "#6b7280" }}>
              {new Date(msg.date).toLocaleString("fr-FR")}
            </div>
          </div>
        );
      })}

       <div ref={messagesEndRef} style={{ height: 1 }} />
    </div>

    {user && (
      <div style={styles.chatInputBox}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          rows={2}
          placeholder="Votre message..."
          style={styles.chatTextarea}
        />
        <button onClick={handleSendMessage} style={styles.chatSendButton}>
          Envoyer
        </button>
      </div>
    )}
  </div>
)}


        

        {activeTab === "files" && (
  <div>
    <h3>Fichiers :</h3>
    {!avis?.coffreFort || avis.coffreFort.length === 0 ? (
      <p>Aucun fichier</p>
    ) : (
      <ul>
        {avis.coffreFort.map((file, index) => (
          <li key={index}>
            <a href={`http://localhost:5000/${file.fichier}`} target="_blank" rel="noopener noreferrer">
              {file.description || "Voir le fichier"}
            </a>
          </li>
        ))}
      </ul>
    )}

    {user && (
      <>
        <input
  type="file"
  onChange={(e) => setNewFile(e.target.files[0])}
/>
<input
  type="text"
  placeholder="Description"
  value={fileDescription}
  onChange={(e) => setFileDescription(e.target.value)}
  style={{ marginLeft: "0.5rem" }}
/>
<button
  onClick={handleUploadFiles}
  style={styles.uploadButton}
  disabled={uploading}
>
  {uploading ? "Envoi..." : "Ajouter fichier"}
</button>

      </>
    )}
  </div>
)}


        {activeTab === "settings" && user && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label>Inviter un participant :</label><br />
              <input type="email" placeholder="Email" value={emailInvite} onChange={(e) => setEmailInvite(e.target.value)} style={styles.input} />
              <button onClick={handleInvite} style={styles.button}>Inviter</button>
            </div>




            {avis.utilisateur && (
              <div>
                <p><strong>Créateur :</strong> {avis.utilisateur.prenom || avis.utilisateur.email}</p>
              </div>
            )}

            {avis.participants && avis.participants.length > 0 && (
              <div>
                <p><strong>Participants :</strong></p>
                <ul>
  {avis.participants.map((p, index) => (
    <li key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
      <span>{p.prenom || p.email}</span>
      {user && avis.utilisateur && (user.id || user._id)?.toString() === avis.utilisateur._id?.toString()
 && (
        <button
          onClick={() => handleRemoveParticipant(p._id)}
          style={{ ...styles.deleteButton, padding: "0.3rem 0.6rem", fontSize: "0.8rem" }}
        >
          Supprimer
        </button>
      )}
    </li>
  ))}
</ul>

              </div>
            )}

            <button onClick={handleCopyLink} style={styles.button}>Partager / Copier le lien</button>
            {user && avis.utilisateur && (user._id || user.id) === avis.utilisateur._id && (
  <button onClick={handleDeleteavis} style={styles.deleteButton}>
    🗑 Supprimer la avis
  </button>
)}

          </div>
        )}

        <button onClick={() => navigate("/mes-avis")} style={styles.back}>⬅ Retour</button>
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
  button: { padding: "0.8rem", backgroundColor: "#2563EB", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" },
  deleteButton: { padding: "0.8rem", backgroundColor: "#dc2626", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" },
  back: { marginTop: "2rem", background: "none", border: "none", color: "#2563EB", cursor: "pointer" },
  chatBox: { display: "flex", flexDirection: "column", gap: "1rem" },
  message: { backgroundColor: "#f3f4f6", padding: "1rem", borderRadius: "8px" },
  uploadButton: { marginTop: "1rem", backgroundColor: "#16a34a", color: "white", border: "none", padding: "0.6rem 1rem", borderRadius: "8px" },
  chatContainer: {
  display: "flex",
  flexDirection: "column",
  height: "60vh",
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  overflow: "hidden",
},

chatMessages: {
  flex: 1,
  overflowY: "auto",
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
},

chatInputBox: {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  padding: "1rem",
  gap: "0.5rem",
  backgroundColor: "#f9fafb",
  borderTop: "1px solid #e5e7eb",
},

chatTextarea: {
  flex: 1,
  padding: "0.6rem",
  borderRadius: "12px",
  border: "1px solid #ccc",
  resize: "none",
  fontSize: "1rem",
},

chatSendButton: {
  backgroundColor: "#2563EB",
  color: "white",
  border: "none",
  padding: "0.6rem 1rem",
  borderRadius: "8px",
  cursor: "pointer",
}

  
};

export default avisDetail;
