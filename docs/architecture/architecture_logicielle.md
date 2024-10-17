# Architecture Logicielle

## Introduction

Cette section détaille l'architecture logicielle de **r3edge-engine**. Elle couvre les **zones réseau**, les **composants de base**, et les **coûts de licence** associés, avec des solutions d'**observabilité** intégrées pour simplifier la gestion et le suivi de l'infrastructure. Chaque partie de l'infrastructure est conçue pour être **testable**, **répétable**, et **scalable**.

## 1. Zones réseau dans l'architecture

- **Internet** : Zone externe où les utilisateurs finaux accèdent à tes services via des navigateurs ou des applications mobiles. Les services accessibles depuis Internet (comme **Traefik**) sont exposés via des adresses fournies par le cloud provider.

- **Zone publique (Public Subnet)** : Réseau dans le cloud où les ressources peuvent être directement accessibles depuis Internet. **Traefik** est placé ici pour gérer le routage des requêtes externes vers les microservices internes via HTTPS. **SPOF** si Traefik est déployé sur un seul cloud.

- **Zone privée (Private Subnet)** : Réseau isolé d'Internet, utilisé pour héberger les **microservices internes**, la **base de données**, et **Kafka**. Ces services ne sont pas directement accessibles depuis Internet, mais peuvent faire des requêtes sortantes via une **NAT Gateway**. Chaque NAT Gateway est un **SPOF** si elle est déployée sur un seul cloud.

- **Zone inter-cloud (via Submariner)** : Zone virtuelle permettant la **connectivité entre plusieurs clouds** publics pour les microservices comme **Hazelcast**, qui communiquent entre différents clusters Kubernetes répartis sur plusieurs fournisseurs cloud. **Pas de SPOF** ici, car Submariner est distribué.

- **Bastion Host** : Un serveur dans la zone publique utilisé pour administrer les ressources dans les zones privées (subnets privés) via SSH ou RDP. Si un seul Bastion Host est déployé sur chaque cloud, il devient un **SPOF** pour l'accès administratif sur ce cloud.

- **NAT Gateway** : Passerelle permettant aux ressources dans des **subnets privés** de faire des connexions sortantes vers Internet sans être directement exposées. Chaque NAT Gateway est un **SPOF** pour les connexions sortantes depuis un cloud.

## 2. Composants de base de l'architecture

- **Kubernetes (avec Submariner)** : Orchestrateur de conteneurs qui gère le déploiement, le scaling et la connectivité **multicloud** entre les clusters Kubernetes sur plusieurs clouds grâce à **Submariner**. **Pas de SPOF**, car Submariner distribue les communications inter-cluster.

- **Traefik (SPOF)** : API Gateway et reverse proxy qui gère l'entrée des requêtes externes via HTTPS et les redirige vers les microservices internes. **SPOF**, car Traefik est déployé sur un seul cloud.

- **PAAS Postgres** : Base de données relationnelle gérée en mode PAAS sur un cloud provider unique. **SPOF**, car un seul service PAAS est utilisé.

- **PAAS Kafka** : Système de messagerie asynchrone également géré en mode PAAS sur un cloud provider unique. **SPOF**, car un seul service Kafka est utilisé.

- **Microservices** : Composants logiciels déployés sur plusieurs clouds dans des **subnets privés** et communiquant entre eux grâce à **Submariner** pour la partie **multicloud**. **Pas de SPOF**, car les microservices sont distribués sur plusieurs clouds.

- **Hazelcast (via Submariner)** : Cache distribué utilisé pour partager des données entre microservices répartis **sur plusieurs clouds**. **Pas de SPOF**, car Hazelcast est déployé de manière distribuée.

- **Kubernetes ConfigMaps** : Utilisés pour gérer des **paramètres non sensibles** (comme des configurations d’application) qui peuvent être injectés dans les pods Kubernetes sous forme de fichiers ou de variables d'environnement. **Pas de SPOF**, chaque cluster Kubernetes a ses propres ConfigMaps.

- **Kubernetes Secrets** : Utilisés pour stocker et gérer des **informations sensibles** comme des clés API et des mots de passe. **Pas de SPOF**, car chaque cluster Kubernetes gère ses propres secrets.

- **Spring Cloud Config (SPOF)** : Outil de gestion centralisée des **paramètres applicatifs** pour les microservices Spring Boot. **SPOF**, car il est déployé sur un seul cloud.

