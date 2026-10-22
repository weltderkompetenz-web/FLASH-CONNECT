# FLASH CONNECT — Plateforme Numérique Universitaire

**FLASH CONNECT** est l'application web de gestion universitaire conçue pour la Faculté des Lettres, Arts et Sciences Humaines (FLASH) de l'Université de Parakou, Bénin.

Ce projet constitue la première version (prototype MVP) de la plateforme, développée exclusivement avec les technologies web standards (HTML5, CSS3, JavaScript Vanilla, LocalStorage).

---

## 🚀 Fonctionnalités Principales

### 1. Page d'Accueil Publique (`index.html`)
- Présentation de la faculté et de la plateforme.
- Statistiques clés (nombre d'étudiants, départements, cours, demandes).
- Grille des fonctionnalités et services étudiants.
- Aperçu des derniers communiqués officiels.

### 2. Démonstration d'Authentification (`login.html`, `register.html`)
- **Boutons de sélection rapide de rôle** pour la démonstration (Étudiant, Enseignant, Valideur, Administrateur, Auditeur).
- Masquage/Affichage dynamique du mot de passe.
- Modal de récupération de mot de passe.
- Formulaire d'inscription étudiant avec sauvegarde automatique dans le `LocalStorage`.
- Gestion des sessions actives et déconnexion.

### 3. Tableau de Bord Réactif (`dashboard.html`)
- Bannière de bienvenue personnalisée selon le rôle et le département.
- Cartes de statistiques en temps réel.
- Planning rapide des cours du jour.
- Journal d'activités et d'audits récents.

### 4. Gestion Académique & Services
- **Étudiants (`students.html`)** : Liste complète, recherche multi-critères, filtres par département/niveau, modal d'ajout et d'édition d'étudiant.
- **Catalogue de Cours (`courses.html`)** : Fiches de cours et Unités d'Enseignement (UE), modal de détails pédagogiques et téléchargement des syllabus.
- **Emploi du Temps (`timetable.html`)** : Planning hebdomadaire structuré par promotion et salle de cours, fonction d'impression/export.
- **Demandes de Documents (`document-requests.html`)** : Formulaire de demande d'attestation de succès, relevé de notes, certificat de scolarité, et workflow d'approbation/rejet pour le rôle Valideur/Admin.
- **Bibliothèque Numérique (`documents.html`)** : Téléchargement de règlements, guides et formulaires officiels avec compteur de téléchargements.
- **Annonces Officielles (`announcements.html`)** : Publication et consultation des communiqués administratifs avec filtres.
- **Annuaire des Enseignants (`teachers.html`)** : Liste du corps professoral, bureaux et heures de réception.
- **Panneau d'Administration (`admin.html`)** : Gestion des comptes, rôles, logs d'audits système et réinitialisation des données de test.
- **Profil Utilisateur (`profile.html`)** : Consultation des informations du compte, changement de mot de passe et préférences.

---

## 🎨 Thème & Design UI/UX
- **Charte Graphique** :
  - Bleus Académiques Profonds (`#1e3a8a`, `#0f172a`)
  - Accent Doré Universitaire (`#d97706`)
  - Fond Épuré (`#f8fafc`)
- **Mode Sombre / Clair** : Commutateur dynamique conservé dans `LocalStorage`.
- **Sensibilité Mobile** : Sidebar rétractable avec overlay responsive.

---

## 🔑 Comptes de Démonstration (Identifiants)

Sur la page `login.html`, vous pouvez cliquer directement sur les boutons de rôle pour remplir automatiquement les identifiants :

| Rôle | Email / Identifiant | Mot de Passe |
| :--- | :--- | :--- |
| **Étudiant** | `koffi.bio@etud.u-parakou.bj` | `Password123!` |
| **Enseignant** | `ibrahim.alassane@u-parakou.bj` | `Password123!` |
| **Valideur de Documents** | `marie.dossou@u-parakou.bj` | `Password123!` |
| **Administrateur** | `admin.flash@u-parakou.bj` | `Password123!` |
| **Auditeur Externe** | `auditeur@u-parakou.bj` | `Password123!` |

---

## 📁 Structure du Projet

```text
flash-connect/
├── index.html                  # Page d'accueil publique
├── login.html                  # Page de connexion
├── register.html               # Page d'inscription
├── dashboard.html              # Tableau de bord principal
├── students.html              # Gestion des étudiants
├── courses.html               # Catalogue des cours et UE
├── timetable.html             # Emploi du temps hebdomadaire
├── announcements.html         # Annonces et communiqués
├── document-requests.html     # Demandes et suivi de documents
├── documents.html             # Bibliothèque numérique téléchargeable
├── teachers.html              # Annuaire du corps enseignant
├── admin.html                 # Administration et journal d'audit
├── profile.html               # Profil et paramètres de compte
├── assets/
│   ├── css/
│   │   ├── style.css          # Variables CSS, thèmes, boutons, modales
│   │   ├── auth.css           # Styles spécifiques aux pages d'authentification
│   │   └── dashboard.css      # Layout dashboard, sidebar, cartes, tables
│   ├── js/
│   │   ├── main.js            # Initialisation LocalStorage, thème, toasts
│   │   ├── auth.js            # Gestion session, login, inscription, rôles
│   │   ├── dashboard.js       # Logique et statistiques du dashboard
│   │   ├── students.js        # CRUD & filtres étudiants
│   │   ├── courses.js         # Filtres & détails des cours
│   │   ├── announcements.js   # Publication & consultation des annonces
│   │   └── documents.js       # Téléchargements & bibliothèque
│   └── images/
└── README.md                  # Documentation du projet
```

---

## 💻 Instructions de Lancement Local

1. Ouvrez le dossier `flash-connect/` dans votre éditeur (ex: VS Code).
2. Lancez un serveur HTTP local (par exemple avec l'extension **Live Server** ou via Python : `python3 -m http.server 3000`).
3. Ouvrez `http://localhost:3000` ou directement `index.html` dans n'importe quel navigateur web moderne.

---
*Projet développé pour la Faculté des Lettres, Arts et Sciences Humaines de l'Université de Parakou.*
