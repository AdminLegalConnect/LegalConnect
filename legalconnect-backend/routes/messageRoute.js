const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  getMessagesWithUser,
  sendMessage,
  getConversations,
} = require("../controllers/messageController");

router.get("/discussions", auth, getConversations); // <- 🔄 corriger ici
router.get("/:destinataireId", auth, getMessagesWithUser);
router.post("/", auth, sendMessage);

module.exports = router;
