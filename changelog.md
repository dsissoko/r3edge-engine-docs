# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est inspiré de [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/), et ce projet adhère aux [Conventional Commits](https://www.conventionalcommits.org/fr/v1.0.0/).

## [Unreleased]

### Ajouts
- Intégration du système d'authentification OAuth2.
- Ajout d'une nouvelle fonctionnalité de recherche avancée dans le module utilisateur.
- Documentation initiale pour l'API REST.

### Modifications
- Mise à jour du thème de l'interface utilisateur pour une meilleure accessibilité.
- Refactorisation du composant de gestion des notifications pour améliorer les performances.

### Corrections
- Correction d'un bug empêchant la sauvegarde des préférences utilisateur.
- Résolution d'un problème d'affichage sur les navigateurs mobiles.

## [1.2.0] - 2024-04-10

### Ajouts
- Ajout de la fonctionnalité de téléchargement en masse des rapports.
- Support multilingue étendu avec ajout de la langue espagnole.
- Intégration de l'outil de monitoring Prometheus.

### Modifications
- Amélioration du système de cache pour réduire les temps de chargement.
- Mise à jour des dépendances de sécurité pour éviter les vulnérabilités XSS.

### Corrections
- Correction de la pagination dans le tableau de bord utilisateur.
- Résolution d'un problème de synchronisation des données entre le frontend et le backend.

## [1.1.0] - 2024-02-25

### Ajouts
- Introduction du tableau de bord analytique pour les administrateurs.
- Ajout de filtres personnalisables dans la liste des utilisateurs.
- Documentation complète sur les processus métier et les règles associées.

### Modifications
- Refonte de l'architecture logicielle pour une meilleure modularité.
- Optimisation des requêtes SQL pour améliorer les performances de la base de données.

### Corrections
- Correction d'un bug empêchant l'exportation des données au format CSV.
- Résolution d'un problème de compatibilité avec Internet Explorer 11.

## [1.0.0] - 2024-01-15

### Ajouts
- Version initiale du projet avec les fonctionnalités de base :
  - Gestion des utilisateurs (création, modification, suppression).
  - Système de rôles et permissions.
  - Interface utilisateur réactive.
  - API REST complète pour les opérations CRUD.

### Modifications
- Mise en place de l'environnement de développement avec Docker.
- Configuration initiale des outils de CI/CD avec GitHub Actions.

### Corrections
- Aucun correctif dans la version initiale.

