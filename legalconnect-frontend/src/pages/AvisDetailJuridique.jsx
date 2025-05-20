// pages/AvisDetailJuridique.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "../services/AuthContext";

const AvisDetailJuridique = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const currentUserId = user?.id || user?._id || (typeof user === "string" ? user : null);
  console.log("🔍 currentUserId:", currentUserId);
  const [avis, setAvis] = useState(null);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [newFile, setNewFile] = useState(null);
  const [fileDescription, setFileDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchAvis = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/avis/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvis(res.data.avis);
      console.log("Avis rechargé :", res.data.avis);
      setStatus(res.data.avis.statut);
    } catch (err) {
      console.error(err);
      setError("Erreur de chargement de l'avis.");
    }
  };

  useEffect(() => {
    fetchAvis();
  }, [id]);

  useEffect(() => {
  // Rechargement automatique si une proposition devient "acceptée"
  const hasAccepted = avis?.propositions?.some(p => {
    const idA =
  typeof p.avocatId === "object"
    ? p.avocatId._id || p.avocatId.id
    : p.avocatId;

    const idB = currentUserId;
    return idA?.toString() === idB?.toString() && p.statut === "acceptée";
  });
  if (hasAccepted) {
    fetchAvis(); // 👈 recharge proprement la version peuplée à jour
  }
}, [avis?.propositions]);


  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/avis/${id}/chat`, {
        texte: message,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("");
      fetchAvis();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'envoi du message.");
    }
  };

  const handleStatusChange = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/avis/${id}`, {
        statut: status,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Statut mis à jour !");
      fetchAvis();
    } catch (err) {
      console.error(err);
      setError("Impossible de changer le statut.");
    }
  };

  const handleUploadFile = async () => {
    if (!newFile) return;
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
          "Content-Type": "multipart/form-data"
        },
      });

      setSuccess("Fichier ajouté avec succès !");
      setNewFile(null);
      setFileDescription("");
      fetchAvis();
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'ajout du fichier");
    } finally {
      setUploading(false);
    }
  };

  if (!avis) return <p style={{ padding: "2rem" }}>Chargement...</p>;

const formStyle = { display: "block", marginBottom: "1rem", width: "100%", padding: "0.5rem" };

const avocatDejaPropose = avis?.propositions?.some(p => {
  const idA =
  typeof p.avocatId === "object"
    ? p.avocatId._id || p.avocatId.id
    : p.avocatId;

  const idB = currentUserId;
  return idA?.toString() === idB?.toString();
});



const handleEvaluationSubmit = async (e) => {
  e.preventDefault();
  const form = e.target;
  const contenu = `
🧾 Évaluation juridique officielle

📝 Avis : ${form.avis.value}
📅 Délai estimé : ${form.delai.value}
💰 Prix approximatif : ${form.prix.value} €
✅ Points forts : ${form.forts.value}
⚠️ Points faibles : ${form.faibles.value}
📊 Pourcentage de réussite : ${form.pourcentage.value} %
📂 Éléments nécessaires : ${form.preuves.value}
`;

  const blob = new Blob([contenu], { type: "text/plain" });
  const file = new File([blob], `rapport-juridique-${avis._id}.txt`, { type: "text/plain" });

  const formData = new FormData();
  formData.append("fichier", file);
  formData.append("avisId", avis._id);
  formData.append("description", "Rapport juridique rédigé par l'avocat");

  try {
    const token = localStorage.getItem("token");
    await axios.post("http://localhost:5000/api/avis/coffre-fort", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });

    setSuccess("Rapport généré et ajouté au coffre-fort !");
    form.reset();
    fetchAvis();
  } catch (err) {
    console.error(err);
    setError("Erreur lors de l’ajout du rapport");
  }
};

