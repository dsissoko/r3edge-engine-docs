---
title: Architecture de Solution
description: Document décrivant l'architecture technique et les solutions mises en place.
last_updated: 2025-01-10
---

# Architecture de Solution

Ce document décrit l'architecture technique du projet ainsi que les solutions mises en place pour répondre aux besoins.

---

## Table des matières
- [Environnement de Production](#environnement-de-production)
  - [Niveau d'automatisation IAC de chaque composant](#niveau-dautomatisation-iac-de-chaque-composant)
- [Environnement de Développement](#environnement-de-developpement)

## Environnement de Production

| Couche          | Sous-réseau         | Composant             | Commentaire                                                                                     | Statut |
|------------------|---------------------|-----------------------|-------------------------------------------------------------------------------------------------|--------|
| Network          | Non applicable     | Root Network          | Réseau global au-dessus des VPC, gère l’interconnexion des sous-réseaux utilisateur.           | DONE   |
| Root Network     | VPC                |                       | Réseau privé virtuel avec trois sous-réseaux : Cluster Kubernetes, Backend Applicatif, NAT Gateway. Inclut les routages inter-sous-réseaux, les règles de sécurité inter-sous-réseaux, et l'accès Internet. | DONE   |
| Infrastructure   | NAT Gateway        | Bastion               | Instance pour accéder aux ressources internes du VPC en toute sécurité.                        | DONE   |
| Orchestration    | Cluster Kubernetes | Kubernetes            | Orchestration de conteneurs configurée. Permet la gestion et la scalabilité des ressources.    | DONE   |
|                  | Cluster Kubernetes | Cert Manager          | Gestion des certificats SSL/TLS automatisée pour Kubernetes.                                   | DONE   |
|                  | Cluster Kubernetes | Flux                  | Gestion GitOps automatisée via Kubernetes. Synchronise avec le dépôt GitHub.                  | DONE   |
|                  | Cluster Kubernetes | Traefik               | API Gateway et Ingress Controller en place. Gère le routage HTTP(S) et WebSockets.            | DONE   |
| Internet         | Internet           | Prometheus            | Monitoring des performances et ressources. Utilisé comme PaaS pour l'observabilité.           | TODO   |
|                  | Internet           | Grafana               | Visualisation des métriques et logs. Instance PaaS disponible pour aspects applicatifs.        | TODO   |
|                  | Internet           | Supabase              | Fournit une API REST pour PostgreSQL, gestion temps réel via WebSockets. Intégration à finaliser. | TODO   |
|                  | Internet           | Auth0                 | Gestion centralisée des utilisateurs, authentification et sécurité. SaaS configuré et opérationnel. | DONE   |
|                  | Internet           | PostgreSQL/TimeScaleDB            | Base de données relationnelle en PaaS, haute disponibilité et sauvegardes gérées. L'addon TimeScaleDB optimise les données temporelles Configuration réseau requise. | TODO   |
|                  | Internet           | Kafka                 | Messagerie distribuée en PaaS, hébergée chez Confluent.io ou Redpanda. Permet la gestion des événements pour les microservices. | TODO   |
|                  | Internet           | GitHub                | Référentiel Git utilisé pour GitOps avec Flux. Centralise les configurations.                 | DONE   |
| Applicative      | Cluster Kubernetes | r3edge-engine         | Application principale opérée dans Kubernetes. Intégration et déploiement à venir.            | TODO   |
|                  | Cluster Kubernetes | Spring Config Server  | Centralisation des configurations des microservices via un serveur Spring.                    | TODO   |

### Niveau d'automatisation IAC de chaque composant

| Couche          | Sous-réseau         | Composant             | Configuration Automatique | Configuration Manuelle                                                                                                   |
|------------------|---------------------|-----------------------|---------------------------|-------------------------------------------------------------------------------------------------------------------------|
| Network          | Non applicable     | Root Network          | Oui                       | Création manuelle du compte cloud (GCP).                                                                                |
| Root Network     | VPC                |                       | Oui                       | Non                                                                                                                     |
| Infrastructure   | NAT Gateway        | Bastion               | Oui                       | Non                                                                                                                     |
| Orchestration    | Cluster Kubernetes | Kubernetes            | Oui                       | Non                                                                                                                     |
|                  | Cluster Kubernetes | Cert Manager          | Oui                       | Non                                                                                                                     |
|                  | Cluster Kubernetes | Flux                  | Oui                       | Non                                                                                                                     |
|                  | Cluster Kubernetes | Traefik               | Oui                       | Non                                                                                                                     |
| Internet         | Internet           | Prometheus            | Non                       | Création manuelle du compte d'accès pour le fournisseur de service ciblé.                                               |
|                  | Internet           | Grafana               | Non                       | Création manuelle du compte d'accès pour le fournisseur de service ciblé.                                               |
|                  | Internet           | Supabase              | Non                       | Création manuelle du compte d'accès pour le fournisseur de service ciblé.                                               |
|                  | Internet           | Auth0                 | Oui                       | Création manuelle du compte d'accès pour le fournisseur de service ciblé.                                               |
|                  | Internet           | PostgreSQL            | Non                       | Création manuelle du compte d'accès pour le fournisseur de service ciblé.                                               |
|                  | Internet           | Kafka                 | Non                       | Création manuelle du compte d'accès pour le fournisseur de service ciblé.                                               |
|                  | Internet           | GitHub                | Oui                       | Création manuelle du compte d'accès pour le fournisseur de service ciblé. Paramétrage d'un Webhook pour informer `config server` des mises à jour des configurations des microservices (POST sur `/monitor`). |
| Applicative      | Cluster Kubernetes | r3edge-engine         | Oui                       | Les microservices sont développés à la main. Après le commit, les GitHub Actions génèrent une image sur [Docker Hub](https://hub.docker.com/r/dsissoko/r3edge). |
|                  | Cluster Kubernetes | Spring Config Server  | Oui                       | Les microservices sont développés à la main. Après le commit, les GitHub Actions génèrent une image sur [Docker Hub](https://hub.docker.com/r/dsissoko/r3edge). |

---

## Environnement de Développement

### Objectif
Permettre le développement local des microservices sans dépendance directe à Kubernetes.  
Réduire la complexité technique tout en garantissant un comportement proche de l’environnement de production.

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
