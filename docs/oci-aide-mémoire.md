# Aide-Mémoire des Commandes OCI

## Liste des Shapes Disponibles

```bash
oci compute shape list --compartment-id ocid1.tenancy.oc1..aaaaaaaaxizvsstteubgtb6flvk6b3smudd2srzpzyuyv2cocvtzctxo5lba --region us-chicago-1 --all
```

---

## Liste des Images Disponibles

```bash
oci compute image list --compartment-id ocid1.tenancy.oc1..aaaaaaaaxizvsstteubgtb6flvk6b3smudd2srzpzyuyv2cocvtzctxo5lba --region us-chicago-1 --all
```

---

## Liste des Services

```bash
oci limits service list --compartment-id ocid1.tenancy.oc1..aaaaaaaaxizvsstteubgtb6flvk6b3smudd2srzpzyuyv2cocvtzctxo5lba --region us-chicago-1
```

---

## Vérification des Shapes Always Free

```bash
oci compute shape list --compartment-id ocid1.tenancy.oc1..aaaaaaaaxizvsstteubgtb6flvk6b3smudd2srzpzyuyv2cocvtzctxo5lba --region us-chicago-1 --all | grep AlwaysFree
```

---

## Vérification des Limites pour un Shape

```bash
oci limits resource-availability get --compartment-id ocid1.tenancy.oc1..aaaaaaaaxizvsstteubgtb6flvk6b3smudd2srzpzyuyv2cocvtzctxo5lba --service-name compute --limit-name standard-a1-core-count --region us-chicago-1 --availability-domain "iNRL:US-CHICAGO-1-AD-1"
```