- **Supabase** : Utilisé pour **générer automatiquement des API RESTful** basées sur les données PostgreSQL. Supabase facilite également la gestion des notifications en temps réel via WebSockets et la gestion des authentifications pour les API clients.

- **Auth0** : Service PAAS utilisé pour la **gestion des utilisateurs**, permettant de sécuriser les accès aux API exposées via **Supabase**. Auth0 gère l'authentification des utilisateurs et fournit des **tokens JWT** pour sécuriser les accès.

## 3. Coûts de licence des composants

- **Kubernetes (avec Submariner)** : **Gratuit**. Kubernetes et Submariner sont des logiciels open source et ne nécessitent pas de licence.

- **Traefik** : **Gratuit** en version open source. Aucune licence payante requise.

- **PAAS Postgres** : **Potentiellement payant**. En mode PAAS, l'utilisation de Postgres est soumise aux tarifs du fournisseur cloud.

- **PAAS Kafka** : **Potentiellement payant**. Kafka en mode PAAS entraîne des coûts liés aux services du fournisseur cloud.

- **Microservices** : **Gratuit**. Les microservices déployés sur Kubernetes ne nécessitent pas de licence.

- **Hazelcast (via Submariner)** : **Gratuit en version open source**. Aucune licence payante requise pour la version open source.

- **Kubernetes ConfigMaps** : **Gratuit**. Les ConfigMaps sont une fonctionnalité native de Kubernetes.

- **Kubernetes Secrets** : **Gratuit**. Les Secrets sont également une fonctionnalité native de Kubernetes.

- **Spring Cloud Config** : **Gratuit** en version open source. Aucune licence payante requise.

- **Bastion Host** : **Potentiellement payant**. Dépend des coûts d'infrastructure pour héberger un Bastion Host dans un cloud public.

- **NAT Gateway** : **Potentiellement payant**. Les NAT Gateways sont des services payants dans les environnements cloud publics.

- **Supabase** : **Gratuit** dans sa version open source, mais des coûts peuvent être associés aux services PAAS supplémentaires pour une scalabilité accrue.

- **Auth0** : **Potentiellement payant** selon les besoins en authentification. Auth0 propose un niveau gratuit pour les petites applications, mais les coûts augmentent avec le nombre d'utilisateurs et de fonctionnalités avancées.

## 4. Outils de gestion des zones réseau et des composants

### Zones réseau :
- **AWS** : 
  - **AWS CloudWatch** : Outil intégré pour la surveillance des **zones publiques et privées** (VPC, NAT Gateways). **AWS VPC Flow Logs** pour la capture du trafic réseau.
  
- **Google Cloud** :
  - **Google Cloud Operations** (anciennement Stackdriver) : Offre une surveillance pour les **VPC** et les **NAT Gateways**. **VPC Flow Logs** pour analyser le trafic.

- **Microsoft Azure** :
  - **Azure Monitor** et **Network Watcher** : Ces outils couvrent la surveillance des **zones réseau**, des VNETs, et des gateways dans **Azure**.

- **Oracle Cloud** :
  - **Oracle Monitoring** et **VCN Flow Logs** : Pour la surveillance du réseau sur Oracle Cloud, y compris les **Virtual Cloud Networks** (VCN) et **NAT Gateways**.

### Composants :

- **Prometheus + Grafana** :
  - Pour la gestion des **metrics** de la plupart des composants comme **Kubernetes**, **Traefik**, **Hazelcast**, **Postgres**, **Supabase**, et **Kafka**. Cette combinaison est idéale pour avoir une vue centralisée sur tes **composants** et s'intègre avec la plupart des services que tu utilises.
  
- **Kubernetes Dashboard + Metric Server** :
  - Pour un suivi **minimaliste et simple** des **microservices**, de **Kubernetes**, et de l’utilisation des ressources des pods et nodes.

- **Traefik Pilot** :
  - Spécifique à **Traefik** pour une solution de monitoring externe et légère, sans configuration complexe.

- **Auth0** :
  - Pour la gestion de l’authentification et la sécurisation des accès aux API exposées, avec des **dashboards intégrés** pour la gestion des utilisateurs et des permissions.

## Conclusion

Cette architecture met en place une infrastructure...
"""

---

## Retour à la [section Architecture](index.md)
