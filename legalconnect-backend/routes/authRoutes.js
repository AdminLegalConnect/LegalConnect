const express = require("express");
const router = express.Router();
const { signupUser, loginUser } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware"); // Importer le middleware

// Route d'inscription (publique)
router.post("/signup", signupUser);

// Route de connexion (publique)
router.post("/login", loginUser);

// Exemple de route protégée par l'authentification
router.get("/profile", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Accès à votre profil",
    utilisateur: req.user, // Afficher les données de l'utilisateur (décodées depuis le token)
  });
});

module.exports = router;
