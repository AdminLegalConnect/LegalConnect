const mongoose = require("mongoose");

// ✅ Définir un sous-schema pour les fichiers dans le coffre-fort
const fileSchema = new mongoose.Schema({
  nom_fichier: { type: String, required: true },
  type: { type: String, required: true },
  url: { type: String, required: true },
  auteur: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date_upload: { type: Date, default: Date.now },
}, { _id: true });

// ✅ Définir un sous-schema pour les paiements
const paiementSchema = new mongoose.Schema({
  type: { type: String, enum: ["honoraires", "huissier", "autre"], required: true },
  montant: { type: Number, required: true },
  description: { type: String },
  payeurs: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  destinataire: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fichier: { type: String }, // lien vers une facture stockée dans le coffre-fort ou ailleurs
  statut: { type: String, enum: ["en attente", "partiellement payé", "payé"], default: "en attente" },
  date: { type: Date, default: Date.now }
}, { _id: true });

// ✅ Définir le schema principal pour les plaintes
const complaintSchema = new mongoose.Schema({
  titre: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  statut: { type: String, enum: ["en cours", "résolue", "fermée"], default: "en cours" },
  visibilite: { type: String, enum: ["publique", "privée"], default: "privée" },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  pieces_jointes: { type: [String], default: [] },
  historique_actions: [
    {
      action: String,
      date: { type: Date, default: Date.now },
    }
  ],
  chat: [
    {
      expediteur: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      message: { type: String, required: true },
      date: { type: Date, default: Date.now },
    }
  ],
  coffre_fort: { type: [fileSchema], default: [] },
  paiements: { type: [paiementSchema], default: [] }, // ✅ Ajout du tableau de paiements
  date_creation: { type: Date, default: Date.now },
  date_maj: { type: Date, default: Date.now },
}, { timestamps: true });

// ✅ Exporter le modèle
module.exports = mongoose.model("Complaint", complaintSchema);
