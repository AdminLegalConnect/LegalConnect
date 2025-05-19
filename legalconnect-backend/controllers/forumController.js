// controllers/forumController.js
const Post = require("../models/post");
const Commentaire = require("../models/commentaire");
const mongoose = require("mongoose"); // <-- tu dois l’ajouter en haut du fichier

// Ajouter une pièce jointe à un post
const uploadPostFile = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!req.file) return res.status(400).json({ message: "Aucun fichier envoyé." });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post non trouvé." });

    post.piecesJointes.push({
      nomFichier: req.file.originalname,
      url: `/uploads/forum/${req.file.filename}`,
    });
    await post.save();

    res.status(200).json({ message: "Fichier ajouté au post.", post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Ajouter une pièce jointe à un commentaire
const uploadCommentFile = async (req, res) => {
  try {
    const { commentaireId } = req.params;
    if (!req.file) return res.status(400).json({ message: "Aucun fichier envoyé." });

    const commentaire = await Commentaire.findById(commentaireId);
    if (!commentaire) return res.status(404).json({ message: "Commentaire non trouvé." });

    commentaire.piecesJointes.push({
      nomFichier: req.file.originalname,
      url: `/uploads/forum/${req.file.filename}`,
    });
    await commentaire.save();

    res.status(200).json({ message: "Fichier ajouté au commentaire.", commentaire });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Récupérer tous les posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("auteur", "prenom email").sort({ dateCreation: -1 });
    res.status(200).json({ posts });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des posts", error: err.message });
  }
};

// Créer un post
const createPost = async (req, res) => {
  try {
    const { titre, contenu, thematique } = req.body;

    const post = new Post({
      titre,
      contenu,
      thematique,
      auteur: req.user.id,
    });

    await post.save();
    res.status(201).json({ message: "Post créé avec succès", post });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la création du post", error: err.message });
  }
};

// Récupérer un post avec ses commentaires
const getPostById = async (req, res) => {
  console.log("Requête reçue pour post ID:", req.params.id);

  // Vérifier d'abord la validité de l'ID
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID invalide" });
  }

  try {
    const post = await Post.findById(req.params.id)
      .populate("auteur", "prenom email")
      .populate({
        path: "commentaires",
        populate: { path: "auteur", select: "prenom email" },
      });

    if (!post) return res.status(404).json({ message: "Post non trouvé" });

    res.status(200).json({ post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération du post", error: err.message });
  }
};


// POST /posts/:id/commentaires
const ajouterCommentaire = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post non trouvé" });

    const commentaire = new Commentaire({
      contenu: req.body.contenu,
      auteur: req.user.id,
      post: post._id,
    });

    await commentaire.save();

    // ✅ Ajoute l'ID du commentaire au post
    post.commentaires = post.commentaires || []; // protection au cas où
    post.commentaires.push(commentaire._id);
    await post.save();

    res.status(201).json({ message: "Commentaire ajouté", comment: commentaire });
  } catch (err) {
    console.error("Erreur lors de l'ajout du commentaire :", err);
    res.status(500).json({ message: "Erreur serveur lors de l'ajout du commentaire", error: err.message });
  }
};





module.exports = {
  uploadPostFile,
  uploadCommentFile,
  getAllPosts,
  createPost,
  getPostById,
  ajouterCommentaire,
};
