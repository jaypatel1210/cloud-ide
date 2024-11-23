# Kubernetes Commands

## 1. Delete All Deployments, Services, and Ingresses in a Namespace

To delete all Deployments, Services, and Ingress resources in a specific namespace, run the following commands:

```bash
kubectl delete deployment --all -n <namespace>
kubectl delete svc --all -n <namespace>
kubectl delete ingress --all -n <namespace>
```

---

## 2. Create a Namespace

To create a new namespace, use the following command:

```bash
kubectl create namespace <namespace>
```

---

## 3. Get All Resources in a Namespace

To retrieve all resources in a specific namespace, execute:

```bash
kubectl get all -n <namespace>
```

---
