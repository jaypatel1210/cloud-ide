const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const stream = require('stream');
const pipelineAsync = promisify(stream.pipeline);

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const decodedFBPrivateKey = Buffer.from(
  process.env.FIREBASE_PRIVATE_KEY,
  'base64'
).toString('utf-8');

const FIREBASE_CONFIG = {
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: decodedFBPrivateKey,
  }),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
};

const MAX_CONCURRENT_DOWNLOADS = 5;
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second

if (!admin.apps.length) {
  admin.initializeApp(FIREBASE_CONFIG);
}
const bucket = admin.storage().bucket();

async function downloadFile(file, localPath) {
  await promisify(fs.mkdir)(path.dirname(localPath), { recursive: true });

  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
    try {
      await pipelineAsync(
        file.createReadStream(),
        fs.createWriteStream(localPath)
      );
      console.log(`Downloaded: ${file.name}`);
      return;
    } catch (error) {
      if (attempt === RETRY_ATTEMPTS) {
        throw error;
      }
      console.warn(`Retry ${attempt}/${RETRY_ATTEMPTS} for ${file.name}`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
}

async function downloadRecursively(remoteDir, localDir) {
  console.log(`Starting download from ${remoteDir} to ${localDir}`);
  let totalFiles = 0;
  let downloadedFiles = 0;

  const downloadQueue = [];

  return new Promise((resolve, reject) => {
    const stream = bucket.getFilesStream({ prefix: remoteDir });

    stream.on('data', async file => {
      if (file.name.endsWith('/')) return; // Skip directories

      totalFiles++;
      const relativePath = path.relative(remoteDir, file.name);
      const localPath = path.join(localDir, relativePath);

      downloadQueue.push(async () => {
        try {
          await downloadFile(file, localPath);
          downloadedFiles++;
          console.log(`Progress: ${downloadedFiles}/${totalFiles} files`);
        } catch (error) {
          console.error(`Error downloading ${file.name}:`, error);
        }
      });

      if (downloadQueue.length >= MAX_CONCURRENT_DOWNLOADS) {
        stream.pause();
        await Promise.all(
          downloadQueue.splice(0, MAX_CONCURRENT_DOWNLOADS).map(fn => fn())
        );
        stream.resume();
      }
    });

    stream.on('error', error => {
      console.error('Error in file stream:', error);
      reject(error);
    });

    stream.on('end', async () => {
      // Process any remaining downloads
      while (downloadQueue.length > 0) {
        await Promise.all(
          downloadQueue.splice(0, MAX_CONCURRENT_DOWNLOADS).map(fn => fn())
        );
      }
      console.log(
        `Finished downloading ${downloadedFiles}/${totalFiles} files`
      );
      resolve();
    });
  });
}

async function downloadFromFirebase(remoteDir, localDir) {
  try {
    console.time('Download Duration');
    await downloadRecursively(remoteDir, localDir);
    console.timeEnd('Download Duration');
  } catch (error) {
    console.error('Error in download process:', error);
  } finally {
    admin.app().delete(); // Clean up Firebase app
  }
}
