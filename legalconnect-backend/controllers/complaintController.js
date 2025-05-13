const Complaint = require("../models/complaint");
const fs = require("fs");
const path = require("path");

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
    const complaint = await Complaint.findById(req.params.id).populate("utilisateur");

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
    const complaint = await Complaint.findById(req.params.id);

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
    const complaint = await Complaint.findById(req.params.id);

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

module.exports = {
  createComplaint,
  getComplaintsForAvocat,
  getComplaintById,
  updateComplaint,
  updateComplaintStatus,
  addChatMessage,
  addCoffreFortFile,
  deleteCoffreFortFile,
};
