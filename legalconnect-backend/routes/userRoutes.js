const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerMiddleware");

const {
  getProfile,
  updateProfile,
  changePassword,
  ajouterNote,
  deleteAccount,
  ajouterCommentaire,
  rechercherJuridiques,
  uploadProfilePhoto,
  getMessages,
  getAllUsers,
  envoyerMessage
} = require("../controllers/userController");

router.get("/profil", authMiddleware, getProfile);
router.put("/profil", authMiddleware, updateProfile);
router.put("/profil/motdepasse", authMiddleware, changePassword);
router.post("/profil/note", authMiddleware, ajouterNote);
router.delete("/profil", authMiddleware, deleteAccount);
router.post("/profil/commentaire", authMiddleware, ajouterCommentaire);
router.get("/juridiques/recherche", authMiddleware, rechercherJuridiques);
router.put("/profil/photo", authMiddleware, upload.single("photo"), uploadProfilePhoto);
router.get("/users/all", authMiddleware, getAllUsers);



// ✅ Messagerie
router.get("/messagerie", authMiddleware, getMessages);
router.post("/messagerie/envoyer", authMiddleware, upload.single("fichier"), envoyerMessage);

module.exports = router;