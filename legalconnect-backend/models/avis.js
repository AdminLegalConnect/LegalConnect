// models/avis.js
const mongoose = require("mongoose");

const avisSchema = new mongoose.Schema({
  utilisateurId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  titre: { type: String, required: true },
  description: { type: String, required: true },
  statut: { type: String, enum: ["en attente", "en cours", "résolu"], default: "en attente" },  // Statut de l'avis
  chat: [
    {
      auteurId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      texte: { type: String },
      date: { type: Date, default: Date.now },
    },
  ], // Chat associé à l'avis
  coffreFort: [
    {
      fichier: { type: String }, // Lien vers les fichiers
      description: { type: String },
      dateAjout: { type: Date, default: Date.now },
    },
  ], // Coffre-fort pour ajouter des documents
  dateDepot: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Avis", avisSchema);
