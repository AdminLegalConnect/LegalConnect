const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerMiddleware");

const {
  createComplaint,
  getComplaintsForAvocat,
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
  suivrePlainte,
  simulerPaiement,
  getPaiements
} = require("../controllers/complaintController");

// Routes de base pour les plaintes
router.post("/complaints", authMiddleware, createComplaint);
router.get("/complaints", authMiddleware, getComplaintsForAvocat);
router.get("/complaints/:id", authMiddleware, getComplaintById);
router.put("/complaints/:id", authMiddleware, updateComplaint);
router.get("/my-complaints", authMiddleware, getMyComplaints);
router.put("/complaints/:id/visibilite", authMiddleware, updateVisibilite);
router.post("/complaints/:id/inviter", authMiddleware, inviterParticipant);
router.delete("/complaints/:id", authMiddleware, deleteComplaint);
router.get("/public-complaints/:id", getPublicComplaintById);
router.delete("/complaints/:id/participants/:participantId", authMiddleware, retirerParticipant);
router.post("/complaints/:id/suivre", authMiddleware, suivrePlainte);

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

router.delete(
  "/complaints/:complaintId/coffre-fort/:fileId",
  authMiddleware,
  deleteCoffreFortFile
);

// ✅ Routes de gestion des paiements
router.post("/complaints/:id/paiement", authMiddleware, simulerPaiement);
router.get("/complaints/:id/paiements", authMiddleware, getPaiements);

module.exports = router;
