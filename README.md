# Mini Site Web - TP Maintenance Applicative

Ce projet est un mini site web développé en **Node.js/Express avec TypeScript** et **MySQL** dans le cadre du TP de Maintenance Applicative (R6.A.06 - BUT 3 Informatique).

## Description

Application web de gestion de produits permettant de :
- Consulter une page d'accueil
- Se connecter avec un système d'authentification
- Gérer des produits (CRUD : Create, Read, Update, Delete)
- Calculer la valeur totale de l'inventaire

## Technologies utilisées

- **Backend** : Node.js, Express.js, TypeScript
- **Base de données** : MySQL
- **Moteur de templates** : EJS
- **Sessions** : express-session

## Structure du projet

```
siteweb-bug/
├── src/                       # Code source TypeScript
│   ├── app.ts                 # Point d'entrée de l'application
│   ├── config/
│   │   └── database.ts        # Configuration de la connexion MySQL
│   ├── routes/
│   │   ├── index.ts           # Routes de la page d'accueil
│   │   ├── auth.ts            # Routes d'authentification
│   │   └── products.ts        # Routes CRUD des produits
│   └── types/
│       └── index.ts           # Définitions des types TypeScript
├── views/                     # Templates EJS
│   ├── index.ejs              # Page d'accueil
│   ├── login.ejs              # Page de connexion
│   ├── products.ejs           # Liste des produits
│   ├── product-form.ejs       # Formulaire ajout/modification
│   └── total.ejs              # Page du calcul total
├── public/
│   └── css/
│       └── style.css          # Styles CSS
├── database/
│   └── init.sql               # Script d'initialisation de la BDD
├── package.json               # Dépendances et scripts npm
├── tsconfig.json              # Configuration TypeScript
└── README.md                  # Documentation
```

## Installation

### Prérequis

- Node.js (v14 ou supérieur)
- MySQL (v5.7 ou supérieur)
- npm ou yarn

### Étapes d'installation

1. **Cloner le projet**
   ```bash
   git clone <url-du-repo>
   cd siteweb-bug
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer la base de données**

   Créer la base de données et les tables en exécutant le script SQL :
   ```bash
   mysql -u root -p < database/init.sql
   ```

4. **Configurer la connexion MySQL**

   Modifier les paramètres dans `src/config/database.ts` si nécessaire :
   ```typescript
   host: 'localhost',
   user: 'root',
   password: 'root',
   database: 'mini_site'
   ```

5. **Compiler et démarrer l'application**

   En mode production :
   ```bash
   npm run build
   npm start
   ```

   Ou en mode développement avec rechargement automatique :
   ```bash
   npm run dev
   ```

6. **Accéder au site**

   Ouvrir un navigateur et aller sur : `http://localhost:3000`

## Utilisation

### Comptes de test

| Utilisateur | Mot de passe | Rôle  |
|-------------|--------------|-------|
| admin       | admin123     | admin |
| user        | user123      | user  |

### Fonctionnalités

- **Page d'accueil** (`/`) : Présentation du site
- **Connexion** (`/auth/login`) : Formulaire de connexion
- **Déconnexion** (`/auth/logout`) : Déconnexion de l'utilisateur
- **Liste des produits** (`/products`) : Affichage de tous les produits (authentification requise)
- **Ajouter un produit** (`/products/add`) : Formulaire d'ajout
- **Modifier un produit** (`/products/edit/:id`) : Formulaire de modification
- **Supprimer un produit** (`/products/delete/:id`) : Suppression d'un produit
- **Calcul du total** (`/products/total`) : Calcule la valeur totale de l'inventaire

## Notes importantes

> **ATTENTION** : Ce projet contient **volontairement** des failles et des bugs pour les besoins du TP.

### Bug volontaire

Le calcul du total de l'inventaire est incorrect. Le bug se trouve dans `src/routes/products.ts` dans la fonction de calcul du total.

### Failles de sécurité volontaires

1. **Injection SQL** : La requête de connexion utilise la concaténation de chaînes au lieu de requêtes préparées (`src/routes/auth.ts`)
2. **Mots de passe en clair** : Les mots de passe sont stockés sans hashage dans la base de données
3. **Secret de session faible** : Le secret de session est codé en dur et trop simple (`src/app.ts`)
4. **Credentials en dur** : Les identifiants de base de données sont dans le code source (`src/config/database.ts`)
5. **XSS potentiel** : Certaines valeurs sont affichées sans échappement (`views/products.ejs`)

**Ne pas utiliser ce code en production !**

## Scripts npm

| Commande | Description |
|----------|-------------|
| `npm run build` | Compile le TypeScript en JavaScript |
| `npm start` | Démarre le serveur en production |
| `npm run dev` | Démarre le serveur en mode développement |

## Auteurs

- Projet réalisé dans le cadre du cours R6.A.06 - Maintenance Applicative
- IUT du Littoral Côte d'Opale - BUT 3 Informatique
- Année 2025-2026
