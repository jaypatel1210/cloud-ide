import fbAdmin from 'firebase-admin';
import cron from 'node-cron';
import path from 'path';
import winston from 'winston';
import axios from 'axios';
import generateToken from './utils/generateToken.js';

const __dirname = import.meta.dirname;
const logDirectory = path.join(__dirname, 'logs');
let token = generateToken();

const db = fbAdmin.firestore();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    // new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(logDirectory, 'background-service.log'),
    }),
  ],
});

async function destroyInactiveRecords() {
  const now = new Date();

  try {
    logger.info(`Run destroyInactiveRecords On: ${new Date()}`);

    const snapshot = await db
      .collection('resources-logs')
      .where('status', '==', 'RUNNING')
      .get();

    if (snapshot.empty) {
      logger.info('No inactive records found.');
      return;
    }

    const projects = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();

      const referenceDate = data.lastRequestOn ?? data.createdOn;
      const date1 = referenceDate.toDate();
      const differenceInMinutes = (now - date1) / (1000 * 60);

      // if inactive for more than 30 minutes, destroy the resources
      if (differenceInMinutes > 30) {
        projects.push({
          projectId: data.projectId,
          docId: doc.id,
        });
      }
    }

    if (projects.length > 0) {
      const result = await axios.delete(
        `${process.env.K8S_ORCHESTRATOR_URL}/delete-resources`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          data: { projects },
        }
      );

      logger.info(
        `Destroy Resources Result:  message: ${result.data.message}, failed: ${result.data.failedDeletions}`
      );
    }
  } catch (error) {
    logger.error(
      'Error while checking and destroying inactive records:',
      error
    );
  }
}

async function startCronJob() {
  cron.schedule('*/30 * * * *', () => {
    logger.info(`Cron job scheduled */30 * * * * at ${new Date()}`);
    destroyInactiveRecords();
  });
  cron.schedule('0 */23 * * *', () => {
    token = generateToken();
  });
}

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info(`Background service Shut down at ${new Date()}`);
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info(`Background service terminated at ${new Date()}`);
  process.exit(0);
});

export default startCronJob;
