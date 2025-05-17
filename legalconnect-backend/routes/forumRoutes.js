const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");



const {
  uploadPostFile,
  uploadCommentFile,
  getAllPosts,
  createPost,
  getPostById,
  createComment
} = require("../controllers/forumController");


// Upload fichier pour un post
router.post("/forum/posts/:postId/upload", upload.single("fichier"), uploadPostFile);

// Upload fichier pour un commentaire
router.post("/forum/commentaires/:commentaireId/upload", upload.single("fichier"), uploadCommentFile);

// GET tous les posts
router.get("/forum/posts", getAllPosts);

// POST créer un nouveau post
router.post("/forum/posts", authMiddleware, createPost);

// GET un post par ID (avec commentaires peuplés)
router.get("/forum/posts/:id", getPostById);

// POST ajouter un commentaire à un post
router.post("/forum/posts/:postId/commentaires", authMiddleware, createComment);


module.exports = router;
