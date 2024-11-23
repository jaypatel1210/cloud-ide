import k8s from '@kubernetes/client-node';
import fbAdmin from 'firebase-admin';
import verifyInternalToken from './middleware/verify-in-token.js';
import RUNNING_PROJECTS from './temp-store.js';
import k8sOptions from './k8sConfig.js';

const kc = new k8s.KubeConfig();
kc.loadFromOptions(k8sOptions);

// Create Kubernetes clients
const k8sAppsApi = kc.makeApiClient(k8s.AppsV1Api);
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
const k8sNetworkingApi = kc.makeApiClient(k8s.NetworkingV1Api);

const RETRY_LIMIT = 2;
const RETRY_DELAY_MS = 1000;
const NAMESPACE = 'ide-ws';

const db = fbAdmin.firestore();

async function deleteResourceWithRetry(deleteFunction, resourceName) {
  let attempts = 0;
  while (attempts < RETRY_LIMIT) {
    try {
      await deleteFunction(resourceName, NAMESPACE);

      return true;
    } catch (error) {
      attempts++;
      console.error(`Attempt ${attempts} to delete`);

      if (attempts >= RETRY_LIMIT) {
        console.error(
          `Failed to delete ${resourceName} after ${RETRY_LIMIT} attempts`
        );
        return false;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
}

async function deleteResources(projectId) {
  const deploymentName = `${projectId}-ide-deployment`;
  const serviceName = `${projectId}-ide-service`;
  const ingressName = `${projectId}-ide-ingress`;

  // Delete Ingress, Service, and Deployment with retry mechanism
  const ingressDeleted = await deleteResourceWithRetry(
    k8sNetworkingApi.deleteNamespacedIngress.bind(k8sNetworkingApi),
    ingressName
  );
  if (!ingressDeleted) return false;

  const serviceDeleted = await deleteResourceWithRetry(
    k8sApi.deleteNamespacedService.bind(k8sApi),
    serviceName
  );
  if (!serviceDeleted) return false;

  const deploymentDeleted = await deleteResourceWithRetry(
    k8sAppsApi.deleteNamespacedDeployment.bind(k8sAppsApi),
    deploymentName
  );
  if (!deploymentDeleted) return false;

  return true;
}

async function updateFirestoreBatch(deletions) {
  const batch = db.batch();

  deletions.forEach(({ docId }) => {
    const docRef = db.doc(`resources-logs/${docId}`);
    batch.update(docRef, {
      status: 'DESTROYED',
      destroyedOn: new Date(),
    });
  });

  await batch.commit();
}

function registerDeleteResourcesRoute(app) {
  app.delete('/delete-resources', verifyInternalToken, async (req, res) => {
    const projects = req.body.projects;

    if (!Array.isArray(projects) || projects.length === 0) {
      return res.status(400).send({
        message: 'An array of projects is required',
        status: false,
        failedDeletions: [],
      });
    }

    // Process deletions and prepare for batch Firestore update
    const deletions = await Promise.all(
      projects.map(async ({ projectId, docId }) => {
        const success = await deleteResources(projectId);
        if (success) {
          RUNNING_PROJECTS.delete(projectId);
        }
        return { docId, projectId, success };
      })
    );

    // Perform batch update in Firestore
    try {
      await updateFirestoreBatch(deletions);
      const failedDeletions = deletions
        .filter(deletion => !deletion.success)
        .map(deletion => deletion.docId);

      if (failedDeletions.length > 0) {
        res.status(500).json({
          message: 'Failed to delete some resources',
          failedDeletions,
          status: false,
        });
      } else {
        res.status(200).send({
          message: 'All resources deleted and Firestore updated successfully',
          status: true,
          failedDeletions,
        });
      }
    } catch (error) {
      console.error('Error updating Firestore:', error);
      res.status(500).send({
        message: 'Failed to update Firestore',
        status: false,
        failedDeletions: [],
      });
    }
  });
}

export default registerDeleteResourcesRoute;
