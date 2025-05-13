// controllers/avisController.js
const Avis = require('../models/avis');
const User = require('../models/user');

// Créer un nouvel avis
const createAvis = async (req, res) => {
  try {
    const { titre, description, chat, coffreFort, statut } = req.body;

    const avis = new Avis({
      utilisateurId: req.user.id,  // Utilisateur connecté
      titre,
      description,
      chat,  // Messages du chat associés à l'avis
      coffreFort,  // Fichiers associés à l'avis
      statut: statut || "en attente",  // Statut par défaut "en attente"
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

    // Trouver l'avis
    const avis = await Avis.findById(avisId);
    if (!avis) return res.status(404).json({ message: "Avis non trouvé." });

    // Ajouter le message au chat
    avis.chat.push({
      auteurId: req.user.id,  // Utilisateur qui envoie le message
      texte
    });

    await avis.save();

    res.status(200).json({ message: "Message ajouté au chat de l'avis.", avis });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'ajout du message", error: err.message });
  }
};

// Ajouter un fichier au coffre-fort de l'avis
const addCoffreFortFile = async (req, res) => {
  try {
    const { avisId, description } = req.body;

    // Vérifier si un fichier est présent dans la requête
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier téléchargé." });
    }

    // Trouver l'avis en utilisant l'ID
    const avis = await Avis.findById(avisId);
    if (!avis) return res.status(404).json({ message: "Avis non trouvé." });

    // Ajouter le fichier au coffre-fort
    avis.coffreFort.push({
      fichier: req.file.path,  // Enregistrer le chemin du fichier téléchargé
      description
    });

    await avis.save();

    res.status(200).json({ message: "Fichier ajouté au coffre-fort de l'avis.", avis });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'ajout du fichier", error: err.message });
  }
};

// Nouvelle fonction pour récupérer les avis des particuliers
const getAvisForParticulier = async (req, res) => {
  try {
    // Vérifier si l'utilisateur est bien un avocat
    const user = await User.findById(req.user.id);
    if (user.role !== "juridique") {
      return res.status(403).json({ message: "Accès interdit : vous devez être un avocat pour consulter les avis." });
    }

    // Récupérer tous les avis déposés par des particuliers
    const avis = await Avis.find({ utilisateurId: { $ne: req.user.id } });  // Exclure les avis créés par l'avocat
    res.status(200).json({
      message: "Avis des particuliers récupérés avec succès.",
      avis,
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des avis.", error: err.message });
  }
};

module.exports = { createAvis, addChatMessage, addCoffreFortFile, getAvisForParticulier };
