import { configDotenv } from 'dotenv';

configDotenv();

const k8sOptions = {
  clusters: [
    {
      name: process.env.K8S_CLUSTER_NAME,
      server: process.env.K8S_CLUSTER_SERVER,
      caData: process.env.K8S_CLUSTER_CADATA,
    },
  ],
  contexts: [
    {
      cluster: process.env.K8S_CONTEXT_CLUSTER,
      name: process.env.K8S_CONTEXT_NAME,
      user: process.env.K8S_CONTEXT_USER,
    },
  ],
  users: [
    {
      name: process.env.K8S_USER_NAME,
      token: process.env.K8S_USER_TOKEN,
    },
  ],
  currentContext: process.env.K8S_CURRENT_CONTEXT,
};

export default k8sOptions;
