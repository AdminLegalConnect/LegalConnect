import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const FacturationJuridique = () => {
  const [paiements, setPaiements] = useState([]);
  const [filtre, setFiltre] = useState("tous");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/profil/facturation", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPaiements(res.data.paiements || []);
      } catch (err) {
        console.error("Erreur lors du chargement de la facturation", err);
      }
    };
    fetchData();
  }, []);

  const paiementsFiltres = paiements.filter((p) => {
    if (!p.source) return false;
    if (filtre === "tous") return true;
    return p.source === filtre;
  });

  const paiementsGroupes = paiementsFiltres.reduce((acc, p) => {
    const key = p.titre || "Autre";
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  const genererPDF = (titre, paiementsAssocies) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Cabinet LegalConnect", 14, 20);
    doc.setFontSize(12);
    doc.text(`Facture : ${titre}`, 14, 30);
    doc.text(`Date : ${new Date().toLocaleDateString("fr-FR")}`, 14, 37);

    autoTable(doc, {
      startY: 45,
      head: [["Acheteur", "Type", "Montant (€)", "Date", "Statut"]],
      body: paiementsAssocies.map((p) => [
        `${p.acheteur?.prenom || ""} ${p.acheteur?.nom || ""} (${p.acheteur?.email || "?"})`,
        p.source === "avis" ? "Avis" : "Plainte",
        p.montantEstime,
        new Date(p.date).toLocaleDateString("fr-FR"),
        p.statut === "payé" ? "Payé" : "En attente",
      ]),
    });

    const totalHT = paiementsAssocies.reduce((sum, p) => sum + Number(p.montantEstime || 0), 0);
    const tva = (totalHT * 0.2).toFixed(2);
    const totalTTC = (totalHT + parseFloat(tva)).toFixed(2);

    doc.text(`Total HT : ${totalHT.toFixed(2)} €`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`TVA (20%) : ${tva} €`, 14, doc.lastAutoTable.finalY + 17);
    doc.text(`Total TTC : ${totalTTC} €`, 14, doc.lastAutoTable.finalY + 24);

    doc.save(`Facture_${titre.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 1000, margin: "auto" }}>
      <h2 style={{ marginBottom: "1rem", color: "#1e3a8a" }}>
        💼 Historique de vos paiements reçus
      </h2>

      <div style={{ marginBottom: "1.5rem" }}>
        <label><strong>Filtrer par type :</strong> </label>{" "}
        <select value={filtre} onChange={(e) => setFiltre(e.target.value)} style={{ padding: "0.5rem" }}>
          <option value="tous">Tous</option>
          <option value="avis">Avis</option>
          <option value="plainte">Plainte</option>
        </select>
      </div>

      {Object.keys(paiementsGroupes).length === 0 ? (
        <p>Aucun paiement trouvé pour ce filtre.</p>
      ) : (
        Object.entries(paiementsGroupes).map(([titre, paiementsAssocies], i) => (
          <div key={i} style={{ marginBottom: "2rem", background: "#f8fafc", padding: "1rem", borderRadius: "8px", borderLeft: "5px solid #0f766e" }}>
            <h3 style={{ color: "#0f172a" }}>📌 {titre}</h3>

            {paiementsAssocies.map((p, j) => (
              <div key={j} style={{
                background: "#f1f5f9",
                marginTop: "1rem",
                padding: "1rem",
                borderRadius: "6px",
                borderLeft: `4px solid ${p.source === "avis" ? "#3b82f6" : "#10b981"}`
              }}>
                <p><strong>🔖 Type :</strong> {p.source === "avis" ? "Avis juridique" : "Plainte"}</p>
                <p><strong>Acheteur :</strong> {p.acheteur?.prenom || ""} {p.acheteur?.nom || ""} ({p.acheteur?.email || "inconnu"})</p>
                <p><strong>Date :</strong> {new Date(p.date).toLocaleString("fr-FR")}</p>
                <p><strong>Montant :</strong> {p.montantEstime} €</p>
                <p><strong>Statut :</strong> {p.statut === "payé" ? "✅ Payé" : "❌ En attente"}</p>
                {p.partage && <p><strong>💡 Paiement partagé</strong></p>}
                {p.fichier && (
                  <p>
                    <strong>Fichier :</strong>{" "}
                    <a href={`http://localhost:5000/${p.fichier}`} target="_blank" rel="noreferrer">
                      Télécharger 📄
                    </a>
                  </p>
                )}
              </div>
            ))}

            {filtre !== "avis" && (
              <div style={{ marginTop: "1rem", textAlign: "right" }}>
                <button
                  onClick={() => genererPDF(titre, paiementsAssocies)}
                  style={{
                    backgroundColor: "#1d4ed8",
                    color: "#fff",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                >
                  🧾 Générer la facture globale
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default FacturationJuridique;
