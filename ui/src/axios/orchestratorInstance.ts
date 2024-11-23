import axios from 'axios';

const orchestratorInstance = axios.create({
  baseURL: import.meta.env.VITE_ORCHESTRATOR_URL,
  withCredentials: true,
});

export default orchestratorInstance;