console.log("AVOCAT ID :", currentUserId);
console.log("PROPOSITIONS :", avis.propositions);


  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: "2rem" }}>
      <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem", color: "#1d4ed8" }}>
        Avis : {avis.titre}
      </h2>

      <p><strong>Description :</strong> {avis.description}</p>
      <p>
        <strong>Déposé par :</strong> {avis.utilisateurId?.prenom} {avis.utilisateurId?.nom} ({avis.utilisateurId?.email})
      </p>
      <p><strong>Date :</strong> {new Date(avis.dateDepot).toLocaleDateString()}</p>

      <hr style={{ margin: "1.5rem 0" }} />

      <div>
        <h3>Changer le statut</h3>
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: "0.5rem", marginRight: "1rem" }}>
          <option value="en attente">En attente</option>
          <option value="en cours">En cours</option>
          <option value="résolu">Résolu</option>
        </select>
        <button onClick={handleStatusChange} style={{ padding: "0.5rem 1rem", backgroundColor: "#2563EB", color: "white", border: "none", borderRadius: "6px" }}>
          Mettre à jour
        </button>
      </div>
      {/* Historique des statuts */}
      {avis.historiqueStatut && avis.historiqueStatut.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Historique des statuts</h3>
          <div style={{
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "1rem",
            backgroundColor: "#f9fafb",
          }}>
            <ul style={{ listStyle: "disc", paddingLeft: "1.5rem" }}>
              {avis.historiqueStatut.map((entry, index) => (
                <li key={index} style={{ marginBottom: "0.5rem" }}>
                  {new Date(entry.date).toLocaleString("fr-FR")} – <strong>{entry.statut}</strong> par {entry.modifiéPar?.prenom} {entry.modifiéPar?.nom} ({entry.modifiéPar?.email})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

{avis.participants?.includes(currentUserId) ? (
  <p style={{ marginTop: "1rem", color: "green", fontWeight: "bold" }}>
    ✅ Vous suivez déjà cet avis.
  </p>
) : (
  <button
  onClick={async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`http://localhost:5000/api/avis/${avis._id}/suivre`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedParticipants = res.data.avis.participants;

      setAvis((prev) => ({
      ...prev,
      participants: updatedParticipants
    }));
      setSuccess(res.data.message);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Erreur lors du changement de suivi.");
      setSuccess("");
    }
  }}
  style={{
    marginTop: "1rem",
    padding: "0.5rem 1rem",
    backgroundColor: avis.participants?.includes(currentUserId) ? "#ef4444" : "#1e40af",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }}
>
  {avis.participants?.includes(currentUserId) ? "🚫 Ne plus suivre cet avis" : "🔔 Suivre cet avis"}
</button>

)}

{/* Proposition d’évaluation */}
<div style={{ marginTop: "2rem" }}>
  <h3>Proposer une évaluation</h3>

  {/* Logique intelligente selon le statut */}
  {(() => {
    const maProposition = avis.propositions?.find(p => {
      const idA =
  typeof p.avocatId === "object"
    ? p.avocatId._id || p.avocatId.id
    : p.avocatId;

      return idA?.toString() === currentUserId?.toString();
    });

    console.log("Proposition trouvée :", maProposition);
    const statut = maProposition?.statut;

    if (!maProposition) {
      // Aucun envoi → on affiche le formulaire
      return (
        <form onSubmit={async (e) => {
          e.preventDefault();
          try {
            const token = localStorage.getItem("token");
            await axios.post(`http://localhost:5000/api/avis/${avis._id}/propositions`, {
              prix: parseFloat(e.target.prix.value),
              message: e.target.message.value
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess("Proposition envoyée avec succès !");
            setError("");
            fetchAvis();
          } catch (err) {
            console.error(err);
            setError("Erreur lors de l'envoi de la proposition.");
          }
        }}>
          <div style={{ marginBottom: "1rem" }}>
            <label>Prix proposé (€) :</label><br />
            <input name="prix" type="number" step="0.01" required style={{ width: "100%", padding: "0.5rem" }} />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Message à l'attention du particulier :</label><br />
            <textarea name="message" rows={4} required style={{ width: "100%", padding: "0.5rem" }} />
          </div>
          <button type="submit" style={{ backgroundColor: "#2563EB", color: "white", border: "none", padding: "0.6rem 1.2rem", borderRadius: "8px" }}>
            Soumettre la proposition
          </button>
        </form>
      );
    }

    if (statut === "en attente") {
      return <p style={{ color: "gray" }}>Vous avez déjà proposé une évaluation. En attente de réponse du particulier.</p>;
    }

    if (statut === "refusée") {
      return <p style={{ color: "red" }}>Votre proposition a été refusée.</p>;
    }

    if (statut === "acceptée") {
      return (
        <div style={{ marginTop: "2rem" }}>
          <h3>📝 Rédiger l’évaluation juridique officielle</h3>
          <form onSubmit={handleEvaluationSubmit}>
            <label>Avis de l’avocat :</label>
            <textarea name="avis" required rows={4} style={formStyle} />

            <label>Délai estimé :</label>
            <input type="text" name="delai" required style={formStyle} />

            <label>Prix approximatif :</label>
            <input type="number" name="prix" required style={formStyle} />

            <label>Points forts :</label>
            <textarea name="forts" required rows={3} style={formStyle} />

            <label>Points faibles :</label>
            <textarea name="faibles" required rows={3} style={formStyle} />

            <label>Pourcentage de réussite estimé :</label>
            <input type="number" name="pourcentage" min={0} max={100} required style={formStyle} />

            <label>Éléments ou preuves nécessaires :</label>
            <textarea name="preuves" rows={3} style={formStyle} />

            <button type="submit" style={{ ...formStyle, backgroundColor: "#2563eb", color: "white", cursor: "pointer" }}>
              Générer le rapport et l’ajouter au coffre-fort
            </button>
          </form>
        </div>
      );
    }

    return null;
  })()}
</div>






      {/* Coffre-fort : pièces jointes */}
      {avis.coffreFort && avis.coffreFort.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Pièces jointes du coffre-fort</h3>
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {avis.coffreFort.map((file, index) => (
              <li key={index} style={{ marginBottom: "0.5rem" }}>
                <a
                  href={`http://localhost:5000/${file.fichier}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#1d4ed8", textDecoration: "underline" }}
                >
                  {file.description || `Fichier ${index + 1}`}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Formulaire d'ajout */}
      <div style={{ marginTop: "1.5rem" }}>
        <h4>Ajouter un fichier</h4>
        <input type="file" onChange={(e) => setNewFile(e.target.files[0])} />
        <input
          type="text"
          placeholder="Description"
          value={fileDescription}
          onChange={(e) => setFileDescription(e.target.value)}
          style={{ marginLeft: "0.5rem" }}
        />
        <button
          onClick={handleUploadFile}
          disabled={uploading}
          style={{ marginLeft: "0.5rem", padding: "0.4rem 1rem", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "6px" }}
        >
          {uploading ? "Envoi..." : "Ajouter"}
        </button>
      </div>

      <hr style={{ margin: "2rem 0" }} />

      <h3>Réponse / messages</h3>
      <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #eee", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
        {avis.chat.map((msg) => (
          <div key={msg._id} style={{ marginBottom: "1rem", backgroundColor: "#f3f4f6", padding: "0.5rem", borderRadius: "8px" }}>
            <strong>{msg.auteurId?.prenom || msg.auteurId?.email}</strong> ({new Date(msg.date).toLocaleString()}):
            <p>{msg.texte}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <textarea
        rows={4}
        placeholder="Votre réponse..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", marginBottom: "1rem" }}
      />
      <button onClick={handleSendMessage} style={{ padding: "0.8rem 1.2rem", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "8px" }}>
        Envoyer
      </button>

      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AvisDetailJuridique;
