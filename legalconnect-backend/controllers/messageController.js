const Message = require("../models/message");
const User = require("../models/user");

const getMessagesWithUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const destinataireId = req.params.destinataireId;

    const messages = await Message.find({
      $or: [
        { expediteur: userId, destinataire: destinataireId },
        { expediteur: destinataireId, destinataire: userId },
      ],
    })
      .sort("createdAt")
      .populate("expediteur", "prenom nom email"); // 👈 on enrichit ici

    const formatted = messages.map((msg) => ({
      _id: msg._id,
      texte: msg.texte,
      estExpediteur: msg.expediteur._id.toString() === userId,
      createdAt: msg.createdAt,
      expediteurNom: `${msg.expediteur.prenom} ${msg.expediteur.nom}`,
      expediteurEmail: msg.expediteur.email,
    }));
await Message.updateMany(
  {
    expediteur: destinataireId,
    destinataire: userId,
    lu: false,
  },
  { $set: { lu: true } }
);

    res.json(formatted);
  } catch (err) {
    console.error("Erreur getMessagesWithUser", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { destinataireId, texte } = req.body;
    const nouveauMessage = new Message({
      expediteur: req.user.id,
      destinataire: destinataireId,
      texte,
    });
    const saved = await nouveauMessage.save();
    res.json({
      _id: saved._id,
      texte: saved.texte,
      estExpediteur: true,
      createdAt: saved.createdAt,
    });
  } catch (err) {
    console.error("Erreur sendMessage", err);
    res.status(500).json({ message: "Erreur envoi message" });
  }
};

const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await Message.find({
      $or: [{ expediteur: userId }, { destinataire: userId }],
    })
      .sort("-createdAt")
      .populate("expediteur", "prenom nom email")
      .populate("destinataire", "prenom nom email");

    const seen = new Set();
    const conversations = [];

    for (let msg of messages) {
  const other =
    msg.expediteur._id.toString() === userId
      ? msg.destinataire
      : msg.expediteur;

  if (!seen.has(other._id.toString())) {
    seen.add(other._id.toString());

    // ➕ Compter les messages non lus de cet utilisateur
    const nonLus = await Message.countDocuments({
      expediteur: other._id,
      destinataire: userId,
      lu: false,
    });

    conversations.push({
      user: {
        _id: other._id,
        prenom: other.prenom,
        nom: other.nom,
        email: other.email,
      },
      lastMessage: msg.texte,
      nonLus, // 👈 renvoyé au front
    });
  }
}


    res.json(conversations);
  } catch (err) {
    console.error("Erreur getConversations", err);
    res.status(500).json({ message: "Erreur récupération discussions" });
  }
};

module.exports = {
  getMessagesWithUser,
  sendMessage,
  getConversations,
};
