import express from 'express';
import { configDotenv } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import './initFirebase.js';
import registerStartResourcesRoute from './startResources.js';
import registerDeleteResourcesRoute from './deleteResources.js';

configDotenv();

const port = process.env.PORT || 4050;

const app = express();
app.use(
  cors({
    origin: 'https://cloud-ide.jaypatel.digital',
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.status(200).send('Server is running');
});

registerStartResourcesRoute(app);
registerDeleteResourcesRoute(app);

app.get('/', (req, res) => {
  res.status(200).send(new Date().toLocaleString());
});

app.listen(port, () => {
  console.log(`User service running on http://localhost:${port}`);
});
