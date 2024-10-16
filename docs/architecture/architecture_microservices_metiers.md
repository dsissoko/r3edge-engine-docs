# Architecture Microservices pour le Système de Trading Algorithmique

## Introduction
Cette architecture microservices est conçue pour fournir un environnement modulaire, scalable et performant, dédié au trading algorithmique. Chaque service a une responsabilité spécifique, qu'il s'agisse de la collecte des données en temps réel, de l'exécution des stratégies, de la gestion des ordres, ou encore de la simulation via le backtesting et le paper trading. L'architecture inclut également un service centralisé, le **MarketDataService**, qui regroupe la détection des régimes de marché et la gestion des indicateurs du carnet d'ordres, permettant ainsi aux stratégies de prendre des décisions basées sur des informations partagées en temps réel.

## 1. PriceAndVolumeService (Microservice de collecte des prix et volumes)
- **Rôle** : Collecter les données de prix et volumes en temps réel et les stocker pour une analyse future (backtesting inclus).
- **Responsabilités** :
  - Récupération des flux de données OHLCV en temps réel via API externes ou WebSockets.
  - Stockage des données dans une base de données adaptée aux séries temporelles (ex: InfluxDB, TimescaleDB).
  - Mise à disposition des données historiques et en temps réel aux autres services via API REST ou WebSocket.

## 2. MarketScannerService (Microservice de sélection des instruments et timeframes)
- **Rôle** : Analyser en temps réel les instruments, les plateformes, et les timeframes pour identifier les meilleures opportunités de trading.
- **Responsabilités** :
  - Réception des critères de sélection (volatilité, liquidité, spreads, événements économiques).
  - Scoring et tri des instruments pour offrir les meilleures opportunités via API.

## 3. StrategyService (Microservice de gestion des stratégies)
- **Rôle** : Exécuter les stratégies de trading, générer des signaux bruts et qualifier les signaux.
- **Responsabilités** :
  - **baseSignalService** : Gérer l'exécution des stratégies pour générer des signaux bruts (RSI, MACD, etc.).
  - **SignalScoreService** : Qualifier ces signaux en appliquant des critères supplémentaires et un score de confiance.

## 4. EntryPointService (Microservice de calcul du point d'entrée)
- **Rôle** : Calculer le point d'entrée optimal sur la base des signaux qualifiés et des niveaux techniques (supports, résistances, Fibonacci, etc.).
- **Responsabilités** :
  - Calcul des points d'entrée en tenant compte des critères de confluence.
  - Exposition des points d'entrée aux autres services via API.

## 5. MoneyManagerService (Microservice de dimensionnement des ordres et gestion du capital en mode réel)
- **Rôle** : Calculer la taille des positions en fonction du capital et du risque, et envoyer les ordres réels au marché.
- **Responsabilités** :
  - Calcul des tailles de position selon le risque toléré et le capital disponible.
  - Interaction avec les APIs des plateformes de trading pour envoyer les ordres réels.
  - Gestion des frais, du slippage et de l'envoi d'ordres à la plateforme.

## 6. TrackingService (Microservice de suivi dynamique des positions et gestion des ordres)
- **Rôle** : Gérer les ordres et positions après l'exécution, ajuster les stops, trailing stops, partiels, et optimiser le ratio gain/risque.
- **Responsabilités** :
  - Suivi des positions ouvertes et ajustement dynamique des stop loss et partiels.
  - Optimisation du ratio gain/risque.

## 7. BackTestManagerService (Microservice de gestion des ordres en backtesting)
- **Rôle** : Simuler les exécutions d'ordres en utilisant des données historiques pour tester les stratégies.
- **Responsabilités** :
  - Récupérer les données historiques depuis le **PriceAndVolumeService** et simuler l'exécution des ordres en fonction de ces données.
  - Simuler le slippage, les frais et les retards d'exécution en fonction des conditions historiques du marché.
  - Fournir des résultats de performance détaillés pour évaluer les stratégies sur des périodes passées.

## 8. PaperTestManagerService (Microservice de gestion des ordres en paper trading)
- **Rôle** : Simuler l'exécution d'ordres en temps réel sans engager de capital.
- **Responsabilités** :
  - Intercepter les ordres envoyés par le **MoneyManagerService** en mode paper trading et simuler leur exécution sans les envoyer au marché.
  - Utiliser les prix et volumes fournis par le **PriceAndVolumeService** pour générer des résultats proches des conditions réelles, y compris les simulations de slippage et frais.
  - Suivi des positions et simulation des ajustements (stops, trailing stops) en temps réel, comme si l’ordre était réellement exécuté.

## 9. MarketDataService (Service commun pour la détection des régimes de marché et la gestion des indicateurs du carnet d’ordres)
- **Rôle** : Centraliser la détection des régimes de marché et la gestion des indicateurs du carnet d'ordres pour fournir des informations en temps réel aux stratégies.
- **Responsabilités** :
  - **Détection des Régimes de Marché** : Utiliser les données OHLCV pour identifier les régimes de marché (tendances, volatilité, marchés en range) et les probabilités de transition via des modèles comme les HMM.
  - **Indicateurs du Carnet d'Ordres** : Analyser les données du carnet d'ordres en temps réel (ratio long/short, profondeur du carnet, déséquilibre, delta cumulé, flux d’ordres).
  - **API RESTful** : Exposer les données sur les régimes de marché et les indicateurs du carnet d'ordres via une API RESTful pour être interrogées de manière synchrone par les stratégies de trading.

## Conclusion
Cette architecture microservices est conçue pour offrir une scalabilité, une modularité et une flexibilité maximales dans un environnement de trading algorithmique. Les services sont indépendants, permettant des évolutions et des mises à jour spécifiques sans impacter l'ensemble du système. Le **MarketDataService** centralise les données critiques pour toutes les stratégies, garantissant une prise de décision rapide et basée sur des informations fiables. La séparation des services pour le backtesting et le paper trading permet de valider les stratégies dans des environnements contrôlés avant de les utiliser en conditions réelles, assurant ainsi une robustesse optimale du système.


---

## Retour à la [section Architecture](index.md)
