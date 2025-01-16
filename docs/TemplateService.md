---
title: r3edge-template
description: Détails sur le microservice r3edge-template utilisé dans r3edge-engine.
last_updated: 2025-01-16
---

# r3edge-template

## Introduction

Ce document présente le microservice **r3edge-template**, son rôle, son fonctionnement, et ses interactions avec les autres composants de l'architecture r3edge-engine.

---

## Table des matières

- [Rôle du service](#role-du-service)
- [Fonctionnalités clés](#fonctionnalites-cles)
- [Données manipulées](#donnees-manipulees)
- [Observabilité et Monitoring](#observabilite-et-monitoring)
- [Stratégie de Scalabilité](#strategie-de-scalabilite)
- [Ressources complémentaires](#ressources-complementaires)
- [Accès au Code](#acces-au-code)
- [Liens de navigation](#liens-de-navigation)

---

## Rôle du service

**r3edge-template** a pour rôle principal de servir de point de départ pour tous les microservices de l'architecture **r3edge**.\
Il intègre les bonnes pratiques et les fonctionnalités communes nécessaires pour développer rapidement et efficacement de nouveaux microservices.

---

## Fonctionnalités clés

### Fonctionnalités principales 

- Gestion des configurations dynamiques via **Spring Cloud Config** et **Spring Cloud Bus**.
- Publication et consommation de messages **Kafka** via **Spring Cloud Stream**.
- Support des toggles dynamiques pour activer ou désactiver des fonctionnalités en temps réel.
- Génération automatique de documentation **OpenAPI**.
- Sécurisation des endpoints avec **Auth0**.
- Utilisation d’un cache distribué **Hazelcast** pour accélérer les traitements.
- Connexion à une base de données **PostgreSQL** pour le stockage persistant.
- Génération et publication automatique d’images Docker via **JIB**.
- Intégration de **Resilience4j** pour la résilience applicative :
  - **Retry** : Gestion des tentatives en cas d’échec transitoire.
  - **Circuit Breaker** : Protection contre les services défaillants.
  - **Rate Limiter** : Limitation du nombre de requêtes pour protéger les ressources.
  - **Bulkhead** : Isolation pour limiter l’impact des surcharges.
  - **Time Limiter** : Gestion des délais d’attente pour éviter les blocages.

---

## Données manipulées

Ce tableau décrit les données que le service manipule, y compris leurs sources, destinations, et contextes d'utilisation.

| **Nom de la donnée**      | **Source**      | **Destination** | **Commentaires**                                  |
| ------------------------- | --------------- | --------------- | ------------------------------------------------- |
| Messages Kafka            | **Kafka Topic**     | **Kafka Topic**     | Gestion des événements interservices.             |
| Configurations dynamiques | **Config Server**   | Microservice    | Chargement et mise à jour via **Cloud Bus**.          |
| Données cache             | Base de données | **Hazelcast**       | Mise en cache des données pour accélérer l’accès. |
| Authentification          | **Auth0**           | Microservice    | Validation des tokens JWT.                        |

---

## Observabilité et Monitoring

TODO

---

## Stratégie de Scalabilité

La scalabilité du microservice **r3edge-template** repose sur plusieurs approches adaptées à l'environnement distribué :

1. **Scalabilité horizontale** :
   - Prise en charge par **Kubernetes** pour augmenter le nombre de réplicas du microservice en fonction de la charge (HPA basé sur CPU/mémoire ou métriques custom via **Prometheus**).
2. **Gestion de la charge** :
   - Utilisation de **Kafka** pour répartir efficacement la charge entre plusieurs instances via le partitionnement.
3. **Cache distribué** :
   - **Hazelcast** permet de partager les données entre les instances sans dépendre exclusivement de la base de données.
4. **Stateless** :
   - Le microservice est conçu pour être sans état, garantissant un redémarrage et un scaling rapide sans complexité supplémentaire.
5. **Décentralisation des dépendances** :
   - Les configurations dynamiques et les communications par message minimisent les dépendances entre services, améliorant la résilience globale.

---

## Ressources complémentaires

Voici une liste d'articles, de blogs ou de documents de référence utiles pour approfondir les concepts utilisés dans ce service :

- [Lien vers un article ou un document pertinent 1](#)
- [Lien vers un article ou un document pertinent 2](#)
- [Lien vers un article ou un document pertinent 3](#)

---

## Accès au Code

Le code source de ce microservice est disponible dans le dépôt suivant :

- **GitHub** : [r3edge-template Repository](https://github.com/r3edge/r3edge-template)

---

## Liens de navigation

- [Retour à la page des services backend](services-backend.md)
- [Page d'accueil de la documentation](index.md)
- [Dépôt principal de la documentation](https://github.com/dsissoko/r3edge-engine-docs)

---
