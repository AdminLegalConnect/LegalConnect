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

    await avis.populate('chat.auteurId', 'prenom email role');
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
    const avis = await Avis.find({
  $or: [
    { utilisateurId: req.user.id },
    { participants: req.user.id }
  ]
});

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
      return res.status(403).json({ message: "Accès interdit : vous devez être un avocat." });
    }

    // On récupère tous les avis non résolus avec leur auteur
    const allAvis = await Avis.find({ statut: { $ne: "résolu" } })
      .populate("utilisateurId", "prenom email role");

    // On filtre les avis dont l’auteur est bien un particulier
    const avisFiltrés = allAvis.filter(a => a.utilisateurId && a.utilisateurId.role === "particulier");

    res.status(200).json({ message: "Avis récupérés", avis: avisFiltrés });
  } catch (err) {
    console.error("Erreur dans getAvisForParticulier:", err.message);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};


// Récupérer un avis par ID
const getAvisById = async (req, res) => {
  try {
    const avis = await Avis.findById(req.params.id)
      .populate('chat.auteurId', 'prenom email role')
      .populate('participants', 'prenom email') // 👈 ajoute cette ligne
      .populate('utilisateurId', 'prenom nom email')
      .populate("historiqueStatut.modifiéPar", "prenom nom email")


    if (!avis) {
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
    const { titre, description, statut } = req.body;

    const avis = await Avis.findById(id);
    if (!avis) return res.status(404).json({ message: "Avis non trouvé" });

    // Si l'utilisateur est le créateur (particulier)
    if (avis.utilisateurId.toString() === req.user.id) {
      if (titre) avis.titre = titre;
      if (description) avis.description = description;
    }

    // Si l'utilisateur est un juridique : autoriser la modification du statut
    if (req.user.role === "juridique") {
      if (statut && statut !== avis.statut) {
        avis.historiqueStatut = avis.historiqueStatut || [];
        avis.historiqueStatut.push({
          statut: statut,
          modifiéPar: req.user.id,
        });
        avis.statut = statut;
      }
    }

    await avis.save();
    res.status(200).json({ message: "Avis mis à jour", avis });

  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la mise à jour", error: err.message });
  }
};


const inviterParticipant = async (req, res) => {
  try {
    const { email } = req.body;
    const avisId = req.params.id;

    const userToInvite = await User.findOne({ email });
    if (!userToInvite) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const avis = await Avis.findById(avisId);
    if (!avis) {
      return res.status(404).json({ message: "Avis non trouvé" });
    }

    // Empêche d'inviter deux fois
    if (avis.participants?.includes(userToInvite._id)) {
      return res.status(400).json({ message: "Utilisateur déjà invité" });
    }

    // Initialise si vide
    if (!avis.participants) avis.participants = [];

    avis.participants.push(userToInvite._id);
    await avis.save();

    res.status(200).json({ message: "Participant invité avec succès", avis });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de l'invitation", error: err.message });
  }
};

const getAvisSuivisParAvocat = async (req, res) => {
  try {
    const avis = await Avis.find({ participants: req.user.id })
      .populate("utilisateurId", "prenom nom email")
      .sort({ dateDepot: -1 });

    res.status(200).json({ avis });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

const suivreAvis = async (req, res) => {
  try {
    const avis = await Avis.findById(req.params.id);
    if (!avis) return res.status(404).json({ message: "Avis introuvable" });

    const index = avis.participants.indexOf(req.user.id);

    if (index === -1) {
      avis.participants.push(req.user.id);
      await avis.save();
      return res.status(200).json({ message: "Avis suivi avec succès", avis, suivi: true });
    } else {
      avis.participants.splice(index, 1);
      await avis.save();
      return res.status(200).json({ message: "Vous ne suivez plus cet avis", avis, suivi: false });
    }
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
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
  inviterParticipant,
  getAvisSuivisParAvocat, 
  suivreAvis,         
  getAvisForParticulier
};
