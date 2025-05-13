# 📚 LegalConnect - Backend

LegalConnect est une plateforme permettant aux citoyens de créer, gérer et suivre des dossiers de litiges juridiques de manière collective, avec l'accompagnement de professionnels du droit.

Ce dépôt correspond à la **partie backend** de l'application, développée avec **Node.js**, **Express**, et **MongoDB**.

---

## 🚀 Fonctionnalités

- Authentification sécurisée JWT
- Création de comptes (Particulier / Avocat)
- Connexion / Déconnexion
- Récupération du profil utilisateur
- Mise à jour du profil
- (À venir) Dépôt et gestion des dossiers juridiques

---

## 🛠️ Technologies utilisées

- Node.js
- Express.js
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- Bcrypt
- Dotenv

---

## 📦 Installation

### Prérequis

- Node.js (v18+)
- MongoDB en local ou via MongoDB Atlas

---

## 🧑‍💻 Démarrage

1. **Clone le repo :**

```bash
git clone https://github.com/MarcYassi225/legalconnect-backend.git
cd legalconnect-backend
Installe les dépendances :

bash
Copier
Modifier
npm install
Configure les variables d'environnement :

Crée un fichier .env à la racine avec ce contenu (à adapter selon ta config) :

env
Copier
Modifier
PORT=5000
MONGODB_URI=mongodb://localhost:27017/legalconnect
JWT_SECRET=ton_secret_pour_jwt
Lance le serveur :

bash
Copier
Modifier
npm start
Par défaut, le backend tourne sur http://localhost:5000

📁 Structure du projet
bash
Copier
Modifier
legalconnect-backend/
│
├── controllers/        # Logique métier (profil, auth, etc.)
├── middlewares/        # Middlewares d'authentification
├── models/             # Modèles Mongoose
├── routes/             # Routes Express
├── .env                # Variables d'environnement (à créer)
├── server.js           # Point d'entrée de l'app
└── package.json        # Dépendances & scripts
🧪 Tests
Des routes peuvent être testées facilement avec Postman, Thunder Client ou Insomnia.

✅ TODO
 Authentification

 Création & récupération du profil

 Dépôt de dossiers juridiques

 Interface admin pour avocats

 Notifications

 Upload de fichiers

 Historique des échanges

👨‍💻 Auteur
Marc Yassi
📧 Contact GitHub

📝 Licence
Ce projet est sous licence MIT — libre à vous de l'utiliser, le modifier et le partager !

yaml
Copier
Modifier

---

Dis-moi si tu veux une version avec ton logo (si tu en as un), ou une section "Frontend" plus tard.






