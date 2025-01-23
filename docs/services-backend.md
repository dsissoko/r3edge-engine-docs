---
title: Services Backend
description: Document présentant les services fonctionnels backend du projet.
last_updated: 2025-01-17
---

# Services Backend

L'architecture de r3edge repose sur plusieurs microservices bien définis, chacun ayant un rôle spécifique pour répondre aux besoins du projet.

---

## Table des matières
- [Quelques définitions](#quelques-définitions)
- [Exposition des services](#exposition-des-services)
- [Communication interservices](#communication-interservices)
- [Liste des services](#liste-des-services)
- [Stratégies de Scaling Horizontal](#stratégies-de-scaling-horizontal)
- [Partitionnement des Topics Kafka](#partitionnement-des-topics-kafka)
- [Filtrage et Émission des Topics](#filtrage-et-emission-des-topics)

---

## Quelques définitions

Un service central est unique dans le système et non multipliable fonctionnellement, tandis qu'un service factorisable peut être répliqué par besoin fonctionnel, comme par plateforme ou stratégie.

---

## Exposition des services

Traefik, en tant qu'API Gateway, joue un rôle clé en exposant à l'externe une API unifiée pour l'ensemble des microservices de r3edge-engine. Cette API permet aux clients externes d'interagir de manière centralisée avec les différents services backend, sans avoir besoin de connaître leur architecture interne.

---

## Communication interservices

Dans l'architecture de r3edge, les communications entre les microservices backend sont gérées directement, sans passer par l'API Gateway (Traefik). Les services échangent principalement via des API REST internes, des topics Kafka, ou d'autres mécanismes asynchrones.

### Topics Kafka

Les topics Kafka sont le principal mécanisme d'échange asynchrone entre les microservices. Chaque topic est partitionné et consommé via des consumer groups, garantissant l'isolation et la scalabilité des services.

Liste des principaux topics et leur partitionnement :

| **Topic**          | **Clé de Partition**  | **Données Transportées**         | **Consommateurs**       |
|---------------------|-----------------------|------------------------------------|--------------------------|
| `marketdata`        | Aucun (broadcast)     | OHLCV brut                        | AnyService               |
| `strategiesdata`    | `strategyId`         | OHLCV filtré pour les stratégies  | StrategyExecutor         |
| `sessionsrequest`   | `sessionId`          | Demandes de suivi de position     | PositionTracker          |
| `signals`           | Aucun (broadcast)    | Signaux non filtrés               | AnyService               |
| `raworders`         | `orderId`            | Ordres bruts sans quantité        | MoneyManager             |
| `orders`            | `orderId`            | Ordres complets prêts à exécuter  | OrderManager             |

### Diagramme des interactions

Le schéma ci-dessous illustre les interactions principales entre les services backend, les utilisateurs et les topics Kafka :

```mermaid
graph TB
  User["👤 Utilisateur"] -->|🌐 start, stop, suspend, recover | SM["⚙️ SessionManager"]
  DC["⚙️ DataCollect"] -->|💬 marketdata | SE["⚙️ StrategyExecutor"]
  DC -->|💬 strategiesdata | SE
  DC -->|💬 sessionsrequest | PT["⚙️ PositionTracker"]
  SE -->|💬 sessionsrequest | PT
  SE -->|💬 signals | NS["⚙️ NotificationService"]
  PT -->|💬 raworders | MM["⚙️ MoneyManager"]
  MM -->|💬 orders | OM["⚙️ OrderManager"]

```

### Légende
- 🌐 **Requêtes HTTP** : Interactions entre l’utilisateur et les services.
- ⚙️ **Services** : Représentation des microservices de l’architecture.
- 💬 **Topics Kafka** : Canaux d’échange de messages asynchrones entre services.

---

## Liste des services

### DataCollect
- **Rôle** : Collecte des données de marché en temps réel depuis des APIs externes.
- **Interactions** :
  - **Entrées** : APIs des plateformes de trading.
  - **Sorties** :
    - `marketdata` : Données OHLCV brutes.
    - `strategiesdata` : Données filtrées pour les stratégies actives.
    - `sessionsrequest` : Demandes de suivi de position.
- **Comment le service peut scaler ?** :
  - Scaling horizontal avec Kubernetes : chaque instance collecte un sous-ensemble défini de marchés, actifs et timeframes.
  - Réattribution automatique des tâches via une table centralisée qui distribue dynamiquement les workloads.
  - **Émetteur lié** : DataCollect filtre les OHLCV pour `strategiesdata` à partir des informations de filtre publiées par les instances actives de StrategyExecutor.
- **Détail** : [Voir la page dédiée](DataCollect.md)

---

### SessionManager
- **Rôle** : Gestion des sessions de trading (création, démarrage, mise en pause, suppression).
- **Interactions** :
  - **Entrées** : Commandes utilisateur (start, stop, pause).
  - **Sorties** : Mise à jour des sessions dans la base de données.
- **Comment le service peut scaler ?** :
  - Load balancing entre instances via Kubernetes et un service REST exposé.
  - **Émetteur lié** : Les modifications des sessions sont propagées via la base de données, et les services consommateurs interrogent ces informations en temps réel.
- **Détail** : [Voir la page dédiée](SessionManager.md)

---

### StrategyExecutor
- **Rôle** : Exécution des stratégies de trading définies.
- **Interactions** :
  - **Entrées** :
    - `strategiesdata` : Données de marché pertinentes.
    - `signals` : Signaux non filtrés.
  - **Sorties** :
    - `sessionsrequest` : Demandes de suivi de position.
    - `signals` : Signaux filtrés pour les sessions actives.
- **Comment le service peut scaler ?** :
  - Partitionnement Kafka par `strategyId` pour distribuer la charge entre instances.
  - Scaling horizontal des instances via Kubernetes.
  - **Émetteur lié** : StrategyExecutor envoie des signaux dans `sessionsrequest` lorsqu'ils correspondent à des sessions actives spécifiques.
- **Détail** : [Voir la page dédiée](StrategyExecutor.md)

---

### PositionTracker
- **Rôle** : Suivi des positions ouvertes et ajustement des ordres.
- **Interactions** :
  - **Entrées** :
    - `sessionsrequest` : Demandes de suivi de position.
  - **Sorties** :
    - `raworders` : Ordres à enrichir (quantités manquantes).
- **Comment le service peut scaler ?** :
  - Partitionnement Kafka par `sessionId`.
  - Scaling horizontal via Kubernetes pour traiter plus de sessions en parallèle.
  - **Émetteur lié** : Les demandes sur `sessionsrequest` sont poussées par DataCollect et StrategyExecutor en fonction des sessions actives.
- **Détail** : [Voir la page dédiée](PositionTracker.md)

---

### MoneyManager
- **Rôle** : Enrichissement des ordres avec les quantités et ajustements liés aux risques.
- **Interactions** :
  - **Entrées** :
    - `raworders` : Ordres bruts sans quantités.
  - **Sorties** :
    - `orders` : Ordres complets prêts à être exécutés.
- **Comment le service peut scaler ?** :
  - Partitionnement Kafka par `orderId`.
  - Scaling horizontal via Kubernetes.
  - **Émetteur lié** : Les ordres bruts sur `raworders` sont produits par PositionTracker après calcul des ajustements initiaux.
- **Détail** : [Voir la page dédiée](MoneyManager.md)

---

### OrderManager
- **Rôle** : Gestion de l'exécution des ordres auprès des plateformes de trading.
- **Interactions** :
  - **Entrées** :
    - `orders` : Ordres complets à exécuter.
  - **Sorties** : Aucune.
- **Comment le service peut scaler ?** :
  - Scaling horizontal via Kubernetes HPA en fonction de la charge des ordres à traiter.
  - **Émetteur lié** : Les ordres complets sont alimentés sur `orders` par MoneyManager.
- **Détail** : [Voir la page dédiée](OrderManager.md)

---

### NotificationService
- **Rôle** : Envoi des notifications ou alertes via différents canaux.
- **Interactions** :
  - **Entrées** : Ordres, alertes système.
  - **Sorties** : Emails, SMS, notifications UI, etc.
- **Comment le service peut scaler ?** :
  - Load balancing horizontal pour répartir la charge entre instances.
  - **Émetteur lié** : Notifications déclenchées par les actions d'autres services, notamment OrderManager.
- **Détail** : [Voir la page dédiée](NotificationService.md)

---
## Début et fin d'une séquence de trading

Ce diagramme illustre le **cycle de vie d'une séquence de trading** pour une stratégie donnée, depuis son activation jusqu'à sa désactivation. Il met en évidence les interactions entre les différents composants du système, en soulignant :

1. **L'activation d'une stratégie** : Initiée par un trader via l'interface utilisateur (UI) ou une API, elle implique la mise à jour de la **table des stratégies actives**, l'envoi d'une commande d'activation (`start`) via Kafka, et l'inscription de la stratégie à un consumer group pour consommer les données OHLCV.

2. **La consommation des données OHLCV** : Les instances de la stratégie consomment les messages d'un **topic Kafka dédié** pour exécuter leur logique métier. Si des données supplémentaires sont nécessaires (comme des indicateurs ou des historiques), elles sont récupérées auprès de **MarketDataService**.

3. **La désactivation d'une stratégie** : Lorsqu'un trader met fin à la séquence de trading, une commande `stop` est envoyée. Cela entraîne la mise à jour de la table des stratégies actives, l'arrêt de la consommation des données par les instances, et la vérification des topics inutilisés par DataCollect.

Ce diagramme met également en lumière le rôle clé de Kafka dans la diffusion des commandes et des données, ainsi que la **table des stratégies actives**, qui sert de source de vérité pour coordonner l'ensemble des interactions.

```mermaid
sequenceDiagram
    participant Trader as Trader 👤
    participant UI as UI 🌐
    participant SessionManager as SessionManager ⚙️
    participant DataBase as DataBase 🛢️
    participant Kafka as Kafka 🔀
    participant DataCollect as DataCollect ⚙️
    participant Strategy1 as Strategy1 ⚙️
    participant MarketDataService as MarketDataService ⚙️

    Trader ->> UI: Start Strategy1-kucoin-BTCUSD-1H
    UI ->> SessionManager: Activation request
    SessionManager ->> DataBase: Update active strategies table (ON)
    SessionManager ->> Kafka: Publish "start" |💬 W topic `strategyCommand`|
    Kafka ->> Strategy1: Deliver "start" |💬 R topic `strategyCommand`|
    Strategy1 ->> Kafka: Join consumer group |💬 R topic `kucoin-BTCUSD-1H`|
    DataCollect ->> Kafka: Publish OHLCV |💬 W topic `kucoin-BTCUSD-1H`|
    Kafka ->> Strategy1: Deliver OHLCV |💬 R topic `kucoin-BTCUSD-1H`|
    Strategy1 ->> MarketDataService: Fetch additional data
    MarketDataService -->> Strategy1: Return data
    Trader ->> UI: Stop Strategy1-kucoin-BTCUSD-1H
    UI ->> SessionManager: Stop request
    SessionManager ->> DataBase: Update active strategies table (OFF)
    SessionManager ->> Kafka: Publish "stop" |💬 W topic `strategyCommand`|
    Kafka ->> Strategy1: Deliver "stop" |💬 R topic `strategyCommand`|
    Strategy1 ->> Kafka: Leave consumer group |💬 R topic `kucoin-BTCUSD-1H`|
    DataCollect ->> DataBase: Check active strategies
    DataCollect ->> Kafka: Remove unused topic (if applicable) |💬 W topic `kucoin-BTCUSD-1H`|
```

### Légende

🌐 **Requêtes HTTP** : Interactions entre l’utilisateur et les services via des API REST ou interfaces utilisateur.

⚙️ **Services** : Représentation des microservices de l’architecture, responsables des traitements spécifiques.

💬 **Topics Kafka** : Canaux d’échange de messages asynchrones entre services pour la gestion des données et commandes :
- **W topic** : Écriture dans un topic Kafka (Write).
- **R topic** : Lecture depuis un topic Kafka (Read).

🔀 **Kafka** : Middleware responsable de la distribution des messages entre producteurs et consommateurs.

🛢️ **Base de données** : Stockage des états persistants, comme la table des stratégies actives.

👤 **Utilisateur** : Le trader initiant les séquences de trading via l’interface utilisateur ou des appels API.

## coeur d'une séquence de trading

```mermaid
sequenceDiagram
    participant SchedulerService as SchedulerService ⚙️
    participant DataCollect as DataCollect ⚙️
    participant Strategy1 as Strategy1 ⚙️
    participant Kafka as Kafka 🔀
    participant PositionTracker as PositionTracker ⚙️
    participant Database as Database 🛢️
    participant MarketDataService as MarketDataService ⚙️
    participant MoneyManager as MoneyManager ⚙️
    participant OrderManager as OrderManager ⚙️

    SchedulerService ->> Kafka: Publish "tracking-tick" |W topic `sessionRequest`|
    DataCollect ->> Kafka: Publish OHLCV |W topic `ohlcv-kucoin-BTCUSD-1H`|
    DataCollect ->> Kafka: Publish activation message |W topic `strategyCommand`|
    Strategy1 ->> Kafka: Consume activation message |R topic `strategyCommand`|
    Strategy1 ->> Kafka: Consume OHLCV |R topic `ohlcv-kucoin-BTCUSD-1H`|
    Strategy1 ->> MarketDataService: Fetch additional data (if needed)
    MarketDataService -->> Strategy1: Return data
    alt Strategy active
        Strategy1 ->> Kafka: Publish signal |W topic `signal`|
        Strategy1 ->> Database: Check active sessions
        Database -->> Strategy1: Return active sessions
        opt If active sessions exist
            Strategy1 ->> Kafka: Publish signal |W topic `sessionRequest`|
        end
    end

    PositionTracker ->> Kafka: Consume signal |R topic `sessionRequest`|
    PositionTracker ->> Database: Query active sessions and account info
    Database -->> PositionTracker: Return sessions and accounts
    PositionTracker ->> MoneyManager: Request risk assessment and order valuation
    MoneyManager -->> PositionTracker: Return valued order

    PositionTracker ->> Kafka: Publish valued order |W topic `orders`|
    OrderManager ->> Kafka: Consume order |R topic `orders`|
    OrderManager ->> Platform: Place order on trading platform

    SchedulerService ->> Kafka: Publish "tracking-tick" |W topic `sessionRequest`|
    PositionTracker ->> Database: Query open positions for tracking
    Database -->> PositionTracker: Return positions
    PositionTracker ->> Kafka: Publish tracking results |W topic `positions`|
```

## Stratégies de Scaling Horizontal

### Scaling des services via Kafka
- Les services utilisent des consumer groups pour scaler horizontalement sans conflit.
- Chaque topic est partitionné en fonction des clés pertinentes (à définir par service).

Exemple :
- **DataCollect** : Scaling horizontal basé sur une table centralisée des workloads.
- **StrategyExecutor** : Partitionnement par `strategyId`.
- **SessionManager** : Load Balancing pour traiter les requêtes REST simultanées.
- **PositionTracker** : Partitionnement par `sessionId`.
- **MoneyManager** et **OrderManager** : Partitionnement par `orderId`.

---

## Partitionnement des Topics Kafka

Le tableau suivant synthétise le partitionnement appliqué aux principaux topics :

| **Topic**          | **Clé de Partition**  | **Description**                                                |
|---------------------|-----------------------|----------------------------------------------------------------|
| `marketdata`        | Aucun (broadcast)     | Diffusion globale des données OHLCV brutes.                   |
| `strategiesdata`    | `strategyId`         | Données filtrées pour les stratégies actives.                 |
| `sessionsrequest`   | `sessionId`          | Demandes de suivi de position pour les sessions actives.       |
| `signals`           | Aucun (broadcast)    | Signaux non filtrés pour les consommateurs génériques.         |
| `raworders`         | `orderId`            | Ordres bruts sans quantité.                                   |
| `orders`            | `orderId`            | Ordres enrichis prêts à être exécutés.                        |

---

## Filtrage et Émission des Topics

### Filtrage dynamique
Les services émetteurs (DataCollect, StrategyExecutor) appliquent des filtres pour réduire le bruit et garantir la pertinence des messages publiés. 

| **Service**          | **Topic**          | **Critères de Filtrage**                                     |
|-----------------------|--------------------|--------------------------------------------------------------|
| **DataCollect**       | `strategiesdata`  | Stratégies actives : timeframe, marché, plateforme.          |
| **DataCollect**       | `sessionsrequest` | Sessions actives associées aux données collectées.          |
| **StrategyExecutor**  | `sessionsrequest` | Signaux pertinents pour les sessions actives.               |

---

## Liens utiles
- [Retour à la Table des Matières](index.md)
- [Dépôt principal de la documentation](https://github.com/dsissoko/r3edge-engine-docs)
