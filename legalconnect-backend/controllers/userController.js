const User = require("../models/user");
const bcrypt = require("bcrypt");


// ✅ GET /api/profil
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('avis', 'titre')
      .select("-password");

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    // Calcul de la note moyenne pour les juridiques
    let moyenneNote = null;
    if (user.role === "juridique" && user.notes.length > 0) {
      const total = user.notes.reduce((acc, n) => acc + (n.valeur || 0), 0);
      moyenneNote = parseFloat((total / user.notes.length).toFixed(2));
    }

    res.status(200).json({
      message: "Profil utilisateur récupéré avec succès.",
      profil: { ...user.toObject(), moyenneNote },
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

    const dejaNote = avocat.notes?.some(
      (n) =>
        n.auteurId?.toString() === utilisateurId &&
        n.plainte?.toString() === plainteId
    );

    if (dejaNote) {
      return res.status(400).json({ message: "Vous avez déjà noté cet avocat pour cette plainte." });
    }

    avocat.notes.push({
      auteurId: utilisateurId,
      valeur: note,
      commentaire,
      plainte: plainteId,
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

const rechercherJuridiques = async (req, res) => {
  try {
    const query = req.query.q?.toLowerCase() || "";
    const juridiques = await User.find({
      role: "juridique",
      $or: [
        { prenom: { $regex: query, $options: "i" } },
        { nom: { $regex: query, $options: "i" } },
        { specialite: { $regex: query, $options: "i" } },
      ],
    }).select("prenom nom email specialite notes");

    const juridiquesAvecNote = juridiques.map(j => {
      const total = j.notes?.reduce((sum, n) => sum + (n.valeur || 0), 0);
      const moyenne = j.notes?.length ? (total / j.notes.length).toFixed(2) : null;
      return {
        _id: j._id,
        prenom: j.prenom,
        nom: j.nom,
        email: j.email,
        specialite: j.specialite,
        moyenneNote: moyenne,
      };
    });

    res.status(200).json(juridiquesAvecNote);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la recherche", error: err.message });
  }
};
// Récupérer les messages reçus
const getMessages = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("messagesRecus.expediteur", "prenom nom email")
      .lean();

    res.status(200).json(user.messagesRecus.reverse());
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
};

// Envoyer un message avec (optionnellement) un fichier
const envoyerMessage = async (req, res) => {
  try {
    const { destinataireId, texte } = req.body;
    const expediteurId = req.user.id;

    const fichier = req.file
      ? {
          nom: req.file.originalname,
          type: req.file.mimetype,
          url: `/uploads/${req.file.filename}`
        }
      : null;

    const destinataire = await User.findById(destinataireId);
    if (!destinataire) {
      return res.status(404).json({ error: "Destinataire introuvable" });
    }

    destinataire.messagesRecus.push({
      expediteur: expediteurId,
      texte,
      fichier,
      lu: false
    });

    await destinataire.save();
    res.status(200).json({ message: "Message envoyé avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "_id prenom nom email photo role");
    res.json(users);
  } catch (error) {
    console.error("Erreur récupération utilisateurs", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Lecture seule d’un profil par ID
const getUserPublicProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
      .select("-password")
      .populate("avis", "titre");

    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    // Calcul note moyenne pour les juridiques
    let moyenneNote = null;
    if (user.role === "juridique" && user.notes?.length) {
      const total = user.notes.reduce((sum, n) => sum + (n.valeur || 0), 0);
      moyenneNote = (total / user.notes.length).toFixed(2);
    }

    res.status(200).json({ profil: { ...user.toObject(), moyenneNote } });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};






module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  ajouterNote,
  deleteAccount,
  ajouterCommentaire,
  uploadProfilePhoto,
  rechercherJuridiques,
  getMessages,
  getAllUsers,
  envoyerMessage,
  getUserPublicProfile,
   // 👈 assure-toi de l'exporter ici
};