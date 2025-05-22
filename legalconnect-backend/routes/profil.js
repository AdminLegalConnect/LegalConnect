const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Avis = require("../models/avis");
const Complaint = require("../models/complaint");
const User = require("../models/user");

// Route protégée - Profil utilisateur
router.get("/profil", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Voici votre profil sécurisé",
    profil: req.user,
  });
});

// ✅ Nouvelle route : facturation avocat (avis + plaintes)
router.get("/profil/facturation", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "juridique") {
      return res.status(403).json({ message: "Accès interdit" });
    }

    const resultats = [];

    // ▶️ Paiements liés aux AVIS
    const avis = await Avis.find({ "coffreFort.accessibleApresPaiement": true })
      .populate("utilisateurId", "prenom nom email")
      .lean();

    avis.forEach((a) => {
      a.paiements?.forEach((p) => {
        const fichier = a.coffreFort.find(f => f.fichier === p.fichier);
        if (fichier) {
          resultats.push({
            source: "avis",
            titre: a.titre,
            acheteur: a.utilisateurId,
            montantEstime: a.propositions?.find(pr => pr.statut === "acceptée")?.prix || "N/A",
            date: p.date,
            fichier: p.fichier,
            statut: "payé",
            partage: false,
          });
        }
      });
    });

const plaintes = await Complaint.find({ "paiements.destinataire": req.user._id })
  .populate("participants", "prenom nom email")
  .populate("utilisateur", "prenom nom email")
  .lean();


    plaintes.forEach((pl) => {
  pl.paiements?.forEach((p) => {
    const totalPaye = p.participants?.reduce((sum, part) => sum + (part.montant || 0), 0);
    const statut = totalPaye >= p.montant ? "payé" : "en attente";

    p.participants?.forEach((part) => {
      // 1. Sécurité : part.user peut être null ou undefined
      let acheteur = { email: "Utilisateur inconnu" };

      // 2. Si l'ID est présent on tente de le retrouver
      if (part.user) {
        const match = pl.participants.find(u => String(u._id) === String(part.user));
        if (match) acheteur = match;
      }

      // 3. Si c'est encore inconnu et que la plainte a un utilisateur (créateur)
      if (acheteur.email === "Utilisateur inconnu" && pl.utilisateur) {
        acheteur = pl.utilisateur;
      }

      resultats.push({
        source: "plainte",
        titre: pl.titre,
        acheteur,
        montantEstime: part.montant,
        date: part.date || p.date,
        fichier: null,
        statut,
        partage: p.typePaiement === "partagé"
      });
    });
  });
});



    res.status(200).json({ paiements: resultats });

  } catch (err) {
    console.error("❌ Erreur facturation :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

module.exports = router;
