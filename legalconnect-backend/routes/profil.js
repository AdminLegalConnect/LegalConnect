const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

// Route protégée - Profil utilisateur
router.get("/profil", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Voici votre profil sécurisé",
    utilisateur: req.user, // C’est le payload du token
  });
});

module.exports = router;
