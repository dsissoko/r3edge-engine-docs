---
title: Services Backend
description: Document présentant les services fonctionnels backend du projet.
last_updated: 2025-01-04
---

# Services Backend

Ce document détaille les services fonctionnels backend identifiés et leurs rôles dans l'architecture de r3edge-engine.

---

## Table des matières
- [MarketDataService](#marketdataservice)
- [PriceAndVolumeCollector](#priceandvolumecollector)
- [MarketScanner](#marketscanner)
- [strategyBaseSignal](#strategybasesignal)
- [strategyQualifiedSignal](#strategyqualifiedsignal)
- [EntryPointService](#entrypointservice)
- [MoneyManager](#moneymanager)
- [TrackingManager](#trackingmanager)
- [BackTestManagerService & PaperTestManagerService](#backtestmanagerservice--papertestmanagerservice)
- [Authentification & Sécurité](#authentification--securite)

---

## MarketDataService
- **Fonction** : Détecte les régimes de marché et gère les indicateurs du carnet d'ordres.
- **Alimentation** : Reçoit en continu les données OHLCV et est connecté aux carnets d'ordres via WebSocket.
- **Usage** : Fournit toutes les métriques clés nécessaires aux stratégies de trading via une API RESTful synchrone, avec une fenêtre glissante d’historique de 10 jours.

## PriceAndVolumeCollector
- **Fonction** : Collecte les prix et volumes en temps réel pour l'analyse et le backtesting.
- **Stockage** : Gère les historiques pour les services qui nécessitent une analyse ou des simulations.

## MarketScanner
- **Fonction** : Permet de scanner les instruments financiers pour identifier les meilleures opportunités de trading.
- **Objectif** : Outil d'aide à la décision initiale pour le trader.

## strategyBaseSignal
- **Fonction** : Génère les signaux d’entrée initiaux pour chaque stratégie, adaptés aux différents régimes de marché.
- **Modèles** : Utilise des modèles mathématiques (HMM, GARCH, etc.) et les données du MarketDataService pour fournir des signaux d'entrée.

## strategyQualifiedSignal
- **Fonction** : Transforme le signal de base en un signal qualifié prêt à être exploité comme point d’entrée.
- **Objectif** : S'appuie sur des confirmations supplémentaires pour valider les signaux avant l’action.

## EntryPointService
- **Fonction** : Fournit en temps réel des prix pour un point d’entrée long ou short en fonction des conditions de marché, sans validation de signaux.
- **Entrée** : Instrument, plateforme, biais (long/short) et, par prudence, une timeframe.
- **Modèles** : Exploite divers modèles (croisements de moyennes, Bollinger Bands, ARCH/GARCH, mean reversion, etc.).

## MoneyManager
- **Fonction** : Responsable du dimensionnement des ordres et de leur envoi sur le marché.
- **Objectif** : Assure un money management solide en consolidant les fonctions de gestion statique des positions.

## TrackingManager
- **Fonction** : Suivi dynamique des ordres et des positions ouvertes, avec une orientation sur le money management.
- **Extension** : Intègre les fonctions de l’ancien ExitManager, facilitant la gestion des sorties en fonction de critères prédéfinis.

## BackTestManagerService & PaperTestManagerService
- **Fonction** : Services distincts pour gérer le backtesting et le paper trading (trading simulé) des stratégies.
- **Utilité** : Fournissent un environnement de test contrôlé pour évaluer les stratégies avant le trading en conditions réelles.

## Authentification & Sécurité
- **Service** : Utilisation d'un service PAAS comme Auth0 pour la gestion de l'authentification, garantissant un accès sécurisé et individualisé pour chaque utilisateur.

---

<!-- Pied de page -->
## Liens utiles
- [Retour à la Table des Matières](index.md)
- [Dépôt principal de la documentation](https://github.com/dsissoko/r3edge-engine-docs)
