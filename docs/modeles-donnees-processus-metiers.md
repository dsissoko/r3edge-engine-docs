<!-- Haut de page -->
---
title: Modèles de Données et Processus Métiers
description: Document présentant les modèles de données et les processus métiers du projet.
last_updated: 2025-01-03
---

# Modèles de Données et Processus Métiers

Ce document présente les modèles de données utilisés dans le projet ainsi que les processus métiers associés.

---

## Table des matières
- [Modèles de Données](#modeles-de-donnees)
  - [Structure des Données](#structure-des-donnees)
  - [Règles de Stockage](#regles-de-stockage)
- [Processus Métiers](#processus-metiers)
  - [Séquence de Trading Détaillée](#sequence-de-trading-detaillee)

## Modèles de Données

### Structure des Données
Les données principales gérées par le projet incluent :
- **Données utilisateurs** : Profils, abonnements, et activités.
- **Données de marché** : Données OHLCV, niveaux de volume, et profondeur de marché.
- **Données analytiques** : Indicateurs calculés et rapports générés.

```mermaid

classDiagram

%% ==================
%%     ENUMS
%% ==================
class TimeFrame {
    <<enumeration>>
    H1
    M5
    DAILY
    ...
}
class SignalType {
    <<enumeration>>
    LONG
    SHORT
    FLAT
    ...
}

%% ==================
%%   ENTITÉS DE BASE
%% ==================
class Platform {
    - String platformId
    - String name
    - String baseUrl
    - String apiKey  %% (si besoin)
}

class AssetPair {
    - String baseAsset
    - String quoteAsset
}

class Instrument {
    - String instrumentId
    - TimeFrame timeframe
    - String symbol  %% ex: "BTCUSD"
}

%% ==================
%%  DONNÉES MARCHÉ
%% ==================
class OHLCV {
    - DateTime openTime
    - double open
    - double high
    - double low
    - double close
    - double volume
}

class Ticker {
    - DateTime tickTime
    - double lastPrice
    - double volume
}

%% ==================
%%   ENTITÉS TRADING
%% ==================
class Strategy {
    - String strategyId
    - String name
    + generateSignals()
}

class Session {
    - String sessionId
    - SessionStatus status  %% ex: ON, OFF, ACTIVE...
    - DateTime startTime
    - DateTime endTime
    - String refreshRate
}

class Signal {
    - String signalId
    - SignalType type
    - DateTime createdAt
    - double confidence %% ex. niveau de confiance
}

class Order {
    - String orderId
    - Side side           %% ex. BUY, SELL
    - OrderStatus status  %% ex. PLACED, FILLED
    - double quantity
    - double price
    - DateTime creationTime
}

class Position {
    - String positionId
    - double quantity
    - double entryPrice
    - double unrealizedPnL
}

class Trade {
    - String tradeId
    - double executedQty
    - double executedPrice
    - DateTime tradeTime
}

%% ===========================
%%   RELATIONS ENTRE CLASSES
%% ===========================
%% 1) Un Instrument associe un AssetPair et une Platform
Instrument --> "1" AssetPair : "utilise"
Instrument --> "1" Platform : "s'échange sur"

%% 2) Une Session est reliée à un Instrument ET à une Strategy
Session --> "1" Instrument : "porte sur"
Session --> "1" Strategy : "exécute"

%% 3) Une Session peut générer plusieurs Signals
Session --> "0..*" Signal : "produit"

%% 4) Un Signal fait référence à la Session qui l'a émis
Signal --> "1" Session : "appartient à"

%% 5) Une Session peut avoir plusieurs Orders et Positions
Session --> "0..*" Order : "contient"
Session --> "0..*" Position : "contient"

%% 6) Un Order peut générer plusieurs Trades
Order --> "0..*" Trade : "découle de"

%% 7) OHLCV et Ticker sont généralement liés à un Instrument
OHLCV --> "1" Instrument : "décrit"
Ticker --> "1" Instrument : "décrit"


```

Chaque type de données est structuré en utilisant des modèles relationnels dans **PostgreSQL** ou des structures optimisées pour le cache via **Hazelcast**.

### Règles de Stockage
- **Persistance** : Les données critiques sont sauvegardées dans PostgreSQL avec une politique de haute disponibilité.
- **Cache distribué** : Utilisation de Hazelcast pour les données à haute fréquence d’accès (ex. sessions utilisateur).
- **Archivage** : Les données historiques sont archivées après 12 mois dans un stockage froid.

## Processus Métiers

### Séquence de Trading Détaillée

#### Introduction
La séquence de trading détaillée décrit les étapes complètes impliquées dans l’exécution d’une opération de trading au sein de r3edge-engine. Ce processus est conçu pour assurer une exécution rapide, précise et conforme aux stratégies définies par les utilisateurs.

#### Étapes du Processus
1. **Analyse des Données de Marché**
   - Collecte des données en temps réel.
   - Analyse des tendances et des indicateurs techniques.
2. **Définition des Stratégies de Trading**
   - Sélection des stratégies basées sur les analyses.
   - Configuration des paramètres spécifiques à chaque stratégie.
3. **Génération des Ordres de Trading**
   - Création automatique des ordres en fonction des stratégies définies.
   - Validation des ordres avant l’exécution.
4. **Exécution des Ordres**
   - Envoi des ordres aux plateformes de trading.
   - Suivi en temps réel de l’exécution des ordres.
5. **Surveillance et Reporting**
   - Surveillance continue des performances des ordres exécutés.
   - Génération de rapports détaillés sur les transactions réalisées.

#### Conclusion
La séquence de trading détaillée est au cœur du fonctionnement de r3edge-engine, garantissant que chaque opération de trading est exécutée de manière optimale et efficace. Ce processus intégré permet aux utilisateurs de se concentrer sur la définition de leurs stratégies tout en laissant le moteur gérer l’exécution et le suivi des ordres.

---

<!-- Pied de page -->
## Liens utiles
- [Retour à la Table des Matières](index.md)
- [Dépôt principal de la documentation](https://github.com/dsissoko/r3edge-engine-docs)
