// models/avis.js
const mongoose = require("mongoose");

const avisSchema = new mongoose.Schema({
  utilisateurId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  titre: { type: String, required: true },
  description: { type: String, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  propositions: [
  {
    avocatId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    prix: Number,
    message: String,
    statut: {
      type: String,
      enum: ["en attente", "acceptée", "refusée"],
      default: "en attente"
    },
    date: { type: Date, default: Date.now }
  }
],

  statut: { type: String, enum: ["en attente", "en cours", "résolu"], default: "en attente" },  // Statut de l'avis
  historiqueStatut: [
  {
    statut: String,
    date: { type: Date, default: Date.now },
    modifiéPar: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  }
],

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
      accessibleApresPaiement: { type: Boolean, default: false } // 🆕
    },
  ],
   paiements: [{
  utilisateurId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  fichier: { type: String },
  date: { type: Date, default: Date.now }
}],
  dateDepot: { type: Date, default: Date.now },
}, { timestamps: true });


module.exports = mongoose.model("Avis", avisSchema);
