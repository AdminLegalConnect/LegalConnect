const Complaint = require("../models/complaint");
const fs = require("fs");
const path = require("path");
const User = require("../models/user");

// ✅ Créer une plainte
const createComplaint = async (req, res) => {
  try {
    const { titre, description, pieces_jointes } = req.body;

    const newComplaint = new Complaint({
      titre,
      description,
      utilisateur: req.user.id,
      pieces_jointes: pieces_jointes || [],
    });

    await newComplaint.save();

    res.status(201).json({
      message: "Plainte créée avec succès",
      complaint: newComplaint,
    });
  } catch (err) {
    res.status(500).json({
      error: "Erreur serveur",
      details: err.message,
    });
  }
};

// ✅ Récupérer toutes les plaintes (pour les avocats)
const getComplaintsForAvocat = async (req, res) => {
  try {
    // Vérifier que l'utilisateur est bien un avocat (juridique)
    const user = req.user;
    console.log("Utilisateur connecté:", user); // Log pour vérifier l'utilisateur

    // Vérification du rôle de l'utilisateur
    if (user.role !== "juridique") {
      return res.status(403).json({
        message: "Accès interdit : vous devez être un avocat pour consulter les plaintes.",
      });
    }

    // Récupérer toutes les plaintes (pas de filtre selon l'utilisateur)
    const complaints = await Complaint.find();

    if (complaints.length === 0) {
      return res.status(404).json({ message: "Aucune plainte trouvée." });
    }

    res.status(200).json({
      message: "Plaintes récupérées avec succès.",
      complaints,
    });
  } catch (err) {
    console.error("Erreur lors de la récupération des plaintes:", err);
    res.status(500).json({
      message: "Erreur lors de la récupération des plaintes.",
      error: err.message,
    });
  }
};

// ✅ Récupérer une plainte par ID
const getComplaintById = async (req, res) => {
  try {
   const complaint = await Complaint.findById(req.params.id)
  .populate("utilisateur")
  .populate("chat.expediteur")
  .populate("participants"); // ← Ajout ici


    if (!complaint) {
      return res.status(404).json({ error: "Plainte non trouvée" });
    }

    res.status(200).json({
      message: "Plainte récupérée avec succès",
      complaint,
    });
  } catch (err) {
    res.status(500).json({
      error: "Erreur serveur",
      details: err.message,
    });
  }
};

// ✅ Mettre à jour une plainte
const updateComplaint = async (req, res) => {
  try {
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ error: "Plainte non trouvée" });
    }

    res.status(200).json({
      message: "Plainte mise à jour avec succès",
      complaint: updatedComplaint,
    });
  } catch (err) {
    res.status(500).json({
      error: "Erreur serveur",
      details: err.message,
    });
  }
};

// ✅ Mettre à jour uniquement le statut
const updateComplaintStatus = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate("utilisateur", "prenom nom email");

    if (!complaint) {
      return res.status(404).json({ error: "Plainte non trouvée" });
    }

    complaint.statut = req.body.statut;
    complaint.date_maj = new Date();
    await complaint.save();

    res.status(200).json({
      message: "Statut mis à jour avec succès",
      complaint,
    });
  } catch (err) {
    res.status(500).json({
      error: "Erreur serveur",
      details: err.message,
    });
  }
};

// ✅ Ajouter un message dans le chat d'une plainte
const addChatMessage = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate("utilisateur", "prenom nom email");


    if (!complaint) {
      return res.status(404).json({ error: "Plainte non trouvée" });
    }

    complaint.chat.push({
      expediteur: req.user.id,
      message: req.body.message,
    });

    await complaint.save();

    res.status(200).json({
      message: "Message ajouté avec succès",
      chat: complaint.chat,
    });
  } catch (err) {
    res.status(500).json({
      error: "Erreur serveur",
      details: err.message,
    });
  }
};

