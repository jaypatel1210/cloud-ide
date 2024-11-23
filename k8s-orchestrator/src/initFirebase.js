import { configDotenv } from 'dotenv';
import admin from 'firebase-admin';

configDotenv();

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
