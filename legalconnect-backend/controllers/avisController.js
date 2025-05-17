// controllers/avisController.js
const Avis = require('../models/avis');
const User = require('../models/user');

// Créer un nouvel avis
const createAvis = async (req, res) => {
  try {
    const { titre, description, chat, coffreFort, statut } = req.body;

    const avis = new Avis({
      utilisateurId: req.user.id,
      titre,
      description,
      chat,
      coffreFort,
      statut: statut || "en attente",
    });

    await avis.save();

    const user = await User.findById(req.user.id);
    user.avis.push(avis._id);
    await user.save();

    res.status(201).json({ message: "Avis pour dossier déposé avec succès", avis });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors du dépôt de l'avis", details: err.message });
  }
};

// Ajouter un message au chat de l'avis
const addChatMessage = async (req, res) => {
  try {
    const { avisId, texte } = req.body;

    const avis = await Avis.findById(avisId);
    if (!avis) return res.status(404).json({ message: "Avis non trouvé." });

    avis.chat.push({
      auteurId: req.user.id,
      texte
    });

    await avis.save();

    res.status(200).json({ message: "Message ajouté au chat de l'avis.", avis });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'ajout du message", error: err.message });
  }
};

// Ajouter un fichier au coffre-fort
const addCoffreFortFile = async (req, res) => {
  try {
    const { avisId, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier téléchargé." });
    }

    const avis = await Avis.findById(avisId);
    if (!avis) return res.status(404).json({ message: "Avis non trouvé." });

    avis.coffreFort.push({
      fichier: req.file.path,
      description
    });

    await avis.save();

    res.status(200).json({ message: "Fichier ajouté au coffre-fort de l'avis.", avis });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'ajout du fichier", error: err.message });
  }
};

// Récupérer les avis de l'utilisateur connecté
const getAvisByUser = async (req, res) => {
  try {
    const avis = await Avis.find({ utilisateurId: req.user.id });
    res.status(200).json({ avis });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer les avis pour un avocat
const getAvisForParticulier = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== "juridique") {
      return res.status(403).json({ message: "Accès interdit : vous devez être un avocat pour consulter les avis." });
    }

    const avis = await Avis.find({ utilisateurId: { $ne: req.user.id } });
    res.status(200).json({ message: "Avis des particuliers récupérés avec succès.", avis });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des avis.", error: err.message });
  }
};

module.exports = {
  createAvis,
  addChatMessage,
  addCoffreFortFile,
  getAvisByUser,             // ✅ bien exportée
  getAvisForParticulier
};
