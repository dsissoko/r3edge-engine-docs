---
title: Services Backend
description: Document présentant les services fonctionnels backend du projet.
last_updated: 2025-01-12
---

# Services Backend

L'architecture de r3edge repose sur plusieurs microservices bien définis, chacun ayant un rôle spécifique et des méthodes adaptées pour assurer leur scalabilité horizontale.
---

## Table des matières
- [VueDensemble](#vuedensemble)
- [SessionManager](#sessionmanager)
- [StrategyExecutor](#strategyexecutor)
- [OrderAndPositionTracker](#orderandpositiontracker)
- [RiskManager](#riskmanager)
- [DataCollect](#datacollect)
- [MarketDataService](#marketdataservice)
- [NotificationService](#notificationservice)
- [BacktestService](#backtestservice)
- [MonitoringService](#monitoringservice)

---

## VueDensemble
Un service central est unique dans le système et non multipliable fonctionnellement, tandis qu'un service factorisable peut être répliqué par besoin fonctionnel, comme par plateforme ou stratégie.
Voici un tableau résumant les microservices, leurs rôles, et les méthodes de scalabilité mises en place.

### Tableau des stratégies de scalabilité horizontale:

| **Nom de la Stratégie**         | **Description**                                                                                 |
|---------------------------------|-----------------------------------------------------------------------------------------------|
| **Load Balancing**              | Répartit les requêtes entrantes entre plusieurs instances en temps réel, souvent pour des API ou HTTP. |
| **File de Tâches Distribuée**   | Distribue des tâches uniques en file d'attente entre plusieurs consommateurs pour un traitement asynchrone. |
| **Partitionnement des Données** | Divise les données en sous-ensembles (partitions) basés sur une clé pour optimiser leur stockage et traitement. |
| **Leader Election**             | Élit dynamiquement un leader unique parmi plusieurs instances pour exécuter des tâches critiques ou coordonner. |

### Tableau des microservices r3edge

| **Microservice (Type)**        | **Rôle**                                                                 | **Scalabilité Horizontale**                                    |
|--------------------------------|--------------------------------------------------------------------------|----------------------------------------------------------------|
| **SessionManager (Central)**   | Gère les sessions de trading : création, démarrage, pause, suppression.  | Load balancing pour traiter les commandes.                    |
| **StrategyExecutor (Factorisable)** | Consomme les topics de session pour exécuter les stratégies définies.    | Leader election via les consumer groups Kafka.                |
| **OrderAndPositionTracker (Central)** | Suit les ordres placés et les positions associées de façon stateless.   | File de tâches distribuées pour traiter les ordres placés.    |
| **RiskManager (Central)**      | Valide et dimensionne les ordres ; ajuste les positions de manière stateless. | File de tâches distribuées pour valider les ordres.           |
| **DataCollect (Factorisable)** | Collecte les données de marché en temps réel depuis les plateformes.     | Partitionnement des données par plateforme ou par marché.     |
| **MarketDataService (Central)**| Traite et agrège les données de marché pour alimenter un cache distribué. | Load balancing pour gérer les requêtes client.                |
| **NotificationService (Central)** | Envoie des notifications ou alertes via différents canaux.             | Partitionnement des messages par type ou canal.               |
| **BacktestService (Central)**  | Exécute des simulations de stratégies à partir de données historiques.   | File de tâches distribuées pour répartir les backtests.       |
| **MonitoringService (Central)** | Supervise la santé des microservices et des flux de données.             | Leader election ou partitionnement selon les métriques.       |

## SessionManager
- **Fonction** : Gère les sessions de trading : création, démarrage, pause, suppression.
- **Scalabilité** : Load balancing pour traiter les commandes.

## StrategyExecutor
- **Fonction** : Consomme les topics de session pour exécuter les stratégies définies.
- **Scalabilité** : Leader election via les consumer groups Kafka.

## OrderAndPositionTracker
- **Fonction** : Suit les ordres placés et les positions associées de façon stateless.
- **Scalabilité** : File de tâches distribuées pour traiter les ordres placés.

## RiskManager
- **Fonction** : Valide et dimensionne les ordres ; ajuste les positions de manière stateless.
- **Scalabilité** : File de tâches distribuées pour valider les ordres.

## DataCollect
- **Fonction** : Collecte les données de marché en temps réel depuis les plateformes.
- **Scalabilité** : Partitionnement des données par plateforme ou par marché.

## MarketDataService
- **Fonction** : Traite et agrège les données de marché pour alimenter un cache distribué.
- **Scalabilité** : Load balancing pour gérer les requêtes client.

## NotificationService
- **Fonction** : Envoie des notifications ou alertes via différents canaux.
- **Scalabilité** : Partitionnement des messages par type ou canal.

## BacktestService
- **Fonction** : Exécute des simulations de stratégies à partir de données historiques.
- **Scalabilité** : File de tâches distribuées pour répartir les backtests.

## MonitoringService
- **Fonction** : Supervise la santé des microservices et des flux de données.
- **Scalabilité** : Leader election ou partitionnement selon les métriques.

---

<!-- Pied de page -->
## Liens utiles
- [Retour à la Table des Matières](index.md)
- [Dépôt principal de la documentation](https://github.com/dsissoko/r3edge-engine-docs)
