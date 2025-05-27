// pages/PlainteDetailJuridique.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../services/AuthContext";
import SuiviJuridique from "../components/SuiviJuridique";

const PlainteDetailJuridique = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [complaint, setComplaint] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [paiementForm, setPaiementForm] = useState({
  type: "honoraires",
  montant: "",
  description: "",
  fichier: null
});
const [paiements, setPaiements] = useState([]);


  const fetchComplaint = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/complaints/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaint(res.data.complaint);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement de la plainte");
    }
  };

  const fetchPaiements = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`http://localhost:5000/api/complaints/${id}/paiements`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPaiements(res.data);
  } catch (err) {
    console.error("Erreur de chargement des paiements", err);
  }
};

useEffect(() => {
  if (activeTab === "paiements") {
    fetchPaiements();
  }
}, [activeTab]);


  useEffect(() => { fetchComplaint(); }, [id]);

  useEffect(() => {
    if (complaint?.chat?.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [complaint?.chat?.length]);

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

const demanderPaiement = async () => {
  try {
    const token = localStorage.getItem("token");
    await axios.post(`http://localhost:5000/api/complaints/${id}/paiement`, {
      ...paiementForm,
      destinataire: user.id
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setSuccess("Demande de paiement enregistrée !");
    setPaiementForm({ type: "honoraires", montant: "", description: "", fichier: null });
    fetchPaiements(); // recharge les paiements visibles
  } catch (err) {
    console.error(err);
    setError("Erreur lors de la demande de paiement.");
  }
};



  if (!complaint) return <p style={{ padding: "2rem" }}>Chargement...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1.5rem" }}>
      <h2 style={{ fontSize: "1.8rem", color: "#1d4ed8", marginBottom: "1rem" }}>
        Plainte : {complaint.titre}
      </h2>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <button onClick={() => setActiveTab("details")} style={activeTab === "details" ? styles.activeTab : styles.tab}>Détails</button>
        <button onClick={() => setActiveTab("chat")} style={activeTab === "chat" ? styles.activeTab : styles.tab}>Chat</button>
        <button onClick={() => setActiveTab("files")} style={activeTab === "files" ? styles.activeTab : styles.tab}>Coffre-fort</button>
        <button onClick={() => setActiveTab("settings")} style={activeTab === "settings" ? styles.activeTab : styles.tab}>Paramètres</button>
        <button onClick={() => setActiveTab("suivi")} style={activeTab === "suivi" ? styles.activeTab : styles.tab}>Suivi juridique</button>
        <button onClick={() => setActiveTab("paiements")} style={activeTab === "paiements" ? styles.activeTab : styles.tab}>Paiements</button>

      </div>

      {activeTab === "details" && (
        <div>
          <p><strong>Description :</strong> {complaint.description}</p>
          <p><strong>Statut :</strong> {complaint.statut}</p>
          <p><strong>Visibilité :</strong> {complaint.visibilite}</p>
          <p>
  <strong>Créateur :</strong>{" "}
  <span
    onClick={() => navigate(`/profil/${complaint.utilisateur?._id}`)}
    style={{ color: "#2563EB", cursor: "pointer", textDecoration: "underline" }}
  >
    {complaint.utilisateur?.prenom} {complaint.utilisateur?.nom} ({complaint.utilisateur?.email})
  </span>
</p>

          <p><strong>Date de dépôt :</strong> {new Date(complaint.date_creation).toLocaleDateString()}</p>
        </div>
      )}

      {activeTab === "chat" && (
        <div>
          <div style={styles.chatBox}>
            {complaint.chat.map((msg) => (
  <div key={msg._id} style={styles.message}>
    <strong
      onClick={() => navigate(`/profil/${msg.expediteur?._id}`)}
      style={{ color: "#2563EB", cursor: "pointer", textDecoration: "underline" }}
    >
      {msg.expediteur?.prenom || msg.expediteur?.email}
    </strong>{" "}
    – {new Date(msg.date).toLocaleString()}<br />
    {msg.message}
  </div>
))}

            <div ref={messagesEndRef} />
          </div>
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            rows={3}
            placeholder="Votre message..."
            style={{ width: "100%", marginTop: "1rem", padding: "0.5rem" }}
          />
          <button onClick={handleSendMessage} style={styles.button}>Envoyer</button>
        </div>
      )}

      {activeTab === "files" && (
        <div>
          <h3>Fichiers :</h3>
          {complaint.coffre_fort?.length === 0 ? <p>Aucun fichier</p> : (
            <ul>
              {complaint.coffre_fort.map((file) => (
                <li key={file._id}>
                  <a href={`http://localhost:5000${file.url}`} target="_blank" rel="noopener noreferrer">
                    {file.nom_fichier || "Voir le fichier"}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {activeTab === "settings" && (
        <div>
          <p><strong>Participants :</strong></p>
          <ul>
  {complaint.participants.map((p, index) => (
    <li
      key={index}
      onClick={() => navigate(`/profil/${p._id}`)}
      style={{ color: "#2563EB", cursor: "pointer", textDecoration: "underline" }}
    >
      {p.prenom || p.email}
    </li>
  ))}
</ul>

          <button onClick={() => navigator.clipboard.writeText(window.location.href)} style={styles.button}>Partager / Copier le lien</button>
        </div>
      )}
      {activeTab === "suivi" && (
  <SuiviJuridique plainteId={id} />
)}

{activeTab === "paiements" && (
  <div>
    <h3>Demander un paiement</h3>
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
      <select value={paiementForm.type} onChange={(e) => setPaiementForm({ ...paiementForm, type: e.target.value })}>
        <option value="honoraires">Honoraires</option>
        <option value="huissier">Huissier</option>
        <option value="autre">Autre</option>
      </select>
      <input
        type="number"
        placeholder="Montant en €"
        value={paiementForm.montant}
        onChange={(e) => setPaiementForm({ ...paiementForm, montant: e.target.value })}
      />
      <textarea
        placeholder="Description"
        value={paiementForm.description}
        onChange={(e) => setPaiementForm({ ...paiementForm, description: e.target.value })}
      />
      {/* (Plus tard : ajouter upload fichier) */}
      <button onClick={demanderPaiement} style={styles.button}>📩 Demander le paiement</button>
    </div>
  </div>
)}
<h4 style={{ marginTop: "1rem" }}>Paiements demandés :</h4>
{paiements.length === 0 ? (
  <p>Aucun paiement enregistré pour cette plainte.</p>
) : (
  paiements.map((p, i) => (
    <div key={i} style={{ border: "1px solid #ccc", padding: "0.5rem", marginBottom: "0.5rem", borderRadius: "6px" }}>
      <strong>Type :</strong> {p.type}<br />
      <strong>Montant :</strong> {p.montant}€<br />
      <strong>Description :</strong> {p.description}<br />
      <strong>Status :</strong> {p.statut}<br />
      <strong>Demandé par :</strong> {p.destinataire?.prenom || p.destinataire?.email}
    </div>
  ))
)}



      <button onClick={() => navigate(-1)} style={{ marginTop: "2rem", background: "none", border: "none", color: "#2563EB", cursor: "pointer" }}>
        ⬅ Retour
      </button>

      {complaint.participants?.map(p => p._id?.toString()).includes(user?.id) ? (
  <button
    onClick={async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(`http://localhost:5000/api/complaints/${id}/suivre`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setComplaint(res.data.complaint);
      } catch (err) {
        console.error(err);
      }
    }}
    style={styles.unfollowButton}
  >
    ❌ Ne plus suivre cette plainte
  </button>
) : (
  <button
    onClick={async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(`http://localhost:5000/api/complaints/${id}/suivre`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setComplaint(res.data.complaint);
      } catch (err) {
        console.error(err);
      }
    }}
    style={styles.followButton}
  >
    🔔 Suivre cette plainte
  </button>
)}



    </div>
  );
};

const styles = {
  tab: { padding: "0.5rem 1rem", backgroundColor: "#e5e7eb", border: "none", borderRadius: "6px", cursor: "pointer" },
  activeTab: { padding: "0.5rem 1rem", backgroundColor: "#2563EB", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
  button: { padding: "0.5rem 1rem", backgroundColor: "#2563EB", color: "white", border: "none", borderRadius: "6px", marginTop: "1rem" },
  chatBox: { maxHeight: "300px", overflowY: "auto", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" },
  message: { backgroundColor: "#f3f4f6", padding: "0.8rem", borderRadius: "6px", marginBottom: "0.5rem" },
  followButton: {
  marginTop: "1rem",
  padding: "0.5rem 1rem",
  backgroundColor: "#1e40af",
  color: "white",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
},
unfollowButton: {
  marginTop: "1rem",
  padding: "0.5rem 1rem",
  backgroundColor: "#991b1b",
  color: "white",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
},

};

export default PlainteDetailJuridique;
