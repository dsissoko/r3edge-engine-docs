<!-- Haut de page -->
---
title: Architecture de Solution
description: Document décrivant l'architecture technique et les solutions mises en place.
last_updated: 2025-01-03
---

# Architecture de Solution

Ce document décrit l'architecture technique du projet ainsi que les solutions mises en place pour répondre aux besoins.

---

## Table des matières
- [Environnement de Production](#environnement-de-production)
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
|                  | Internet           | PostgreSQL            | Base de données relationnelle en PaaS, haute disponibilité et sauvegardes gérées. Configuration réseau requise. | TODO   |
|                  | Internet           | Kafka                 | Messagerie distribuée en PaaS, hébergée chez Confluent.io ou Redpanda. Permet la gestion des événements pour les microservices. | TODO   |
|                  | Internet           | GitHub                | Référentiel Git utilisé pour GitOps avec Flux. Centralise les configurations.                 | DONE   |
| Applicative      | Cluster Kubernetes | r3edge-engine         | Application principale opérée dans Kubernetes. Intégration et déploiement à venir.            | TODO   |
|                  | Cluster Kubernetes | Spring Config Server  | Centralisation des configurations des microservices via un serveur Spring.                    | TODO   |

---

## Environnement de Développement

[Section vide, à compléter.]

---

<!-- Pied de page -->
## Liens utiles
- [Retour à la Table des Matières](index.md)
- [Dépôt principal de la documentation](https://github.com/dsissoko/r3edge-engine-docs)