// ✅ Ajouter un fichier au coffre-fort
const addCoffreFortFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier fourni" });
    }

    const fileData = {
      nom_fichier: req.file.originalname,
      type: req.file.mimetype,
      url: `/uploads/${req.file.filename}`,
      auteur: req.user.id,
    };

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { $push: { coffre_fort: fileData } },
      { new: true, runValidators: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ error: "Plainte non trouvée" });
    }

    res.status(201).json({
      message: "Fichier ajouté avec succès",
      file: fileData,
      complaint: updatedComplaint,
    });
  } catch (error) {
    console.error("Erreur critique:", error);
    res.status(500).json({
      error: "Erreur serveur",
      details: error.message,
    });
  }
};

// ✅ Supprimer un fichier du coffre-fort ET du dossier uploads
const deleteCoffreFortFile = async (req, res) => {
  try {
    const { complaintId, fileId } = req.params;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ error: "Plainte non trouvée" });
    }

    const file = complaint.coffre_fort.id(fileId);
    if (!file) {
      return res.status(404).json({ error: "Fichier non trouvé dans le coffre-fort" });
    }

    // Supprimer physiquement le fichier
    const filePath = path.join(__dirname, "../uploads", path.basename(file.url));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Supprimer l'entrée dans MongoDB
    complaint.coffre_fort = complaint.coffre_fort.filter(f => f._id.toString() !== fileId);

    complaint.date_maj = new Date();
    await complaint.save();

    res.status(200).json({ message: "Fichier supprimé du coffre-fort et du serveur avec succès" });
  } catch (error) {
    console.error("Erreur suppression fichier :", error);
    res.status(500).json({
      error: "Erreur serveur",
      details: error.message,
    });
  }
};

// ✅ Récupérer les plaintes de l'utilisateur connecté (particulier)
const getMyComplaints = async (req, res) => {
  try {
    const userId = req.user.id;
    const complaints = await Complaint.find({
  $or: [
    { utilisateur: userId },
    { participants: userId }
  ]
}).sort({ createdAt: -1 });


    res.status(200).json({
      message: "Plaintes de l'utilisateur récupérées avec succès",
      complaints,
    });
  } catch (err) {
    res.status(500).json({
      message: "Erreur serveur",
      error: err.message,
    });
  }
};
// Inviter un participant
const inviterParticipant = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Adresse email manquante" });
    }

    const participant = await User.findOne({ email });

    if (!participant) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const plainte = await Complaint.findById(req.params.id);
    if (!plainte) {
      return res.status(404).json({ error: "Plainte non trouvée" });
    }

    // Évite les doublons
    if (!plainte.participants.includes(participant._id)) {
      plainte.participants.push(participant._id);
      await plainte.save();
    }

    res.status(200).json({ message: "Participant ajouté avec succès", plainte });
  } catch (err) {
    console.error("Erreur dans inviterParticipant:", err); // ✅ log utile
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
};


