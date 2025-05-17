const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerMiddleware");

const {
  createComplaint,
  getComplaintsForAvocat,  // Route pour récupérer toutes les plaintes pour avocat
  getComplaintById,
  updateComplaint,
  updateComplaintStatus,
  addChatMessage,
  addCoffreFortFile,
  deleteCoffreFortFile,
  getMyComplaints,
  updateVisibilite,
  inviterParticipant,
  deleteComplaint,
  getPublicComplaintById,
  retirerParticipant,
} = require("../controllers/complaintController");

// Routes de base pour les plaintes
router.post("/complaints", authMiddleware, createComplaint);
router.get("/complaints", authMiddleware, getComplaintsForAvocat);  // Changement ici
router.get("/complaints/:id", authMiddleware, getComplaintById);
router.put("/complaints/:id", authMiddleware, updateComplaint);
router.get("/my-complaints", authMiddleware, getMyComplaints);
router.put("/complaints/:id/visibilite", authMiddleware, updateVisibilite);
router.post("/complaints/:id/inviter", authMiddleware, inviterParticipant);
router.delete("/complaints/:id", authMiddleware, deleteComplaint);
router.get("/public-complaints/:id", getPublicComplaintById);
router.delete(
  "/complaints/:id/participants/:participantId",
  authMiddleware,
  retirerParticipant
);


// Routes pour les fonctionnalités spécifiques
router.put("/complaints/:id/status", authMiddleware, updateComplaintStatus);
router.post("/complaints/:id/chat", authMiddleware, addChatMessage);

// Routes pour le coffre-fort
router.post(
  "/complaints/:id/coffre-fort",
  authMiddleware,
  upload.single("file"),
  addCoffreFortFile
);

// ✅ Route pour supprimer un fichier du coffre-fort
router.delete(
  "/complaints/:complaintId/coffre-fort/:fileId",
  authMiddleware,
  deleteCoffreFortFile
);

module.exports = router;
