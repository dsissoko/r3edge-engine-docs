# Quickstart Pulumi pour Oracle Cloud Infrastructure (OCI)

## **Prérequis**
- Python installé (version 3.7+).
- Pulumi installé et fonctionnel (pulumi version).

---

## **Étape 1 : Vérification des prérequis**

1. Vérifie Python :
```bash
   python3 --version  
```
   Résultat attendu : Python 3.x.x

2. Vérifie Pulumi :
```bash
   pulumi version  
```
   Résultat attendu : v3.x.x

---

## **Étape 2 : Configuration de l'environnement Pulumi**

1. Créer un dossier pour le projet :
```bash
   mkdir pulumi-oci-quickstart  
   cd pulumi-oci-quickstart
```

2. Créer un fichier requirements.txt :
```bash
   pulumi  
   pulumi-oci
```

3. Initialiser un environnement Python :
   - Créer un environnement virtuel :  
```bash
     python3 -m venv venv  
     source venv/bin/activate
```
   - Installer les dépendances :  
```bash
     pip install -r requirements.txt
```

4. Créer le fichier Pulumi.yaml :
```yaml
   name: pulumi-oci-quickstart  
   runtime:  
     name: python  
     options:  
       virtualenv: venv  
   description: Pulumi Quickstart for OCI
```
5. Configurer Pulumi pour le backend local :
```bash  
   pulumi login --local
```
---

## **Étape 3 : Configurer le projet Pulumi**

1. Initialiser une stack dev :
```bash
   pulumi stack init dev
```
   Ne pas oublier votre pass phrase si vous en saisissez une



2. Ajouter la région OCI à la stack :
```bash
   pulumi config set oci:region us-chicago-1
```
---

### Optimisation : Éviter les saisies répétées

Pour éviter de saisir la passphrase Pulumi ou de choisir une stack manuellement à chaque commande, voici comment optimiser votre environnement :

1. **Configurer la passphrase Pulumi**  
   - **Option 1 : Définir une variable d’environnement**  
     export PULUMI_CONFIG_PASSPHRASE="votre-passphrase"  
     Ajoutez cette commande dans votre fichier `~/.bashrc` ou `~/.zshrc` pour qu’elle soit persistante.

   - **Option 2 : Utiliser un fichier sécurisé pour la passphrase**  
     Créez un fichier contenant la passphrase :  
     echo "votre-passphrase" > ~/.pulumi-passphrase  
     chmod 600 ~/.pulumi-passphrase  
     export PULUMI_CONFIG_PASSPHRASE_FILE="~/.pulumi-passphrase"

2. **Sélectionner une stack par défaut**  
   - Sélectionnez la stack souhaitée pour éviter de la choisir à chaque commande :  
     pulumi stack select dev

   - Rendre cela automatique avec un alias (facultatif) :  
     alias pulumi="pulumi stack select dev && pulumi"  
     Ajoutez cet alias à votre fichier `~/.bashrc` ou équivalent.


## **Étape 4 : Installer et configurer OCI CLI**

1. Installer OCI CLI :  
```bash
   bash -c "$(curl -L https://raw.githubusercontent.com/oracle/oci-cli/master/scripts/install/install.sh)"
```
2. Configurer OCI CLI :  
   oci setup config  
   Fournir les informations suivantes :  
   - User OCID  
   - Tenant OCID  
   - Région (ex. : eu-frankfurt-1)

3. créer la clé privée: surtout ne pas générer de pass phrase car Pulumi ne sait pas gérer si une pass phrase est créée. voir https://docs.oracle.com/fr-fr/iaas/Content/API/Concepts/apisigningkey.htm#three

4. Uploader la clé publique :  
   Ajouter la clé publique générée (~/.oci/oci_api_key_public.pem) dans la console OCI, dans Identity & Security > Users > API Keys.

---

## **Étape 5 : Ajouter une ressource dans Pulumi**

1. Créer le fichier __main__.py :
```python
   import pulumi  
   from pulumi_oci.core import Vcn  
```
   # Créer un Virtual Cloud Network (VCN)  
```python
   vcn = Vcn(  
       "example-vcn",  
       cidr_block="10.0.0.0/16",  
       display_name="ExampleVCN",  
   )  
```
   # Exporter les informations du VCN  
```python
   pulumi.export("vcn_id", vcn.id)  
   pulumi.export("vcn_cidr", vcn.cidr_block)
```
2. Tester le déploiement :  
   - Aperçu des changements :  
```bash
     pulumi preview  
```
   - Appliquer les changements :  
```bash
     pulumi up
```
---

## **Étape 6 : Nettoyage**

- Détruire les ressources créées :
```bash
  pulumi destroy
```
- Supprimer la stack si nécessaire :  
```bash
  pulumi stack rm dev
```
---

## **Structure finale des fichiers**

pulumi-oci-quickstart/  
├── Pulumi.yaml  
├── Pulumi.dev.yaml  
├── requirements.txt  
├── venv/  # Environnement Python  
└── __main__.py

---

## **Extensions possibles**
- Ajout d’un sous-réseau (Subnet) au VCN.
- Création d’une instance de calcul (Instance).
- Configuration de règles de sécurité (Security Lists).
