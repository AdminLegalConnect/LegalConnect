const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getProfile,
  updateProfile,
  changePassword,
  ajouterNote,
  ajouterCommentaire
} = require("../controllers/userController");

router.get("/profil", authMiddleware, getProfile);
router.put("/profil", authMiddleware, updateProfile);
router.put("/profil/motdepasse", authMiddleware, changePassword);
router.post("/profil/note", authMiddleware, ajouterNote);
router.post("/profil/commentaire", authMiddleware, ajouterCommentaire);

module.exports = router;
