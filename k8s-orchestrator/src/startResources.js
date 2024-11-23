import k8s from '@kubernetes/client-node';
import { configDotenv } from 'dotenv';
import fbAdmin from 'firebase-admin';
import verifyFirebaseToken from './middleware/verify-fb-token.js';
import RUNNING_PROJECTS from './temp-store.js';
import k8sOptions from './k8sConfig.js';
configDotenv();
const kc = new k8s.KubeConfig();
kc.loadFromOptions(k8sOptions);

// kc.loadFromFile(process.env.K8S_CONFIG_FILE);

// Create Kubernetes clients
const k8sAppsApi = kc.makeApiClient(k8s.AppsV1Api);
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
const k8sNetworkingApi = kc.makeApiClient(k8s.NetworkingV1Api);

const namespace = 'ide-ws';

const db = fbAdmin.firestore();

async function createDeployment(projectId) {
  const deploymentName = `${projectId}-ide-deployment`;

  const deploymentManifest = {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
      name: deploymentName,
      labels: {
        app: deploymentName, // Label to match with the Service
      },
    },
    spec: {
      replicas: 1,
      selector: {
        matchLabels: {
          app: deploymentName,
        },
      },
      template: {
        metadata: {
          labels: {
            app: deploymentName,
          },
        },
        spec: {
          initContainers: [
            {
              name: 'firefetcher',
              image: 'jaypatel1210/firefetch:7b6a3a6',
              env: [
                {
                  name: 'LOCALDIR',
                  value: '/wsdata',
                },
                {
                  name: 'PROJECTID',
                  value: `code/${projectId.replace('-', '_')}`,
                },
                {
                  name: 'FIREBASE_STORAGE_BUCKET',
                  value: process.env.FIREBASE_STORAGE_BUCKET,
                },
                {
                  name: 'FIREBASE_PROJECT_ID',
                  value: process.env.FIREBASE_PROJECT_ID,
                },
                {
                  name: 'FIREBASE_CLIENT_EMAIL',
                  value: process.env.FIREBASE_CLIENT_EMAIL,
                },
                {
                  name: 'FIREBASE_PRIVATE_KEY',
                  value: process.env.FIREBASE_PRIVATE_KEY,
                },
              ],
              volumeMounts: [
                {
                  name: 'data-volume',
                  mountPath: '/wsdata',
                },
              ],
            },
          ],
          containers: [
            {
              name: 'besudoterminal',
              image: 'jaypatel1210/cloud-ide-executor:latest',
              env: [
                {
                  name: 'PORT',
                  value: '5050',
                },
                {
                  name: 'FIREBASE_STORAGE_BUCKET',
                  value: process.env.FIREBASE_STORAGE_BUCKET,
                },
                {
                  name: 'FIREBASE_PROJECT_ID',
                  value: process.env.FIREBASE_PROJECT_ID,
                },
                {
                  name: 'FIREBASE_CLIENT_EMAIL',
                  value: process.env.FIREBASE_CLIENT_EMAIL,
                },
                {
                  name: 'FIREBASE_PRIVATE_KEY',
                  value: process.env.FIREBASE_PRIVATE_KEY,
                },
              ],
              volumeMounts: [
                {
                  name: 'data-volume',
                  mountPath: '/wsdata',
                },
              ],
            },
          ],

          // Shared volume between firefetcher and besudoterminal
          volumes: [
            {
              name: 'data-volume',
              emptyDir: {}, // Temporary in-memory volume
            },
          ],
        },
      },
    },
  };

  return await k8sAppsApi.createNamespacedDeployment(
    namespace,
    deploymentManifest
  );
}

async function createService(projectId) {
  const serviceName = `${projectId}-ide-service`;

  const serviceManifest = {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      name: serviceName,
    },
    spec: {
      selector: { app: `${projectId}-ide-deployment` },
      ports: [
        {
          protocol: 'TCP',
          port: 80, // Internal service port
          targetPort: 5050, // Target port for besudoterminal container
        },
      ],
      type: 'ClusterIP', // Internal service
    },
  };

  return await k8sApi.createNamespacedService(namespace, serviceManifest);
}

