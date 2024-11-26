# 🌐 Cloud IDE ([Try it Here!](https://cloud-ide.jaypatel.digital))

The **Cloud IDE** is a powerful, cloud-based development environment designed to provide **isolated, on-demand environments** for secure and efficient remote code execution. Built using **Kubernetes for container orchestration**, it delivers scalability, security, and optimal performance for modern development workflows.

## ✨ Key Features

- **Isolated Environments**: Each project runs in its own Kubernetes pod with restricted permissions, dedicated shell access, and precise resource allocation.  
- **Network Isolation**: Pods operate in isolated networks to prevent port conflicts, ensuring secure and efficient execution.  
- **Dynamic Domain Mapping**: Each project is dynamically assigned a unique domain through ingress and service configurations.  
- **Resource Efficiency**: Unused resources are automatically cleaned up to optimize system performance.  

This architecture is tailored to meet the demands of **modern development workflows**, offering a secure, scalable, and efficient environment for developers.  

---

## 🛠️ Architecture Overview  

### **1. k8s-orchestrator**  
Manages Kubernetes resource allocation and deallocation for each project on demand. Handles dynamic domain mapping to ensure each project is accessible through its unique domain.  

### **2. background**  
A scheduled cron job that runs at specified intervals to clean up unused resources, maintaining system efficiency.  

### **3. server**  
Responsible for project and user management, including authentication and API services for backend operations.  

### **4. executor**  
Each user is provided with an isolated executor pod for remote code execution. Executor pods:  
- Enable real-time code management through a synchronized interface using `socket.io`.  
- Are accessed via dynamically mapped project-specific domains.  

### **5. firefetch**  
Handles the retrieval of project code from Firebase storage when starting a project. Ensures that the IDE environment is preloaded with the user’s codebase.  

### **6. ui**  
A user-friendly frontend designed for a seamless experience. Allows users to manage projects, execute code, and interact with the IDE environment efficiently.  

---
