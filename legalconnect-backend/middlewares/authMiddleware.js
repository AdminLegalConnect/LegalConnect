const jwt = require("jsonwebtoken");
const User = require("../models/user"); // ajuste le chemin si besoin

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Accès non autorisé, token manquant." });
  }

  try {
    const tokenSansBearer = token.split(" ")[1];
    const decoded = jwt.verify(tokenSansBearer, process.env.JWT_SECRET);

    // On récupère l'utilisateur complet à partir de l'ID décodé
    const userId = decoded.id || decoded._id; // 👈 on couvre les 2 cas
    const user = await User.findById(userId);

  if (!user) {
  return res.status(401).json({ error: "Utilisateur non trouvé." });
}

req.user = {
  ...user.toObject(),
  id: user._id.toString(),
};

    next();
  } catch (err) {
    res.status(401).json({ error: "Token invalide." });
  }
};

module.exports = authMiddleware;