async function createIngress(projectId) {
  const ingressName = `${projectId}-ide-ingress`;
  const serviceName = `${projectId}-ide-service`;

  const host = `${projectId}.jaypatel.live`;

  const ingressManifest = {
    apiVersion: 'networking.k8s.io/v1',
    kind: 'Ingress',
    metadata: {
      name: ingressName,
      annotations: {
        'nginx.ingress.kubernetes.io/rewrite-target': '/',
      },
    },
    spec: {
      ingressClassName: 'nginx',

      rules: [
        {
          host: host, // User's subdomain
          http: {
            paths: [
              {
                path: '/',
                pathType: 'Prefix',
                backend: {
                  service: {
                    name: serviceName,
                    port: { number: 80 }, // Service port
                  },
                },
              },
            ],
          },
        },
      ],
    },
  };

  return await k8sNetworkingApi.createNamespacedIngress(
    namespace,
    ingressManifest
  );
}

async function checkHealthRoute(projectId) {
  const url = `https://${projectId}.jaypatel.live/health`;
  const maxRetries = 8;
  let retries = 0;
  const delay = 1000 * 2;

  while (retries < maxRetries) {
    try {
      const response = await fetch(url);
      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      console.log(`Health check failed, retrying...`, url);
    }
    retries++;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  return false;
}

async function registerStartResourcesRoute(app) {
  app.post('/start-resources', verifyFirebaseToken, async (req, res) => {
    let projectId = req.body.projectId;

    // TODO: handle Authorization to check is user accessing their project only

    if (!projectId) {
      return res.status(400).send('projectId is required');
    }
    projectId = projectId.replace('_', '-');

    if (RUNNING_PROJECTS.get(projectId)) {
      return res.status(200).send({
        projectId,
        url: `wss://${projectId}.jaypatel.live`,
        message: 'Resources already running',
        resourceId: RUNNING_PROJECTS.get(projectId).resourceId,
      });
    }

    try {
      await createDeployment(projectId);
    } catch (error) {
      console.error(`Failed to create deployment:`, error.response.body);

      return res.status(500).send({
        message: 'Failed to create deployment',
      });
    }

    try {
      await createService(projectId);
    } catch (error) {
      console.error(`Failed to create service:`, error.response.body);
      // TODO: rollback deployment
      return res.status(500).send({
        message: 'Failed to create service',
      });
    }

    try {
      await createIngress(projectId);
    } catch (error) {
      console.error(`Failed to create ingress:`, error.response.body);

      // TODO: rollback deployment and service
      return res.status(500).send({
        message: 'Failed to create ingress',
      });
    }

    // TODO: move health check to frontend
    const isServiceHealthy = await checkHealthRoute(projectId);
    if (!isServiceHealthy) {
      return res.status(500).send({
        projectId,
        url: `wss://${projectId.replace('_', '-')}.jaypatel.live`,
        message: 'Service is not healthy',
      });
    }

    const docRef = db.collection('resources-logs').doc();
    try {
      await docRef.set({
        projectId,
        url: `wss://${projectId}.jaypatel.live`,
        createdOn: new Date(),
        destroyedOn: null,
        lastRequestOn: null,
        status: 'RUNNING',
        id: docRef.id,
        uid: req.user.uid,
      });
    } catch (error) {
      console.error('Failed to create Firestore log');
    }

    RUNNING_PROJECTS.set(projectId, {
      projectId,
      url: `wss://${projectId}.jaypatel.live`,
      startTime: new Date(),
      resourceId: docRef.id,
    });

    res.status(200).send({
      projectId,
      url: `wss://${projectId.replace('_', '-')}.jaypatel.live`,
      message: 'Resources created successfully',
      resourceId: docRef.id,
    });
  });
}

export default registerStartResourcesRoute;
