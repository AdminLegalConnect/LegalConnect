const mongoose = require("mongoose");

const commentaireSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  auteur: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  contenu: { type: String, required: true },
  dateCreation: { type: Date, default: Date.now },
  piecesJointes: [
    {
      nomFichier: String,
      url: String,
      dateAjout: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });
