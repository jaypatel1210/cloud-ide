import express from 'express';
import { configDotenv } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import './initFirebase.js';
import registerAuthRoutes from './auth.js';
import registerUserRoutes from './user.js';
import registerProjectRoutes from './projects.js';

configDotenv();

const port = process.env.PORT || 4000;

const app = express();
app.use(
  cors({
    origin: 'http://localhost:5173', // TODO: change with actual frontend URL
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.status(200).send('Server is running');
});

registerAuthRoutes(app);
registerUserRoutes(app);
registerProjectRoutes(app);

app.get('/', (req, res) => {
  res.status(200).send(new Date().toLocaleString());
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
