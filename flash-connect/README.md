# FLASH CONNECT — MVP de démonstration

Portail web pour la FLASH de l'Université de Parakou : comptes en attente de validation, espace étudiant, actes académiques privés, demandes de documents, cours, emploi du temps, annonces et administration.

**Statut :** base de code de départ. Ce n'est pas un service officiel de l'Université de Parakou et ce projet n'est ni hébergé ni connecté à son système académique. Toutes les données de démonstration sont fictives.

## Prérequis
- Node.js 20.9 ou plus récent
- Un projet Supabase de test
- Git (facultatif)

## Installation locale

1. Décompresse le projet puis ouvre le dossier `flash-connect` dans VS Code.
2. Dans un terminal :
   ```bash
   npm install
   ```
3. Dans Supabase, crée un projet de test et ouvre **SQL Editor**.
4. Copie le contenu de `supabase/schema.sql` et exécute-le sur le projet vide. Ne l'exécute pas sur une base qui contient déjà des données importantes.
5. Dans **Project Settings → API**, copie l'URL du projet et la clé publique/publishable (ou anon selon l'interface).
6. Duplique `.env.example` en `.env.local`, puis remplis les variables :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://TON-PROJET.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=TA_CLE_PUBLIQUE
   ```
   Ne mets JAMAIS une `service_role` ou une clé secrète dans `NEXT_PUBLIC_*`.
7. Lance :
   ```bash
   npm run dev
   ```
8. Ouvre `http://localhost:3000`.

## Créer le premier administrateur

1. Inscris-toi via l'interface avec une adresse de test que tu contrôles.
2. Confirme l'e-mail si la confirmation est activée.
3. Dans Supabase **Authentication → Users**, récupère l'UUID du compte.
4. Dans SQL Editor, exécute une commande en remplaçant l'UUID par celui du compte que tu as créé et vérifié :
   ```sql
   update public.profiles
   set role = 'admin', account_status = 'active'
   where id = 'REMPLACER-PAR-UUID-DU-COMPTE';
   ```
5. Déconnecte-toi puis reconnecte-toi. Le menu Administration apparaîtra.

Ne donne jamais le rôle admin à un compte que tu n'as pas personnellement vérifié. Cette opération initiale doit être faite par le propriétaire du projet Supabase, pas par un étudiant.

## Parcours de démonstration

- Créer un compte étudiant : le profil est automatiquement créé avec le rôle `student` et le statut `pending`.
- Un agent habilité ou un admin peut examiner les comptes en attente et les activer via la fonction SQL `review_profile`.
- Un compte activé peut consulter les annonces, les cours, l'emploi du temps et ses documents.
- Les demandes d'actes sont stockées dans `document_requests` et peuvent être traitées par un membre du personnel habilité.
- Les actes sont stockés dans le bucket privé `academic-documents`, jamais dans un bucket public.

## Limites connues de cette première version

- La validation d'identité reste une procédure humaine : un matricule fourni à l'inscription ne prouve pas à lui seul l'identité de l'étudiant.
- La page de dépôt d'acte dans l'interface d'administration est une base de travail ; la sélection du bénéficiaire doit être complétée par un composant qui charge les étudiants autorisés. Avant une utilisation réelle, ajoute aussi une confirmation de la décision d'émission et une piste d'audit détaillée.
- Les changements de statut des demandes sont prévus dans le portail mais doivent être complétés par des règles métier, par exemple empêcher qu'une demande soit marquée `approved` tant qu'aucun acte n'a été émis.
- L'importation automatique depuis le système officiel de l'université n'est pas implémentée : elle exige une autorisation écrite, une documentation d'API ou un mécanisme officiel d'échange de données.
- L'envoi d'e-mails, les pièces jointes de demande, la génération de PDF, les signatures électroniques et la vérification publique d'un acte ne sont pas implémentés dans ce MVP.
- Les annonces et cours de démonstration de l'interface sont des exemples de repli lorsque la base ne contient pas de données.

## Contrôles de sécurité à réaliser avant toute vraie donnée

1. Vérifier toutes les politiques RLS avec plusieurs comptes de test (étudiant A, étudiant B, personnel, approbateur, admin).
2. Confirmer qu'un étudiant ne peut ni consulter les demandes, ni télécharger les actes d'un autre étudiant en changeant un identifiant.
3. Ajouter une validation officielle du matricule/identité, sans faire confiance aux champs envoyés par le navigateur.
4. Revoir les permissions de rôle avec les services de la faculté ; les rôles élevés doivent être attribués par un administrateur autorisé uniquement.
5. Ajouter un journal d'audit fiable pour les dépôts, téléchargements sensibles, validations, refus et révocations.
6. Tester les sauvegardes, restaurations, limites de taille, types MIME, contrôle de contenu des PDF et procédure de révocation.
7. Configurer la confirmation d'e-mail, la protection contre les tentatives de connexion et le MFA pour les comptes administratifs.
8. Vérifier les exigences béninoises en matière de protection des données, durée de conservation, hébergement et droits des personnes.
9. Faire une revue de sécurité indépendante avant mise en production.

## Déploiement

Le projet peut être déployé sur un hébergeur compatible Next.js après configuration des variables d'environnement. Utilise uniquement la clé publique Supabase côté navigateur : les politiques RLS sont essentielles. N'utilise pas GitHub Pages seul pour héberger ce système, car l'application nécessite une partie serveur et une base de données.
