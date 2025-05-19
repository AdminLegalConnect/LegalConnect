// routes/avisRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multerMiddleware');

const {
  createAvis,
  addChatMessage,
  addCoffreFortFile,
  getAvisByUser,
  getAvisById,
  deleteAvis,
  getAvisForParticulier,
  inviterParticipant,
  getAvisSuivisParAvocat,
  suivreAvis,
  updateAvis
} = require('../controllers/avisController');

// Route pour déposer un avis
router.post('/avis', authMiddleware, createAvis);

// Route pour ajouter un message au chat de l'avis
router.post('/avis/:id/chat', authMiddleware, addChatMessage);

// Route pour ajouter un fichier au coffre-fort de l'avis
router.post('/avis/coffre-fort', authMiddleware, upload.single('fichier'), addCoffreFortFile);

// Route pour récupérer les avis du particulier connecté
router.get('/avis/mes', authMiddleware, getAvisByUser);

// Route pour l'avocat : voir les avis déposés par d'autres
router.get('/avis/particuliers', authMiddleware, getAvisForParticulier);

router.get('/avis/:id', authMiddleware, getAvisById);

router.delete('/avis/:id', authMiddleware, deleteAvis);

router.put('/avis/:id', authMiddleware, updateAvis);

router.get("/mes-avis", authMiddleware, getAvisSuivisParAvocat);

router.post('/avis/:id/inviter', authMiddleware, inviterParticipant);

router.post("/avis/:id/suivre", authMiddleware, suivreAvis);

router.post("/avis/:id/suivre", authMiddleware, async (req, res) => {
  try {
    const avis = await Avis.findById(req.params.id);
    if (!avis) return res.status(404).json({ message: "Avis introuvable" });

    if (!avis.participants.includes(req.user.id)) {
      avis.participants.push(req.user.id);
      await avis.save();
    }

    res.status(200).json({ message: "Avis suivi avec succès", avis });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});



module.exports = router;
