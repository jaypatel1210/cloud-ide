import { configDotenv } from 'dotenv';

import './initFirebase.js';
import startCronJob from './cron.js';

configDotenv();

startCronJob();
