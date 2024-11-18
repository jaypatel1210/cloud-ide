import admin from 'firebase-admin';

// const decodedFBPrivateKey = Buffer.from(
//   process.env.FIREBASE_PRIVATE_KEY,
//   'base64'
// ).toString('utf-8');

// const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL || '';
// const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || '';
// const FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET || '';
// const FIREBASE_PRIVATE_KEY = decodedFBPrivateKey || '';

// // Initialize Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert({
//     clientEmail: FIREBASE_CLIENT_EMAIL,
//     privateKey: FIREBASE_PRIVATE_KEY,
//     projectId: FIREBASE_PROJECT_ID,
//   }),
//   storageBucket: FIREBASE_STORAGE_BUCKET,
// });

const bucket = admin.storage().bucket();

async function copyBaseCode(baseFolder, targetFolder) {
  try {
    // Get the list of files in the base folder
    const [files] = await bucket.getFiles({ prefix: baseFolder });

    if (files.length === 0) {
      return {
        success: false,
        statusCode: 500,
        message: 'No files found in the specified project folder.',
      };
    }

    // Loop through each file and copy it to the new folder under 'code'
    const copyOperations = files.map(async file => {
      const sourceFilePath = file.name;
      const destinationFilePath = sourceFilePath.replace(
        baseFolder,
        targetFolder
      );

      await bucket.file(sourceFilePath).copy(bucket.file(destinationFilePath));
    });

    // Execute all copy operations
    await Promise.all(copyOperations);

    return true;
  } catch (error) {
    console.error('Error copying project code:', error);
  }
}

export default copyBaseCode;
