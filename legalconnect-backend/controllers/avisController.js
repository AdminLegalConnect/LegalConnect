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
    const avisId = req.params.id;
    const { texte } = req.body;

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

// Récupérer un avis par ID
const getAvisById = async (req, res) => {
  try {
    const avis = await Avis.findById(req.params.id).populate('chat.auteurId', 'prenom email role');    if (!avis) {
      return res.status(404).json({ message: "Avis non trouvé" });
    }
    res.status(200).json({ avis });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération de l'avis", error: err.message });
  }
};

const deleteAvis = async (req, res) => {
  try {
    const avis = await Avis.findById(req.params.id);
    if (!avis) return res.status(404).json({ message: "Avis non trouvé" });

    if (avis.utilisateurId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Non autorisé à supprimer cet avis" });
    }

    await Avis.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Avis supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

const updateAvis = async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, description } = req.body;

    const avis = await Avis.findById(id);
    if (!avis) return res.status(404).json({ message: "Avis non trouvé" });

    // Vérifie que l'utilisateur est bien le créateur
    if (avis.utilisateurId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Non autorisé à modifier cet avis" });
    }

    avis.titre = titre || avis.titre;
    avis.description = description || avis.description;

    await avis.save();

    res.status(200).json({ message: "Avis mis à jour", avis });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la mise à jour", error: err.message });
  }
};





module.exports = {
  createAvis,
  addChatMessage,
  addCoffreFortFile,
  getAvisByUser,
  getAvisById,
  deleteAvis,
  updateAvis,          
  getAvisForParticulier
};
