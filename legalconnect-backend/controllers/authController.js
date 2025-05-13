const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Ajouter jwt
const User = require("../models/user");

// SIGNUP
const signupUser = async (req, res) => {
  try {
    const { email, password, nom, prenom, role } = req.body;

    // Vérification si l'email est déjà utilisé
    const userExiste = await User.findOne({ email });
    if (userExiste) {
      return res.status(400).json({
        error: "L'email est déjà utilisé.",
        details: "Veuillez essayer avec un autre email.",
      });
    }

    // Hashing du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création du nouvel utilisateur
    const nouvelUtilisateur = new User({
      email,
      password: hashedPassword,
      nom,
      prenom,
      role,
    });

    await nouvelUtilisateur.save();

    res.status(201).json({
      message: "Utilisateur inscrit avec succès !",
      utilisateur: {
        id: nouvelUtilisateur._id,
        email: nouvelUtilisateur.email,
        role: nouvelUtilisateur.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Erreur serveur",
      details: "Une erreur interne s'est produite lors de l'inscription.",
    });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Recherche de l'utilisateur par email
    const utilisateur = await User.findOne({ email });
    if (!utilisateur) {
      return res.status(401).json({
        error: "Email ou mot de passe incorrect.",
        details: "Veuillez vérifier votre email ou mot de passe.",
      });
    }

    // Log pour vérifier le mot de passe stocké dans la DB
    console.log("Mot de passe hashé dans la DB : ", utilisateur.password);

    // Vérification du mot de passe
    const estValide = await bcrypt.compare(password, utilisateur.password);
    if (!estValide) {
      return res.status(401).json({
        error: "Email ou mot de passe incorrect.",
        details: "Le mot de passe ne correspond pas à l'email.",
      });
    }

    // Générer un token JWT après la connexion
    const token = jwt.sign(
      { id: utilisateur._id, email: utilisateur.email, role: utilisateur.role },
      process.env.JWT_SECRET, // Utiliser la clé secrète
      { expiresIn: "1h" } // Le token expire dans 1 heure
    );

    res.status(200).json({
      message: "Connexion réussie !",
      utilisateur: {
        id: utilisateur._id,
        email: utilisateur.email,
        role: utilisateur.role,
      },
      token, // Retourner le token dans la réponse
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Erreur serveur",
      details: "Une erreur interne s'est produite lors de la connexion.",
    });
  }
};


// EXPORTS
module.exports = {
  signupUser,
  loginUser,
};
