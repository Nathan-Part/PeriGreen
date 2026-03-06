# 🤝 Guide de contribution - PeriGreen

Merci de l'intérêt que vous portez au projet **PeriGreen** ! Ce document décrit les règles et bonnes pratiques pour contribuer au code de manière ordonnée et fluide.

---

## 🌿 Stratégie de Branches (Git Flow)

Afin de garder un historique propre, nous appliquons les règles suivantes :
- **`main`** : Branche principale contenant le code en production (stable). **Aucun push direct autorisé.**
- **`dev`** : Branche d'intégration principale. C'est à partir de cette branche que vous devez créer vos nouvelles branches. **Aucun push direct autorisé.**

### Nommage des branches
Créez une branche spécifique pour chaque tâche depuis `dev` en utilisant la convention suivante :
- `feature/<nom-de-la-fonctionnalite>` : Pour l'ajout d'une nouvelle fonctionnalité (ex: `feature/reservation-materiel`).
- `fix/<nom-du-bug>` : Pour la résolution d'un bug (ex: `fix/erreur-connexion`).
- `docs/<nom-du-document>` : Pour l'ajout ou la mise à jour de la documentation.

---

## 🔄 Flux de travail (Pull Request Flow)

1. Mettez à jour votre branche `dev` locale :
   ```bash
   git checkout dev
   git pull origin dev
   ```
2. Créez votre branche de travail :
   ```bash
   git checkout -b feature/ma-super-fonctionnalite
   ```
3. Effectuez vos modifications, ajoutez des tests si nécessaire, et assurez-vous que le code passe les vérifications (ex: PHPStan, PHPUnit).
4. Commitez vos changements avec un message explicite (voir 'Convention des commits' ci-dessous).
5. Poussez votre branche :
   ```bash
   git push origin feature/ma-super-fonctionnalite
   ```
6. Ouvrez une **Pull Request (PR)** sur GitHub (ou votre plateforme Git) **vers la branche `dev`**.
7. Attendez l'approbation d'au moins un autre membre de l'équipe (Review) avant de fusionner (Merge).

---

## 📝 Convention des Commits

Gardez vos commits petits et cohérents. Utilisez les préfixes suivants pour clarifier le but de chaque commit :
- `feat:` : Ajout d'une nouvelle fonctionnalité
- `fix:` : Correction d'un bug
- `docs:` : Modification de la documentation
- `refactor:` : Refactorisation du code sans ajout de fonctionnalité ni correction de bug
- `chore:` : Mise à jour de dépendances, configuration, sans impact métier

*Exemple : `feat: ajout de l'entité Equipment et ses relations`*

---

## 💻 Standards de Code (Symfony / PHP)

- Suivez les standards [PSR-12](https://www.php-fig.org/psr/psr-12/) pour PHP.
- Utilisez l'injection de dépendances (DI) via le conteneur Symfony.
- Typage fort exigé : déclarez le type de retour et le type des arguments dans vos méthodes, y compris `strict_types=1` si possible.
- Pensez à documenter (PHPDoc) les méthodes complexes.

Merci pour votre aide dans l'amélioration de PeriGreen ! 🌱
