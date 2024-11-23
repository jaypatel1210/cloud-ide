# Kubernetes Configuration and NGINX Ingress Controller Setup

## 1. Get Your Kubernetes Config File

### For DigitalOcean:

Run the following command to save your Kubernetes configuration file:

```bash
doctl kubernetes cluster kubeconfig save <cluster-id>
```

### Set the `KUBECONFIG` Environment Variable

After saving the Kubernetes config file, ensure the `KUBECONFIG` environment variable is set properly.

---

## 2. Setup NGINX Ingress Controller

### Using Helm

To install the NGINX Ingress Controller using Helm, execute:

```bash
helm install nginx-ingress ingress-nginx/ingress-nginx  --namespace ingress-nginx  --create-namespace
```

---

### Using Kubectl

Alternatively, you can install the NGINX Ingress Controller using Kubectl:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
```

---
