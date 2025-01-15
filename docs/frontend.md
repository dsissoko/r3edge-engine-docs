---
title: Frontend
description: Document décrivant la maquette existante et les outils cibles pour le développement frontend.
last_updated: 2025-01-04
---

# Frontend

Ce document présente la maquette existante et les outils prévus pour le développement frontend du projet r3edge-engine.

---

## Table des matières
- [Maquette HTML](#maquette-html)
- [Outils Cibles](#outils-cibles)

## Maquette HTML

La maquette HTML de r3edge-engine, accessible à l'adresse suivante, présente une interface utilisateur structurée pour le trading algorithmique : [Maquette HTML](https://dsissoko.github.io/r3edge-engine-docs/maquette/latest/index.html).

Elle se compose des éléments principaux suivants :

- **Menu latéral rétractable** : Permet la navigation entre les différentes sections, notamment le tableau de bord, le ciblage des marchés, la gestion des sessions, la présentation des stratégies et l'écran social.
- **En-tête à trois colonnes** : Affiche des alertes de marché en temps réel, telles que les variations du Bitcoin, du Nasdaq et du pétrole.
- **Section principale** : Présente le contenu correspondant à la sélection effectuée dans le menu, avec une page d'accueil indiquant "Bienvenue sur le tableau de bord" et invitant l'utilisateur à choisir une option dans le menu pour afficher le contenu souhaité.

Cette structure offre une navigation intuitive et une présentation claire des informations essentielles pour les utilisateurs de la plateforme.

## Outils Cibles
Il faut faire un choix parmi les outils suivants:

| Solution                         | API REST | WebSockets          | Kafka (intermédiaire) | Avantages clés                                                                                     | Inconvénients                                                                                           |
|----------------------------------|----------|---------------------|--------------------|---------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|
| AppSheet                        | Oui      | Non                 | Backend requis    | Intégration native avec Cloud SQL, Google Workspace. Automations puissantes et faciles à configurer. | Pas de support WebSockets ou Kafka natif. Nécessite une intégration intermédiaire pour le temps réel.        |
| Power Platform Model-Driven Apps| Oui      | Non                 | Backend requis (Azure Event Hubs) | Très bien intégré avec l’écosystème Microsoft (Azure, Office 365). Prise en charge REST étendue. | Complexité avec Kafka et absence de support direct pour les flux en temps réel.                        |
| Appsmith                        | Oui      | Oui (via JS)        | Backend requis    | Open-source, flexible. Prise en charge des WebSockets avec du JavaScript personnalisé.         | Nécessite un peu de configuration manuelle pour WebSockets et Kafka.                                   |
| Retool                          | Oui      | Oui                 | Backend requis    | Interface intuitive. Gestion des WebSockets et APIs REST. Facile à déployer pour des dashboards riches. | Pas de support Kafka direct, backend intermédiaire requis.                                              |
| Bubble                          | Oui      | Oui (via plugin)    | Backend requis    | Création d’interfaces riches et workflows avancés. Supporte bien les APIs REST.                    | Plugins nécessaires pour les WebSockets. Pas de support natif Kafka.                                    |
| Backendless                     | Oui      | Oui (natif)         | Backend requis    | Support intégré pour WebSockets. Gestion des APIs REST et base de données backend.                | Plus orienté backend, nécessite du travail pour les interfaces frontend complexes.                     |
| Noodle                          | Oui      | Oui                 | Non (support direct) | Compatible Kafka natif, gestion des flux en temps réel sans intermédiaire. API REST supportée.          | Solution encore moins répandue, communauté plus petite que d'autres grandes plateformes nocode.         |

---

## Liens utiles
- [Maquette HTML](https://dsissoko.github.io/r3edge-engine-docs/maquette/latest/index.html)
- [Dépôt principal de la documentation](https://github.com/dsissoko/r3edge-engine-docs)
