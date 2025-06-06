// pages/PlainteDetail.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../services/AuthContext";
import NotationJuridique from "../components/NotationJuridique";

const PlainteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
};


  const [complaint, setComplaint] = useState(null);
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [newFiles, setNewFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [emailInvite, setEmailInvite] = useState("");
  const [paiements, setPaiements] = useState([]);
  const [montantsLibres, setMontantsLibres] = useState({});
  const [query, setQuery] = useState("");
const [resultatsRecherche, setResultatsRecherche] = useState([]);

const rechercherJuridiques = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`http://localhost:5000/api/juridiques/recherche?q=${query}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setResultatsRecherche(res.data);
  } catch (err) {
    console.error("Erreur recherche juridiques", err);
    setError("Erreur lors de la recherche de juridiques.");
  }
};


  const fetchComplaint = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = token
        ? `http://localhost:5000/api/complaints/${id}`
        : `http://localhost:5000/api/public-complaints/${id}`;

      const res = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
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

  const [avocatsDejaNotes, setAvocatsDejaNotes] = useState([]);

useEffect(() => {
  if (!user || !complaint) return;

  const notesExistantes = complaint.participants
    ?.filter(p => p.role === "juridique")
    .filter(avocat => {
      return avocat.notes?.some(
        note =>
          note.auteurId?.toString() === (user._id || user.id) &&
          note.plainte?.toString() === complaint._id
      );
    })
    .map(av => av._id);

  setAvocatsDejaNotes(notesExistantes);
}, [complaint, user]);


  useEffect(() => {
  const fetchPaiements = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("Aucun token détecté, fetchPaiements annulé.");
    return;
  }

  try {
    const res = await axios.get(`http://localhost:5000/api/complaints/${id}/paiements`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const paiementsAvecStatut = res.data.map((p) => {
      const totalPaye = p.participants?.reduce((sum, part) => sum + (part.montant || 0), 0);
      const dejaPayeParMoi = p.participants?.some((part) => part.user === user?.id);
      return {
        ...p,
        totalPaye,
        dejaPayeParMoi,
      };
    });

    setPaiements(paiementsAvecStatut);
  } catch (err) {
    console.error("Erreur fetchPaiements:", err);
  }
};


  fetchPaiements();
}, [id, user]);



  useEffect(() => {
  if (complaint?.chat?.length) {
    scrollToBottom();
  }
}, [complaint?.chat?.length]);