// Mettre à jour la visibilité
const updateVisibilite = async (req, res) => {
  try {
    const { visibilite } = req.body;
    if (!["publique", "privée"].includes(visibilite)) {
      return res.status(400).json({ error: "Visibilité invalide" });
    }

    const plainte = await Complaint.findByIdAndUpdate(
      req.params.id,
      { visibilite },
      { new: true }
    );

    if (!plainte) return res.status(404).json({ error: "Plainte non trouvée" });

    res.status(200).json({ message: "Visibilité mise à jour", plainte });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
};

const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate("utilisateur", "prenom nom email");

    if (!complaint) {
      return res.status(404).json({ error: "Plainte non trouvée" });
    }

    // Optionnel : Vérifier que l'utilisateur est propriétaire de la plainte
    if (complaint.utilisateur.toString() !== req.user.id) {
      return res.status(403).json({ error: "Accès non autorisé" });
    }

    await complaint.deleteOne();
    res.status(200).json({ message: "Plainte supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
};
const getPublicComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
  .populate("utilisateur")
  .populate("chat.expediteur")
  .populate("participants"); // ← Ajout ici aussi


    if (!complaint) {
      return res.status(404).json({ error: "Plainte non trouvée" });
    }

    if (complaint.visibilite !== "publique") {
      return res.status(403).json({ error: "Cette plainte est privée." });
    }

    res.status(200).json({
      message: "Plainte publique récupérée avec succès",
      complaint,
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
};
// ✅ Supprimer un participant d'une plainte
const retirerParticipant = async (req, res) => {
  try {
    const { id, participantId } = req.params;
    const plainte = await Complaint.findById(id);

    if (!plainte) return res.status(404).json({ error: "Plainte non trouvée" });

    // Vérification : seul le créateur peut retirer un participant
    if (plainte.utilisateur.toString() !== req.user.id) {
      return res.status(403).json({ error: "Non autorisé" });
    }

    plainte.participants = plainte.participants.filter(
      (p) => p.toString() !== participantId
    );

    await plainte.save();

    res.status(200).json({ message: "Participant retiré avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
};
const suivrePlainte = async (req, res) => {
  console.log("🔥 Route /suivre appelée pour plainte", req.params.id);
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Plainte introuvable" });

    const userId = req.user.id;

    if (complaint.participants.includes(userId)) {
      complaint.participants = complaint.participants.filter((id) => id.toString() !== userId);
    } else {
      complaint.participants.push(userId);
    }

    await complaint.save();

const populatedComplaint = await Complaint.findById(req.params.id)
  .populate("utilisateur", "prenom nom email")
  .populate("participants", "prenom nom email");

res.status(200).json({ message: "Mise à jour du suivi réussie", complaint: populatedComplaint });

  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
// ✅ Simuler ou demander un paiement pour une plainte
const simulerPaiement = async (req, res) => {
  try {
    const { type, montant, description, destinataire, fichier } = req.body;
    const plainte = await Complaint.findById(req.params.id);
    if (!plainte) return res.status(404).json({ error: "Plainte non trouvée" });

    plainte.paiements.push({
      type,
      montant,
      description,
      destinataire,
      fichier,
      payeurs: [req.user.id],
      statut: "en attente",
      date: new Date()
    });

    await plainte.save();

    res.status(200).json({ message: "Paiement enregistré avec succès", plainte });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
};

// ✅ Récupérer les paiements d'une plainte
const getPaiements = async (req, res) => {
  try {
    const plainte = await Complaint.findById(req.params.id)
    .populate("paiements.participants.user", "prenom nom email")
    .populate("paiements.destinataire", "prenom nom email");
      
    if (!plainte) {
      return res.status(404).json({ error: "Plainte non trouvée" });
    }

    res.status(200).json(plainte.paiements || []);
  } catch (err) {
    console.error("Erreur getPaiements :", err);
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
};


const payerPart = async (req, res) => {
  try {
    const plainte = await Complaint.findById(req.params.id);
    if (!plainte) return res.status(404).json({ error: "Plainte non trouvée" });

    const paiement = plainte.paiements.id(req.params.pid);
    if (!paiement) return res.status(404).json({ error: "Paiement non trouvé" });

    if (paiement.typePaiement !== "partagé") {
      return res.status(400).json({ error: "Ce paiement n'est pas partagé" });
    }

    const participant = paiement.participants.find(p => p.user.toString() === req.user._id.toString());
    if (!participant) {
      return res.status(403).json({ error: "Vous n'êtes pas concerné par ce paiement" });
    }

    if (participant.statut === "payé") {
      return res.status(400).json({ error: "Part déjà réglée" });
    }

    // Simuler le paiement
    participant.statut = "payé";
    participant.date_paiement = new Date();

    // Met à jour le statut global
    const totalParticipants = paiement.participants.length;
    const totalPayes = paiement.participants.filter(p => p.statut === "payé").length;

    if (totalPayes === 0) {
      paiement.statut = "en attente";
    } else if (totalPayes < totalParticipants) {
      paiement.statut = "partiellement payé";
    } else {
      paiement.statut = "payé";
    }

    await plainte.save();
    res.status(200).json({ message: "Part payée", paiement });
  } catch (err) {
    console.error("Erreur payerPart:", err);
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
};









module.exports = {
  createComplaint,
  getComplaintsForAvocat,
  getComplaintById,
  updateComplaint,
  updateComplaintStatus,
  addChatMessage,
  addCoffreFortFile,
  deleteCoffreFortFile,
  getMyComplaints,
  inviterParticipant,
  updateVisibilite,
  deleteComplaint,
  getPublicComplaintById,
  retirerParticipant,
  suivrePlainte,
  simulerPaiement,
  getPaiements,
  payerPart,
};
