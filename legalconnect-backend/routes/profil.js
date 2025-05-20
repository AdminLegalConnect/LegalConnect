const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Avis = require("../models/avis"); // ✅ à ajouter

// Route protégée - Profil utilisateur
router.get("/profil", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Voici votre profil sécurisé",
    profil: req.user,
  });
});

// ✅ Nouvelle route : facturation avocat
router.get("/profil/facturation", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "juridique") return res.status(403).json({ message: "Accès interdit" });

    const avis = await Avis.find({ "coffreFort.accessibleApresPaiement": true })
      .populate("utilisateurId", "prenom nom email")
      .lean();

    const resultats = [];
    avis.forEach((a) => {
      a.paiements?.forEach((p) => {
        const fichier = a.coffreFort.find(f => f.fichier === p.fichier);
        if (fichier) {
          resultats.push({
            avisId: a._id,
            titre: a.titre,
            acheteur: a.utilisateurId,
            montantEstime: a.propositions.find(p => p.statut === "acceptée")?.prix || "N/A",
            date: p.date,
            fichier: p.fichier
          });
        }
      });
    });

    res.status(200).json({ paiements: resultats });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

module.exports = router;
