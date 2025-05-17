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
  uploadProfilePhoto
} = require("../controllers/userController");

router.get("/profil", authMiddleware, getProfile);
router.put("/profil", authMiddleware, updateProfile);
router.put("/profil/motdepasse", authMiddleware, changePassword);
router.post("/profil/note", authMiddleware, ajouterNote);
router.delete("/profil", authMiddleware, deleteAccount);
router.post("/profil/commentaire", authMiddleware, ajouterCommentaire);

// ✅ Route propre pour uploader la photo
router.put("/profil/photo", authMiddleware, upload.single("photo"), uploadProfilePhoto);

module.exports = router;
