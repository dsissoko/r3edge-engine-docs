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
- [Pipeline CI/CD](#pipeline-cicd)
- [Noms de domaine DNS de la solution](#noms-de-domaine-dns-de-la-solution)
- [Informations complémentaires](#informations-complémentaires)
- [À traiter plus tard](#à-traiter-plus-tard)

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
- **Northflank** : Hébergeur PaaS pour les microservices en développement et fournisseur du Config Server pour tous les environnements.  
- **Google Cloud Platform (GCP)** : Fournit l’infrastructure pour Kubernetes, le déploiement en production et les ressources cloud de l’architecture.  
- **Oracle Cloud Infrastructure (OCI)** : Fournit le PaaS Database et Supabase pour tous les environnements, ainsi que l’hébergement des microservices en développement via Docker.  
- **Confluent Cloud** : Service PaaS pour Kafka, assurant la gestion des messages et la distinction des environnements via des topics.  
- **GitHub** : Référentiel Git pour le stockage et la gestion centralisée des configurations et du code source.  
- **DockerHub** : Registre pour stocker et distribuer les images Docker des microservices.  
- **Auth0** : Service PaaS pour l’authentification, la gestion des utilisateurs et les habilitations.  
- **OVH** : Fournit la gestion du domaine `r3edge.com`, des sous-domaines DNS, des boîtes mail et autres services associés.  
- **DevLocal** : Permet aux développeurs de construire, tester et exécuter les microservices en local, notamment via Docker ou des environnements intégrés.  


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
## Pipeline CI/CD

Le pipeline CI/CD joue un rôle central dans l’automatisation des processus de déploiement et de gestion des images Docker.

```mermaid
graph TD
    %% Registry
    A[DockerHub]

    %% Pushers
    B[DevLocal] -->|Push| A
    C[GitHub] -->|Push| A

    %% Pullers
    A -->|Pull| D[DevLocal]
    A -->|Pull| E[Northflank]
    A -->|Pull| F[GCP]
    A -->|Pull| G[OCI]
```

### Tokens d'accès (gérés dans docker hub)

- TOKEN-CICD-RW : Utilisé par les plateformes pushers (DevLocal, GitHub) pour écrire dans la registry.
- TOKEN-CICD-R : Utilisé par les plateformes pullers (DevLocal, Northflank, GCP, OCI) pour lire depuis la registry.

## Noms de domaine DNS de la solution

### API principale (microservices)
- **Prod** : https://api.r3edge.com  
- **Dev** : https://dev.api.r3edge.com  
- **Description** : Point d'accès unique pour tous les microservices backend. Les environnements sont différenciés par des URLs distinctes.

### Base de données (PostgreSQL/Supabase)
- **URL unique** : https://db.r3edge.com  
- **Description** : Un domaine unique pour la base de données. La séparation des environnements se fait au niveau logique via des schémas spécifiques (dev, prod).

### Kafka
- **Exposition** : Non exposé directement.  
- **Description** : Kafka reste interne au système, sécurisé par des ACLs. La distinction des environnements est assurée via des conventions de nommage des topics (par ex. `topic.dev.orders` pour Dev et `topic.orders` pour Prod).

### Config Server
- **URL unique** : https://config.r3edge.com  
- **Description** : Gère les configurations des microservices pour tous les environnements. La séparation est réalisée via des Spring Profiles (dev, prod).

### Auth0
- **URL unique** : https://auth.r3edge.com  
- **Description** : Un seul domaine pour tous les environnements. La distinction des environnements se fait via des applications Auth0 dédiées :
  - **App Prod** : `r3edge-engine-prod`
  - **App Dev** : `r3edge-engine-dev`

### Résumé global

#### API principale
- **URLs distinctes pour chaque environnement** :
  - **Prod** : https://api.r3edge.com
  - **Dev** : https://dev.api.r3edge.com

#### Base de données (PostgreSQL/Supabase)
- **URL unique** : https://db.r3edge.com  
- **Séparation logique** via schémas (`dev`, `prod`).

#### Kafka
- **Cluster unique**, distinction des environnements via les noms des topics (`topic.dev.*` et `topic.*`).

#### Config Server
- **URL unique** : https://config.r3edge.com  
- **Séparation** via Spring Profiles (`dev`, `prod`).

#### Auth0
- **Domaine unique** : https://auth.r3edge.com  
- **Distinction** via des applications dédiées à chaque environnement :
  - **Prod** : `r3edge-engine-prod`
  - **Dev** : `r3edge-engine-dev`

## Informations complémentaires

### Outillage
- [OVHcloud Manager](https://www.ovh.com/manager/#/hub/) : Gestion des domaines et services OVH.  
- [Let's Encrypt](https://letsencrypt.org/fr/) : Certificats SSL/TLS gratuits.  
- [Insomnia](https://app.insomnia.rest/app/dashboard/organizations) : Test et gestion des APIs REST.  
- [JWT.io](https://jwt.io/) : Travail avec les JSON Web Tokens (JWT).

### Plateformes à étudier
- [Redpanda Documentation](https://docs.redpanda.com/home/) : Documentation pour l'alternative à Kafka.  
- [RealCloud](https://realcloud.in/) : Plateforme à explorer pour son potentiel dans l'architecture.  


## À traiter plus tard

### Écarts identifiés sans Kubernetes

#### Résolution DNS interne
En absence de DNS interne Kubernetes, les services ne peuvent pas se résoudre automatiquement via des noms comme `service2.default.svc.cluster.local`. En local, cette fonctionnalité est remplacée par un mécanisme basé sur des configurations centralisées dans Spring Config Server.

#### Annuaire de services (Service Discovery)
Kubernetes gère nativement la découverte des services via ses objets `Service`. Sans Kubernetes, une solution externe ou une configuration manuelle est nécessaire. Toutefois, pour un environnement de développement avec un nombre limité de services, un annuaire est considéré comme superflu.

#### Dépendances inter-services
Kubernetes orchestre les dépendances et vérifie que les services sont disponibles avant de rediriger le trafic. En local, cela doit être géré manuellement via des vérifications de disponibilité (`/actuator/health`) ou des mécanismes comme Spring Retry.

#### API Gateway (Traefik)
En production, Traefik agit comme un point d’entrée central pour les clients externes, gérant :
- Le routage des requêtes vers les microservices.
- La gestion des certificats SSL.
- La centralisation des règles de sécurité et des authentifications.

Dans l’environnement de développement, cette API Gateway n’est pas utilisée pour les communications internes entre microservices, mais elle reste dédiée aux appels des clients externes si nécessaire.

#### Scalabilité et Load Balancing (non traité ici)
Kubernetes offre un équilibrage de charge automatique et le scaling dynamique. En local, cela nécessite des outils ou scripts supplémentaires, mais ces besoins sont écartés pour l’environnement de développement.

#### Gestion des secrets et configurations
Kubernetes gère les secrets et configurations via ConfigMaps et Secrets. En local, ces éléments sont externalisés et gérés par Spring Config Server pour assurer une centralisation des paramètres sensibles.

#### Monitoring et observabilité (non traité ici)
En local, les logs et métriques ne sont pas centralisés. L’observabilité complète est reportée à des outils intégrés en production (ex. Prometheus, Grafana).

#### Exposition et routage des services (non traité ici)
En production, Kubernetes utilise des `Ingress` pour gérer les routes HTTP(S). En local, ces fonctionnalités sont simplifiées avec des URLs locales ou via des mécanismes comme Docker Compose.

### Focus sur les 4 sujets majeurs

#### Résolution DNS interne
Mise en place d’un mécanisme basé sur Spring Config Server pour reconstituer dynamiquement les URLs des services en fonction de l’environnement (dev, test, prod).  
- Les préfixes (`localhost`) et les suffixes DNS (`svc.cluster.local`) sont externalisés dans des fichiers YAML gérés par Config Server.  
- Les microservices se limitent à utiliser uniquement le nom du service cible (ex. `service2`).

#### Annuaire de services
La découverte des services est simplifiée via Config Server.  
- Pour un nombre limité de services en environnement de développement, un annuaire dynamique (ex. Eureka) est jugé non nécessaire.  
- Les dépendances sont déclarées statiquement dans Config Server ou les fichiers de configuration.

#### Dépendances inter-services
Implémentation d’un mécanisme basé sur Spring Retry et Feign pour gérer les dépendances critiques.  
- Vérification de la disponibilité des services via `/actuator/health`.  
- Les dépendances sont testées avant l’initialisation complète des microservices.

#### Appels inter-services
Les appels entre microservices sont gérés directement via des clients HTTP comme **Spring OpenFeign** ou **Spring WebClient** :  
- **OpenFeign** : Offre une syntaxe déclarative pour simplifier les appels entre services.
- **WebClient** : Option réactive adaptée pour des besoins asynchrones ou hautement concurrents.  
L’API Gateway (Traefik) n’est pas utilisée pour les communications internes, car elle est exclusivement réservée aux appels externes.

---

<!-- Pied de page -->
## Liens utiles
- [Retour à la Table des Matières](index.md)
- [Dépôt principal de la documentation](https://github.com/dsissoko/r3edge-engine-docs)

