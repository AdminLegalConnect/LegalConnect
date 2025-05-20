const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const profilRoutes = require("./routes/profil"); // Ajout des routes de profil
const complaintRoutes = require("./routes/complaintRoutes"); // Ajout des routes pour les plaintes
const homeRoutes = require("./routes/homeRoutes"); // Ajout des routes pour l'accueil
const avisRoutes = require("./routes/avisRoutes"); // Routes pour les avis
const forumRoutes = require("./routes/forumRoutes");
const etapeJuridiqueRoutes = require("./routes/etapeJuridiqueRoutes");



const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", authRoutes);      // Pour /api/signup et /api/login
app.use("/api", userRoutes);      // Routes liées aux utilisateurs
app.use("/api", profilRoutes);    // Routes pour le profil utilisateur
app.use("/api", complaintRoutes); // Routes pour les plaintes
app.use("/api", etapeJuridiqueRoutes);
app.use("/api", homeRoutes);      // Routes d'accueil
app.use("/api", avisRoutes);      // Routes pour les avis
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", forumRoutes);


// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("✅ Connecté à MongoDB !");
    app.listen(PORT, () => {
      console.log(`🚀 Serveur backend en ligne sur le port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Erreur MongoDB :", error);
  });
