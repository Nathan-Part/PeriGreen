# 🌱 PeriGreen

[![Symfony](https://img.shields.io/badge/Symfony-7.4-black?style=flat&logo=symfony)](https://symfony.com)
[![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=flat&logo=php)](https://php.net)

**PeriGreen** est une plateforme dédiée au prêt et à la réservation de matériel et d'équipements pour l'agriculture, le jardinage et l'aménagement péri-urbain. Ce projet a pour but de faciliter l'accès à l'outillage et d'encourager la mutualisation des ressources.

## 🏗️ Architecture du projet

Ce dépôt (monorepo) contient l'ensemble de l'application, séparée en deux parties principales :

- **`server/`** : Le backend API et/ou l'application serveur propulsée par **Symfony 7.4**, gérant la logique métier, la base de données (entités : Utilisateur, Réservation, Prêt, Équipement, Catégorie) et la sécurité (JWT).
- **`client/`** : L'interface utilisateur frontend pour les usagers (actuellement en cours de construction).

---

## 🚀 Prérequis

Pour exécuter ce projet localement, vous aurez besoin de :
- **PHP** 8.2 ou supérieur
- **Composer**
- **Symfony CLI** (fortement recommandé pour le serveur de développement local)
- Une base de données relationnelle (MySQL, MariaDB ou PostgreSQL selon la configuration)

---

## 🛠️ Installation et Démarrage (Backend)

### 1. Cloner le dépôt
```bash
git clone https://github.com/votre-organisation/perigreen.git
cd perigreen/server
```

### 2. Installer les dépendances
```bash
composer install
```

### 3. Configuration de l'environnement
Copiez le fichier d'environnement par défaut et configurez-y votre accès à la base de données :
```bash
cp .env .env.local
```
*Éditez `.env.local` pour ajuster la variable `DATABASE_URL`.*

### 4. Base de données et données de test (Fixtures)
Créer la base de données, exécuter les migrations et charger les fausses données de test :
```bash
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate -n
php bin/console doctrine:fixtures:load -n
```

### 5. Lancer le serveur de développement
```bash
symfony server:start -d
```
L'API/Application devrait maintenant être accessible via `https://127.0.0.1:8000`.

---

## 📖 Documentation

- [Guide de contribution](CONTRIBUTING.md) : Pour savoir comment participer au projet, la stratégie de nommage des branches, etc.
- [Politique de sécurité](SECURITY.md) : Pour signaler une vulnérabilité.

## 👥 Auteurs et Licence

* Projet développé dans le cadre de l'initiative PeriGreen.
* Licence : Propriétaire (sauf mention contraire).
