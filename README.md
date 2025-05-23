# LegalConnect

**LegalConnect** est une application web innovante dédiée à la gestion collective des litiges juridiques. Elle permet aux citoyens de déposer des plaintes ou de demander des avis juridiques, tout en facilitant la mise en relation avec des professionnels du droit.

---

## 🚀 Objectif du projet

Offrir une plateforme accessible, centralisée et collaborative pour :
- Déposer et suivre des plaintes collectives.
- Obtenir des avis juridiques de la part d’avocats partenaires.
- Suivre l'évolution des démarches via une interface intuitive.
- Accéder à un coffre-fort sécurisé pour centraliser les documents.
- Interagir via un système de chat et de forum communautaire.

---

## 🧑‍💻 Utilisateurs visés

- **Particuliers** : peuvent déposer des dossiers, suivre leurs plaintes ou demandes d’avis, consulter les retours, échanger avec des professionnels et stocker leurs documents.
- **Professionnels du droit** : peuvent suivre les dossiers attribués, proposer des évaluations, fournir des avis et planifier leurs démarches.

---

## 🧱 Architecture du projet

Le projet est structuré en deux dossiers principaux :

legalconnect-backend/
legalconnect-frontend/

yaml
Copier
Modifier

- **Backend (Node.js + Express + MongoDB)** :
  - Authentification JWT
  - API REST sécurisée
  - Gestion des utilisateurs, plaintes, avis, fichiers, messages, forums, étapes juridiques, etc.

- **Frontend (React.js)** :
  - Interface moderne avec gestion des rôles (particulier / avocat)
  - Pages : accueil, dépôt de dossier, messagerie, coffre-fort, forum, espace personnel, etc.
  - Intégration Axios pour communication avec l’API

---

## 🔐 Fonctionnalités principales

### Pour les particuliers :
- Dépôt de plainte ou d’avis juridique
- Coffre-fort sécurisé de documents
- Chat avec les juristes
- Forum communautaire
- Historique des actions et des statuts

### Pour les juristes :
- Consultation des demandes d’avis
- Propositions d’évaluation
- Génération et ajout d'avis PDF
- Gestion de planning (rendez-vous, audiences, sommations)
- Suivi juridique structuré

---

## 🛠 Stack technique

- **Frontend** : React.js, TailwindCSS
- **Backend** : Node.js, Express.js, MongoDB
- **Authentification** : JWT
- **Fichiers** : Upload avec Multer
- **Outils** : GitHub, GitHub Desktop, Visual Studio Code

---

## 📦 Installation locale

```bash
# Clone du projet
git clone https://github.com/AdminLegalConnect/LegalConnect.git
cd LegalConnect

# Backend
cd legalconnect-backend
npm install
npm run dev

# Frontend (dans un autre terminal)
cd ../legalconnect-frontend
npm install
npm start
✅ Statut du projet
🧪 En développement actif — Objectif MVP juillet 2025
Les fonctionnalités principales sont opérationnelles en local (authentification, dépôt de plainte, avis juridique, messagerie, forum, coffre-fort...).

📌 Prochaines étapes
Intégration du système de forfaits et facturation

Planification intégrée (agendas, rappels)

Notifications email et mobile

IA prédictive pour l’évaluation des chances de succès (v2+)

🤝 Contribuer
Les contributions sont les bienvenues !
Contact : admin.legalconnect@gmail.com

🛡️ Licence
Projet sous licence MIT — libre de modification et d’utilisation commerciale.

yaml
Copier
Modifier

---

Tu peux le copier-coller dans un fichier `README.md` à la racine du dépôt (via GitHub ou ton éditeur).

Souhaite-tu que je t’aide à l’ajouter et le pusher directement depuis ton poste ?
