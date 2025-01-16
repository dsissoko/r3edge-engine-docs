---
title: Services Backend
description: Document présentant les services fonctionnels backend du projet.
last_updated: 2025-01-12
---

# Services Backend

L'architecture de r3edge repose sur plusieurs microservices bien définis, chacun ayant un rôle spécifique pour répondre aux besoins du projet.

---

## Table des matières
- [Quelques définitions](#quelques-définitions)
- [Exposition des services](#exposition-des-services)
- [Communication interservices](#communication-interservices)
- [TemplateService](#templateservice)
- [SessionManager](#sessionmanager)
- [StrategyExecutor](#strategyexecutor)
- [OrderAndPositionTracker](#orderandpositiontracker)
- [RiskManager](#riskmanager)
- [DataCollect](#datacollect)
- [MarketDataService](#marketdataservice)
- [NotificationService](#notificationservice)
- [BacktestService](#backtestservice)
- [MonitoringService](#monitoringservice)
- [Stratégies de Scaling Horizontal](#strategies-de-scaling-horizontal)

---

## Quelques définitions

Un service central est unique dans le système et non multipliable fonctionnellement, tandis qu'un service factorisable peut être répliqué par besoin fonctionnel, comme par plateforme ou stratégie.

---

## Exposition des services

Traefik, en tant qu'API Gateway, joue un rôle clé en exposant à l'externe une API unifiée pour l'ensemble des microservices de r3edge-engine. Cette API permet aux clients externes d'interagir de manière centralisée avec les différents services backend, sans avoir besoin de connaître leur architecture interne. Les avantages principaux de cette exposition incluent :

- **Unification** : Un point d'entrée unique pour toutes les requêtes externes.
- **Sécurité** : Gestion des authentifications, autorisations et certificats SSL pour protéger les échanges.
- **Flexibilité** : Possibilité de configurer des règles de routage pour diriger les requêtes vers les microservices appropriés.
- **Observabilité** : Traefik fournit des outils pour surveiller et diagnostiquer les performances des API exposées.

---

## Communication interservices

Dans l'architecture de r3edge, les communications entre les microservices backend sont gérées directement, sans passer par l'API Gateway (Traefik). Cette approche vise à optimiser les flux internes et à alléger la charge de la gateway, qui est exclusivement dédiée aux interactions avec les clients externes. Les services échangent principalement via des API REST internes, des topics Kafka, ou d'autres mécanismes asynchrones.

---

## Liste des services

### TemplateService
- **Rôle** : Service template à personnaliser pour les futurs microservices.
- **Détail** : [Voir la page dédiée](TemplateService.md)

### SessionManager
- **Rôle** : Gère les sessions de trading : création, démarrage, pause, suppression.
- **Détail** : [Voir la page dédiée](SessionManager.md)

### StrategyExecutor
- **Rôle** : Consomme les topics de session pour exécuter les stratégies définies.
- **Détail** : [Voir la page dédiée](StrategyExecutor.md)

### OrderAndPositionTracker
- **Rôle** : Suit les ordres placés et les positions associées.
- **Détail** : [Voir la page dédiée](OrderAndPositionTracker.md)

### RiskManager
- **Rôle** : Valide et dimensionne les ordres ; ajuste les positions.
- **Détail** : [Voir la page dédiée](RiskManager.md)

### DataCollect
- **Rôle** : Collecte les données de marché en temps réel depuis les plateformes.
- **Détail** : [Voir la page dédiée](DataCollect.md)

### MarketDataService
- **Rôle** : Traite et agrège les données de marché pour alimenter un cache distribué.
- **Détail** : [Voir la page dédiée](MarketDataService.md)

### NotificationService
- **Rôle** : Envoie des notifications ou alertes via différents canaux.
- **Détail** : [Voir la page dédiée](NotificationService.md)

### BacktestService
- **Rôle** : Exécute des simulations de stratégies à partir de données historiques.
- **Détail** : [Voir la page dédiée](BacktestService.md)

### MonitoringService
- **Rôle** : Supervise la santé des microservices et des flux de données.
- **Détail** : [Voir la page dédiée](MonitoringService.md)

---

## Stratégies de Scaling Horizontal

### Tableau des stratégies de scaling horizontal

| **Nom de la Stratégie**         | **Description**                                                                                 |
|---------------------------------|-----------------------------------------------------------------------------------------------|
| **Load Balancing**              | Répartit les requêtes entrantes entre plusieurs instances en temps réel, souvent pour des API ou HTTP. |
| **File de Tâches Distribuée**   | Distribue des tâches uniques en file d'attente entre plusieurs consommateurs pour un traitement asynchrone. |
| **Partitionnement des Données** | Divise les données en sous-ensembles (partitions) basés sur une clé pour optimiser leur stockage et traitement. |
| **Leader Election**             | Élit dynamiquement un leader unique parmi plusieurs instances pour exécuter des tâches critiques ou coordonner. |

### Tableau des microservices et choix des stratégies

| **Microservice (Type)**        | **Rôle**                                                                 | **Stratégie de Scaling**                                    |
|--------------------------------|--------------------------------------------------------------------------|------------------------------------------------------------|
| **SessionManager (Central)**   | Gère les sessions de trading : création, démarrage, pause, suppression.  | Load Balancing                                             |
| **StrategyExecutor (Factorisable)** | Consomme les topics de session pour exécuter les stratégies définies.    | Leader Election via les consumer groups Kafka              |
| **OrderAndPositionTracker (Central)** | Suit les ordres placés et les positions associées de façon stateless.   | File de Tâches Distribuée                                  |
| **RiskManager (Central)**      | Valide et dimensionne les ordres ; ajuste les positions.                 | File de Tâches Distribuée                                  |
| **DataCollect (Factorisable)** | Collecte les données de marché en temps réel depuis les plateformes.     | Partitionnement des Données                                |
| **MarketDataService (Central)**| Traite et agrège les données de marché pour alimenter un cache distribué. | Load Balancing                                             |
| **NotificationService (Central)** | Envoie des notifications ou alertes via différents canaux.             | Partitionnement des Messages                               |
| **BacktestService (Central)**  | Exécute des simulations de stratégies à partir de données historiques.   | File de Tâches Distribuée                                  |
| **MonitoringService (Central)** | Supervise la santé des microservices et des flux de données.             | Leader Election ou Partitionnement                         |

---

## Liens utiles
- [Retour à la Table des Matières](index.md)
- [Dépôt principal de la documentation](https://github.com/dsissoko/r3edge-engine-docs)
