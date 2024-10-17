# Architecture fonctionnelle

## Introduction
Cette architecture fonctionnelle traduit les étapes clés d'une séquence de trading en composants modulaires et autonomes. Chaque composant exécute une tâche précise du processus de trading, depuis la collecte des données jusqu'à la gestion des positions, permettant une automatisation et une optimisation complète des décisions de trading. Cette organisation garantit une approche réactive et scalable, capable de s'adapter aux conditions dynamiques du marché.

## 2. PriceAndVolumeCollector : Collecte des prix et des volumes en temps réel, et gestion de l'historique
Ce module centralise la collecte des données de prix et volumes des instruments de trading en temps réel. Il stocke également l'historique de ces données pour les analyses et backtests.

## 3. MarketScanner : Sélection de l'instrument, de la plateforme et de la timeframe
Le MarketScanner analyse en temps réel les instruments, les plateformes et les timeframes, en fonction de critères tels que la volatilité, la liquidité et les événements macroéconomiques. Il permet au trader de sélectionner les instruments offrant les meilleures opportunités de trading.

## 4. Stratégies
### 4.1. baseSignal : Calcul de signaux d'entrée
Ce module détecte les signaux d'entrée en activant les stratégies de trading adaptées aux conditions de marché. Il s'appuie sur des indicateurs techniques comme le RSI, MACD et des formations chartistes pour générer des signaux bruts.

### 4.2. SignalScore : Calcul du signal qualifié
Le SignalScore valide et qualifie les signaux en appliquant des critères supplémentaires de confirmation. Il analyse les tendances sur des timeframes supérieures et attribue un score de confiance aux signaux générés.

## 5. EntryPointCalculator : Calcul du point d'entrée
Ce composant détermine le point d'entrée optimal en tenant compte des niveaux techniques (supports, résistances, retracements de Fibonacci) et des signaux de confluence. La confluence renforce la probabilité d’un point d’entrée valide lorsque plusieurs facteurs convergent.

## 6. MoneyManager : Dimensionnement des ordres et gestion statique du capital
Le MoneyManager calcule la taille des positions à prendre en fonction du risque toléré, de la volatilité et de la stratégie de gestion du capital. Il s'assure également de l'envoi correct des ordres au marché.

## 7. TrackingManager : Surveillance dynamique des ordres et gestion des positions
Le TrackingManager gère la dynamique des positions après leur ouverture. Il ajuste les stop loss, trailing stops, gère les partiels et optimise le ratio gain/risque en fonction des évolutions du marché.

## Conclusion
Cette architecture fonctionnelle propose une approche modulaire et réactive pour l'automatisation du trading. Chaque composant joue un rôle spécifique dans l'ensemble du système, garantissant une gestion optimisée des ordres, du risque et des positions. Ce découpage permet également une meilleure évolutivité du système, capable d'ajuster les décisions de trading en fonction des changements de marché en temps réel.
---

## Retour à la [section Architecture](index.md)
