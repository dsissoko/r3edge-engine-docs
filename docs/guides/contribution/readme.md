# Guide de Contribution

Bienvenue dans la section de contribution du projet [Nom du Projet] ! Nous sommes heureux de recevoir vos contributions et nous vous encourageons à suivre ces bonnes pratiques afin de maintenir un code de qualité et un processus de développement fluide pour tous.

## Processus de Contribution

Pour contribuer au projet, veuillez suivre les étapes suivantes :

1. **Forker le Repository** : Créez un fork de ce projet en cliquant sur le bouton "Fork" en haut à droite de la page GitHub.
   
2. **Cloner le Fork** : Clonez votre fork sur votre machine locale.

   git clone https://github.com/votre-nom-utilisateur/[nom-du-repo].git

3. **Créer une Branche** : Créez une nouvelle branche pour y apporter vos modifications. Choisissez un nom de branche descriptif.

   git checkout -b feature/ajout-nouvelle-fonctionnalite

4. **Apporter les Modifications** : Effectuez vos modifications sur cette nouvelle branche.

5. **Committer vos Changements** : Assurez-vous de respecter les **normes de commit** décrites ci-dessous.

6. **Pousser la Branche** : Poussez votre branche sur votre fork.

   git push origin feature/ajout-nouvelle-fonctionnalite

7. **Créer une Pull Request (PR)** : Une fois que vous avez poussé vos modifications, créez une pull request (PR) depuis votre branche vers la branche `main` du projet principal.
   - Donnez un titre descriptif à votre PR.
   - Ajoutez une description claire des changements apportés, ainsi que tout contexte ou discussion pertinente.

8. **Revues de Code** : Attendez la revue de vos modifications par l'équipe. Répondez aux commentaires et effectuez les modifications si nécessaire.

---

## Bonnes Pratiques Git

### 1. Utilisation des Pull Requests
- **Proposer des Modifications** : Utilisez les pull requests pour proposer des modifications. N'effectuez pas de commit directement sur la branche `main`.
- **Description Claire** : Donnez toujours une description claire à votre PR. Mentionnez les problèmes ou fonctionnalités qu'elle résout.
- **Discussion** : Utilisez la section commentaires pour discuter des changements avec les autres membres de l'équipe.

### 2. Normes de Commit
Nous suivons une convention stricte pour les messages de commit afin de maintenir un historique de commits clair, facile à comprendre et à naviguer. Voici les principaux types de commits utilisés dans ce projet, avec des exemples :

- **feat** : Utilisé lorsque vous ajoutez une **nouvelle fonctionnalité** au projet.
  - Exemple :  
    `feat: ajouter une nouvelle fonctionnalité de recherche`
  
- **fix** : Utilisé lorsque vous **corrigez un bug**.
  - Exemple :  
    `fix: corriger le bug de la pagination`
  
- **docs** : Utilisé pour les changements concernant uniquement la **documentation**.
  - Exemple :  
    `docs: mettre à jour la documentation des API`
  
- **style** : Utilisé pour des modifications de **style** de code (espacement, indentation, etc.) qui n'affectent pas le fonctionnement du code.
  - Exemple :  
    `style: corriger l'indentation dans le fichier CSS`
  
- **refactor** : Utilisé pour les **refactorisations** de code sans ajout de nouvelles fonctionnalités ni correction de bugs.
  - Exemple :  
    `refactor: refactorer la gestion des événements`
  
- **test** : Utilisé pour ajouter ou modifier des **tests**.
  - Exemple :  
    `test: ajouter des tests unitaires pour la validation des formulaires`
  
- **chore** : Utilisé pour des tâches de maintenance qui n'affectent ni le code source ni les tests (par exemple, mise à jour des dépendances).
  - Exemple :  
    `chore: mettre à jour les dépendances du projet`

### Règles supplémentaires :
- **Un seul commit par tâche** : Chaque commit doit correspondre à une seule tâche (nouvelle fonctionnalité, correction de bug, etc.).
- **Messages clairs et descriptifs** : Le message de commit doit être court mais précis. Il doit clairement décrire ce qui a été fait.
- **Pas de point final** : Il est d'usage de ne pas mettre de point à la fin du message de commit.

---

## Style de Code

- **Normes de Codage** : Veuillez suivre les conventions de style de code définies pour ce projet (documentées dans `guides/contribution/standards-de-codage.md`).
- **Linter** : Utilisez les outils de linter et de formatage fournis par le projet pour assurer une cohérence de style dans tout le code.

---

## Ressources

- [Normes de Codage](standards-de-codage.md)
