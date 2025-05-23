const User = require("../models/user");
const bcrypt = require("bcrypt");

// ✅ GET /api/profil
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('avis', 'titre')  // Peupler le tableau "avis" avec les titres des avis
      .select("-password"); // Exclure le mot de passe pour des raisons de sécurité

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    res.status(200).json({
      message: "Profil utilisateur récupéré avec succès.",
      profil: user,
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
};

// ✅ PUT /api/profil
const updateProfile = async (req, res) => {
  try {
    const { nom, prenom, email, telephone, ville, specialite, siteInternet } = req.body;
    if (!email || !nom || !prenom) return res.status(400).json({ error: "Champs obligatoires manquants." });
    if (req.body.role) return res.status(403).json({ error: "Modification du rôle interdite." });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { nom, prenom, email, telephone, ville, specialite, siteInternet },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ error: "Utilisateur non trouvé." });
    res.status(200).json({ message: "Profil mis à jour avec succès.", profil: updatedUser });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
};

// 🔐 PUT /api/profil/motdepasse
const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { ancienMotDePasse, nouveauMotDePasse } = req.body;
    const match = await bcrypt.compare(ancienMotDePasse, user.password);
    if (!match) return res.status(400).json({ message: "Mot de passe actuel incorrect." });

    user.password = await bcrypt.hash(nouveauMotDePasse, 10);
    await user.save();
    res.status(200).json({ message: "Mot de passe mis à jour avec succès." });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors du changement de mot de passe", error: err.message });
  }
};

// ⭐ POST /api/profil/note
const ajouterNote = async (req, res) => {
  try {
    const { avocatId, note, commentaire, plainteId } = req.body;
    const utilisateurId = req.user.id;

    if (!avocatId || !note || !plainteId) {
      return res.status(400).json({ message: "Informations incomplètes." });
    }

    const avocat = await User.findById(avocatId);
    if (!avocat || avocat.role !== "juridique") {
      return res.status(404).json({ message: "Avocat introuvable." });
    }

    // Empêche les doublons : 1 note par utilisateur et par plainte
    const dejaNote = avocat.notes?.some(
      (n) => n.utilisateur?.toString() === utilisateurId && n.plainte?.toString() === plainteId
    );

    if (dejaNote) {
      return res.status(400).json({ message: "Vous avez déjà noté cet avocat pour cette plainte." });
    }

    avocat.notes.push({
      utilisateur: utilisateurId,
      plainte: plainteId,
      note,
      commentaire,
    });

    await avocat.save();
    res.status(200).json({ message: "Note enregistrée avec succès." });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la note:", error);
    res.status(500).json({ message: "Erreur serveur lors de l'ajout de la note." });
  }
};


// 💬 POST /api/profil/commentaire
const ajouterCommentaire = async (req, res) => {
  try {
    const { professionnelId, texte } = req.body;
    const auteur = req.user;

    const professionnel = await User.findById(professionnelId);
    if (!professionnel || professionnel.role !== "juridique") {
      return res.status(404).json({ message: "Professionnel introuvable" });
    }

    const nouveauCommentaire = {
      auteurId: auteur._id,
      auteurNom: `${auteur.prenom} ${auteur.nom}`,
      texte
    };

    professionnel.commentaires.push(nouveauCommentaire);
    await professionnel.save();

    res.status(200).json({ message: "Commentaire ajouté avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'ajout du commentaire", error: err.message });
  }
};

// 🚨 DELETE /api/profil
const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({ message: "Compte supprimé avec succès." });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression du compte", details: err.message });
  }
};

const uploadProfilePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    if (!req.file) return res.status(400).json({ error: "Aucune photo reçue." });

    user.photo = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({ message: "Photo de profil mise à jour.", profil: user });
  } catch (err) {
    console.error("Erreur lors du téléchargement de la photo :", err);
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  ajouterNote,
  deleteAccount,
  ajouterCommentaire,
  uploadProfilePhoto, // 👈 assure-toi de l'exporter ici
};