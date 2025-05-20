// ✅ Étape 2 : routes backend - routes/etapeJuridiqueRoutes.js

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const EtapeJuridique = require("../models/etapeJuridique");
const multer = require("../middlewares/multerMiddleware");

// GET - toutes les étapes pour une plainte
router.get("/plainte/:id/etapes", authMiddleware, async (req, res) => {
  try {
    const etapes = await EtapeJuridique.find({ plainteId: req.params.id });
    res.status(200).json({ etapes });
  } catch (err) {
    res.status(500).json({ message: "Erreur", error: err.message });
  }
});

// POST - nouvelle étape
router.post("/plainte/:id/etapes", authMiddleware, multer.single("fichier"), async (req, res) => {
  try {
    const { titre, statut, dateCible, commentaire } = req.body;
    const nouvelle = new EtapeJuridique({
      plainteId: req.params.id,
      titre,
      statut,
      dateCible,
      commentaire,
      fichier: req.file?.path
    });
    await nouvelle.save();
    res.status(201).json({ etape: nouvelle });
  } catch (err) {
    res.status(500).json({ message: "Erreur création", error: err.message });
  }
});

// PUT - mise à jour
router.put("/etapes/:id", authMiddleware, multer.single("fichier"), async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.fichier = req.file.path;
    const etape = await EtapeJuridique.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json({ etape });
  } catch (err) {
    res.status(500).json({ message: "Erreur MAJ", error: err.message });
  }
});

// DELETE - suppression
router.delete("/etapes/:id", authMiddleware, async (req, res) => {
  try {
    await EtapeJuridique.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Étape supprimée" });
  } catch (err) {
    res.status(500).json({ message: "Erreur suppression", error: err.message });
  }
});

module.exports = router;