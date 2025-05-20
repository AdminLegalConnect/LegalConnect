const mongoose = require("mongoose");

const etapeJuridiqueSchema = new mongoose.Schema({
  plainteId: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint", required: true },
  titre: { type: String, required: true },
  statut: { type: String, enum: ["à faire", "en cours", "terminée"], default: "à faire" },
  dateCible: { type: Date },
  commentaire: { type: String },
  fichier: { type: String }, // URL du fichier s’il y en a un
}, { timestamps: true });

module.exports = mongoose.model("EtapeJuridique", etapeJuridiqueSchema);