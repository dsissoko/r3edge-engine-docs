---
title: Architecture de Solution
description: Document décrivant l'architecture technique et les solutions mises en place.
last_updated: 2025-01-10
---

# Architecture de Solution

Ce document décrit l'architecture de solution, c'est à dire les constituantes de la plateforme de production et les constituants de la plateforme de développement. Il explique également les raisons des différents choix effectués.
Les principes de base:
- limiter les couts en utilisant au maximum les offres free et always free disponibles sur le marché
- architecture de microservices sur le cloud
- pratiques devops favorisés et automatisation maximum
- kubernetes comme orchestrateur mais uniquement pour la production. Pour optimiser les coûts, l'environnement de développement peux s'éxécuter en dehors d'un orchestrateur

---

## Table des matières
- [Liste des sous-systèmes](#liste-des-sous-systèmes)
- [Environnement de Production](#environnement-de-production)
- [Environnement de Développement](#environnement-de-développement)

## Liste des sous-systèmes

- microservices de r3edge engine
- configuration applicative
- base de données
- système d'échange messages entre microservices
- système de gestion des authentifications et habilitations
- plateformes de trading
- orchestration des microservices (pour la production)
- hébergement des microservices non orchestrés (pour le développement)

```mermaid
graph TD
    %% Groupes principaux
    subgraph Application Layer
        A[Microservices de r3edge engine]
    end

    subgraph Configuration Layer
        B[Configuration applicative]
    end

    subgraph Data Layer
        C[Base de données]
    end

    subgraph Messaging Layer
        D[Système d'échange de messages]
    end

    subgraph Security Layer
        E[Système de gestion des authentifications et habilitations]
    end

    subgraph Trading Layer
        F[Plateformes de trading]
    end

    subgraph Orchestration Layer
        G[Orchestration des microservices]
    end

    subgraph Development Layer
        H[Hébergement des microservices non orchestrés]
    end

    %% Connexions
    A -->|Utilise| B
    A -->|Stocke et lit| C
    A -->|Communique via| D
    A -->|S'appuie sur| E
    A -->|Accède à| F
    G -->|Orchestre| A
    H -->|Héberge| A
```


Liste des plateformes physiques:
- Northflank
- Google cloud platform
- Oracle Cloud Infrastructure
- Confluent cloud
- Github
- dockerHub
- Auth0

```mermaid
graph TD
    %% Plateformes physiques
    A[Northflank]
    B[Google Cloud Platform]
    C[Oracle Cloud Infrastructure]
    D[Confluent Cloud]
    E[GitHub]
    F[DockerHub]
    G[Auth0]

    %% Relations principales
    E -->|CI/CD pour déploiement| B
    E -->|CI/CD pour déploiement| C
    E -->|Stocke images Docker| F
    B -->|Accède aux configurations| A
    C -->|Accède aux configurations| A
    B -->|Authentification via| G
    C -->|Authentification via| G
    D -->|Messagerie Kafka pour microservices| B
    D -->|Messagerie Kafka pour microservices| C
```



## Environnement de Production

L’environnement de production est conçu pour garantir haute disponibilité, scalabilité, et sécurité des services déployés. Il repose sur une infrastructure orchestrée par Kubernetes, complétée par des solutions PaaS/SaaS pour simplifier la gestion des configurations, des données et des communications entre microservices.

```mermaid
graph TD
    %% Plateformes physiques
    subgraph GCP
        A[Kubernetes Cluster]
        B[NAT Gateway]
        C[Bastion]
    end

    subgraph PaaS_SaaS
        D[Auth0]
        E[Confluent Cloud]
        subgraph Data_Layer
            F[Supabase]
            J[TimeScaleDB]
        end
        I[Config Server Northflank]
    end

    subgraph CI_CD
        G[GitHub]
        H[DockerHub]
    end

    %% Relations
    G -->|Déploie images sur| H
    G -->|GitOps avec| A
    A -->|Orchestre microservices| E
    A -->|Accède directement à| J
    A -->|Consomme API exposée par| F
    F -->|Expose données de| J
    A -->|Consomme configurations via| I
    A -->|Gère authentification via| D
    B -->|Sorties sécurisées| A
    C -->|Accès sécurisé| A
```


## Environnement de Développement

Permettre le développement local des microservices sans dépendance directe à Kubernetes.Réduire la complexité technique tout en garantissant un comportement proche de l’environnement de production.

```mermaid
graph TD
    %% Plateformes physiques
    subgraph Dev_Local
        A[Microservices Local Dev]
    end

    subgraph OCI
        B[Microservices via Docker]
    end

    subgraph PaaS_SaaS
        C[Config Server Northflank]
        D[Auth0]
        E[Confluent Cloud]
        subgraph Data_Layer
            F[Supabase]
            J[TimeScaleDB]
        end
    end

    subgraph CI_CD
        G[GitHub]
        H[DockerHub]
    end

    %% Relations
    G -->|Déploie images sur| H
    G -->|Fournit configurations via GitOps| C
    A -->|Utilise configurations via| C
    B -->|Utilise configurations via| C
    A -->|Accède directement à| J
    B -->|Accède directement à| J
    A -->|Consomme API exposée par| F
    B -->|Consomme API exposée par| F
    F -->|Expose données de| J
    A -->|Accède à| E
    A -->|Gère authentification via| D
    B -->|Accède à| E
    B -->|Gère authentification via| D
```

---

<!-- Pied de page -->
## Liens utiles
- [Retour à la Table des Matières](index.md)
- [Dépôt principal de la documentation](https://github.com/dsissoko/r3edge-engine-docs)
