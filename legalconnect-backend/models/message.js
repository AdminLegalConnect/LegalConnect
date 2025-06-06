const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    expediteur: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    destinataire: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    texte: { type: String, required: true },
    lu: { type: Boolean, default: false }, // 👈 ajouté ici
  },
  { timestamps: true }
);


module.exports = mongoose.model("Message", messageSchema);
