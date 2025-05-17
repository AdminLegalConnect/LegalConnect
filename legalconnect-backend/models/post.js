// models/post.js
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  contenu: { type: String, required: true },
  auteur: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  dateCreation: { type: Date, default: Date.now },
  thematique: { type: String, required: true }, // ex : "Voisinage", "Travail", etc.
    piecesJointes: [
  {
    nomFichier: String,
    url: String,
    dateAjout: { type: Date, default: Date.now }
  }
],

}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
