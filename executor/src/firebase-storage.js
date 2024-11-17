const admin = require('firebase-admin');
const { Readable } = require('stream');

require('dotenv').config();

const decodedFBPrivateKey = Buffer.from(
  process.env.FIREBASE_PRIVATE_KEY,
  'base64'
).toString('utf-8');

const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL || '';
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || '';
const FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET || '';
const FIREBASE_PRIVATE_KEY = decodedFBPrivateKey || '';

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    clientEmail: FIREBASE_CLIENT_EMAIL,
    privateKey: FIREBASE_PRIVATE_KEY,
    projectId: FIREBASE_PROJECT_ID,
  }),
  storageBucket: FIREBASE_STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();

// TODO: prevent node_modules/libs from being uploaded
async function saveToFBS(projectID, filePath, fileContent) {
  try {
    const destination = `code/${projectID}/${filePath}`;
    const contentType = 'auto';

    const file = bucket.file(destination);

    const contentStream = new Readable();
    contentStream.push(fileContent);
    contentStream.push(null);

    await new Promise((resolve, reject) => {
      contentStream
        .pipe(
          file.createWriteStream({
            metadata: { contentType },
            resumable: false,
          })
        )
        .on('error', error => {
          console.error('Error uploading file', { error, filePath });
          reject(error);
        })
        .on('finish', () => {
          resolve();
        });
    });

    return true;
  } catch (error) {
    console.error('Error in updateFileOnFirebaseStorage', { error, filePath });
    return false;
  }
}

module.exports = { saveToFBS };