useEffect(() => {
  if (complaint && user) {
    const userId = user?._id || user?.id;
    console.log("User ID :", userId);
    console.log("Créateur ID :", complaint.utilisateur?._id);
  }
}, [complaint, user]);


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

  const handleInvite = async () => {
    if (!emailInvite.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/complaints/${id}/inviter`, { email: emailInvite }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Participant invité avec succès !");
      setEmailInvite("");
      fetchComplaint();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'invitation");
    }
  };

  const handleVisibilite = async () => {
    const nouvelleVisibilite = complaint.visibilite === "publique" ? "privée" : "publique";
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/complaints/${id}/visibilite`, { visibilite: nouvelleVisibilite }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(`Plainte rendue ${nouvelleVisibilite}`);
      fetchComplaint();
    } catch (err) {
      console.error(err);
      setError("Erreur lors du changement de visibilité");
    }
  };

  const handleDeleteComplaint = async () => {
    if (!window.confirm("Supprimer définitivement cette plainte ?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/complaints/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/mes-plaintes");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression de la plainte");
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

  const handleUploadFiles = async () => {
    if (newFiles.length === 0 || !user) return;
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

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm("Supprimer ce fichier définitivement ?") || !user) return;
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

  const handleRemoveParticipant = async (participantId) => {
    if (!window.confirm("Retirer ce participant ?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/complaints/${id}/participants/${participantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Participant retiré avec succès");
      fetchComplaint();
    } catch (err) {
      console.error(err);
      setError("Erreur lors du retrait du participant");
    }
  };


const inviterJuridique = async (juridique) => {
  try {
    const token = localStorage.getItem("token");
    await axios.post(`http://localhost:5000/api/complaints/${id}/inviter`, {
      email: juridique.email,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Juridique invité !");
    fetchComplaint();
  } catch (err) {
    console.error("Erreur lors de l'invitation :", err);
    alert("Erreur lors de l'invitation.");
  }
};


const envoyerMessage = (email) => {
  window.location.href = `mailto:${email}`;
};


console.log("Contenu de user depuis le context :", user)

  if (!complaint) return <p style={{ padding: "2rem" }}>Chargement...</p>;
const isCreator = user && complaint.utilisateur && String(user.id) === String(complaint.utilisateur._id);

  return (
    <>
      <div style={styles.container}>
        <h2 style={styles.heading}>Plainte : {complaint.titre}</h2>

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
          {user && (
  <button onClick={() => setActiveTab("paiements")} style={activeTab === "paiements" ? styles.activeTab : styles.tab}>
    Paiements
  </button>
)}

        </div>

        {success && <p style={{ color: "green" }}>{success}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {activeTab === "details" && (
  isCreator ? (
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
      {complaint.chat.map((msg) => {
        const expediteur = msg.expediteur;
        const isCurrentUser = (user?.id || user?._id) === expediteur?._id;
        const isJuridique = expediteur?.role === "juridique";

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
              {expediteur?.role === "juridique" ? "🧑‍⚖️ " : "🙋 "} 
              <span
  onClick={() => navigate(`/profil/${expediteur._id}`)}
  style={{ cursor: "pointer", textDecoration: "underline" }}
>
  {expediteur?.prenom || expediteur?.email}
</span>

              {expediteur?.role ? ` - ${expediteur.role}` : ""}
            </div>
            <div>{msg.message}</div>
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
            {!complaint.coffre_fort || complaint.coffre_fort.length === 0 ? <p>Aucun fichier</p> : (
              <ul>
                {complaint.coffre_fort.map((file) => (
                  <li key={file._id}>
                    <a href={`http://localhost:5000${file.url}`} target="_blank" rel="noopener noreferrer">{file.nom_fichier}</a>
                  </li>
                ))}
              </ul>
            )}
            {user && (
              <>
                <input type="file" multiple onChange={(e) => setNewFiles(Array.from(e.target.files))} />
                <button onClick={handleUploadFiles} style={styles.uploadButton} disabled={uploading}>
                  {uploading ? "Envoi..." : "Ajouter fichier"}
                </button>
              </>
            )}
          </div>
        )}

        {activeTab === "settings" && user && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
           <div>
  <h4>🔍 Rechercher un juridique :</h4>
  <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nom, spécialité..." />
  <button onClick={rechercherJuridiques}>Rechercher</button>

  <ul>
    {resultatsRecherche.map(j => (
      <li key={j._id} style={{ marginBottom: "1rem" }}>
        <strong>{j.prenom} {j.nom}</strong> – {j.specialite} <br />
        Note : {j.moyenneNote ? `⭐ ${j.moyenneNote}/5` : "Non noté"}
        <br />
        <button onClick={() => inviterJuridique(j)}>Inviter à cette plainte</button>
        <button onClick={() => envoyerMessage(j.email)}>Envoyer un message</button>
      </li>
    ))}
  </ul>
</div>

            <div>
              <label>Inviter un participant :</label><br />
              <input type="email" placeholder="Email" value={emailInvite} onChange={(e) => setEmailInvite(e.target.value)} style={styles.input} />
              <button onClick={handleInvite} style={styles.button}>Inviter</button>
            </div>

            <div>
  <p>Visibilité actuelle : <strong>{complaint.visibilite}</strong></p>
  {isCreator && (
    <button onClick={handleVisibilite} style={styles.button}>
      Rendre {complaint.visibilite === "publique" ? "privée" : "publique"}
    </button>
  )}
</div>


            {complaint.utilisateur && (
              <div>
                <p>
  <strong>Créateur :</strong>{" "}
  <span
    onClick={() => navigate(`/profil/${complaint.utilisateur._id}`)}
    style={{ cursor: "pointer", textDecoration: "underline" }}
  >
    {complaint.utilisateur.prenom || complaint.utilisateur.email}
  </span>
</p>

              </div>
            )}

            {complaint.participants && complaint.participants.length > 0 && (
              <div>
                <p><strong>Participants :</strong></p>
                <ul>
  {complaint.participants.map((p, index) => (
    <li key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
      <span
  onClick={() => navigate(`/profil/${p._id}`)}
  style={{ cursor: "pointer", textDecoration: "underline" }}
>
  {p.prenom || p.email}
</span>

      {user && complaint.utilisateur && (user.id || user._id)?.toString() === complaint.utilisateur._id?.toString()
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

            {isCreator && complaint.statut !== "résolue" && (
  <button
    onClick={async () => {
      if (!window.confirm("Clôturer définitivement cette plainte ?")) return;
      try {
        const token = localStorage.getItem("token");
        await axios.put(`http://localhost:5000/api/complaints/${id}/status`, {
          statut: "résolue"
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess("Plainte clôturée avec succès !");
        fetchComplaint();
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la clôture de la plainte");
      }
    }}
    style={{
      backgroundColor: "#16a34a",
      color: "white",
      border: "none",
      padding: "0.8rem",
      borderRadius: "8px",
      cursor: "pointer"
    }}
  >
    ✅ Clôturer la plainte
  </button>
)}


            <button onClick={handleCopyLink} style={styles.button}>Partager / Copier le lien</button>
            {user && complaint.utilisateur && (user._id || user.id) === complaint.utilisateur._id && (
  <button onClick={handleDeleteComplaint} style={styles.deleteButton}>
    🗑 Supprimer la plainte
  </button>
)}

          </div>
        )}

        {activeTab === "paiements" && (
  <div>
    <h3>💸 Paiements en lien avec cette plainte</h3>
    {!paiements || paiements.length === 0 ? (
      <p>Aucun paiement pour cette plainte.</p>
    ) : (
      paiements.map((p, i) => {
  const maPart = user ? p.participants?.find(pr => pr.user === (user._id || user.id)) : null;
  const aPayer = p.typePaiement === "partagé" ? maPart?.montant : p.montant;
  const dejaPaye = p.typePaiement === "partagé" ? maPart?.statut === "payé" : p.statut === "payé";
  const paiementRegle = p.totalPaye >= p.montant;

  return (
    <div key={i} style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "6px", marginBottom: "1rem" }}>
      {paiementRegle && (
        <div style={{ marginBottom: "0.5rem", color: "green", fontWeight: "bold" }}>
          ✅ Paiement réglé dans sa totalité
        </div>
      )}
      <strong>Type :</strong> {p.type} <br />
      <strong>Montant :</strong> {p.montant}€ <br />
      <strong>Description :</strong> {p.description} <br />
      <strong>Status :</strong> {p.status || "en attente"} <br />
      <strong>Demandé par :</strong> {p.destinataire?.prenom || p.destinataire?.email} <br />
      <strong>Votre part :</strong> {aPayer ?? "-"}€ <br />
      <strong>Statut :</strong>{" "}
      <span style={{ color: dejaPaye ? "green" : "red", fontWeight: "bold" }}>
        {dejaPaye ? "✅ Payé" : "❌ À payer"}
      </span>
      <br />

      {/* Liste des contributions */}
      {p.participants?.length > 0 && (
        <div style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
          <strong>Contributions :</strong>
         <ul>
  {p.participants.map((part, index) => {
    const idPart = typeof part.user === "object" ? part.user._id : part.user;
    const userContrib = complaint.participants?.find(
  (cp) => String(cp._id) === String(idPart)
) || (String(complaint.utilisateur?._id) === String(idPart) ? complaint.utilisateur : null);

const nomAffiche =
  userContrib?.prenom || userContrib?.email || "Utilisateur inconnu";


    return (
      <li key={index}>
        {nomAffiche} : {part?.montant} € {part?.statut === "payé" ? "✅" : ""}
      </li>
    );
  })}
</ul>


        </div>
      )}

      {/* Champ paiement */}
      {!p.dejaPayeParMoi && !paiementRegle && (
        <div style={{ marginTop: "0.5rem" }}>
          <input
            type="number"
            placeholder="Montant à payer (€)"
            value={montantsLibres[p._id] || ""}
            onChange={(e) =>
              setMontantsLibres({ ...montantsLibres, [p._id]: e.target.value })
            }
            style={{
              marginRight: "0.5rem",
              padding: "0.4rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={async () => {
              const montant = parseFloat(montantsLibres[p._id]);
              const token = localStorage.getItem("token");

              if (!montant || montant <= 0) {
                alert("Veuillez entrer un montant valide.");
                return;
              }

              try {
                await axios.patch(
                  `http://localhost:5000/api/complaints/${id}/paiements/${p._id}/part`,
                  { montant },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                setMontantsLibres({ ...montantsLibres, [p._id]: "" });
                await fetchComplaint();

                const resPaiements = await axios.get(`http://localhost:5000/api/complaints/${id}/paiements`, {
                  headers: { Authorization: `Bearer ${token}` },
                });

                const paiementsAvecStatut = resPaiements.data.map((paiement) => {
                  const totalPaye = paiement.participants?.reduce((sum, part) => sum + (part.montant || 0), 0);
                  const dejaPayeParMoi = paiement.participants?.some((part) => part.user === (user?._id || user?.id));
                  const statut = totalPaye >= paiement.montant ? "payé" : paiement.status || "en attente";
                  return {
                    ...paiement,
                    totalPaye,
                    dejaPayeParMoi,
                    statut,
                  };
                });

                setPaiements(paiementsAvecStatut);
              } catch (err) {
                console.error("❌ Erreur lors du paiement :", err.response?.data || err);
                alert("Paiement échoué : " + (err.response?.data?.error || err.message));
              }
            }}
            style={{
              backgroundColor: "#16a34a",
              color: "white",
              border: "none",
              padding: "0.4rem 0.8rem",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            💳 Payer cette somme
          </button>
        </div>
      )}
    </div>
  );
})

    )}
  </div>
)}

{complaint.statut === "résolue" &&
  complaint.participants
    ?.filter((p) => p.role === "juridique")
    .filter((avocat) => !avocatsDejaNotes.includes(avocat._id))
    .map((avocat) => (
      <div key={avocat._id} style={{ marginBottom: "1.5rem" }}>
        <p><strong>Avocat :</strong> {avocat.prenom || avocat.email}</p>
        <NotationJuridique
          avocatId={avocat._id}
          avocatNom={avocat.prenom || avocat.email}
          plainteId={complaint._id}
          onSubmitSuccess={() => {
            alert("Note envoyée !");
            setAvocatsDejaNotes((prev) => [...prev, avocat._id]);
          }}
        />
      </div>
))}








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

export default PlainteDetail;
