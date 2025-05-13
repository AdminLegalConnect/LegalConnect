// routes/homeRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

// Route pour afficher les options de l'accueil pour un particulier
router.get("/accueil", authMiddleware, (req, res) => {
  // Vérifier le rôle de l'utilisateur connecté
  if (req.user.role === "particulier") {
    // Options pour un utilisateur particulier
    const homeOptions = {
      deposerUnDossier: "Déposer un dossier pour avis",
      deposerUnePlainte: "Déposer une plainte",
      explorerLesThematiques: "Explorer les thématiques",
    };

    return res.status(200).json({
      message: "Options de l'accueil récupérées avec succès.",
      options: homeOptions,
    });
  }

  // Options pour un utilisateur avocat ("juridique")
  if (req.user.role === "juridique") {
    const homeOptions = {
      chercherUnDossier: "Chercher un avis dans les avis déposés par des particuliers",
      chercherUnePlainte: "Chercher une plainte dans les plaintes déposées par des particuliers",
      explorerLesThematiques: "Explorer les thématiques",
    };

    return res.status(200).json({
      message: "Options de l'accueil avocat récupérées avec succès.",
      options: homeOptions,
    });
  }

  // Si le rôle n'est ni 'particulier' ni 'juridique', on retourne une erreur
  res.status(403).json({
    message: "Accès interdit : rôle utilisateur non reconnu.",
  });
});

module.exports = router;
