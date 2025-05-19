// models/commentaire.js
const mongoose = require("mongoose");

const commentaireSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  auteur: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  contenu: { type: String, required: true },
  piecesJointes: [
    {
      nomFichier: String,
      url: String,
    },
  ],
  dateCreation: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Commentaire", commentaireSchema);
