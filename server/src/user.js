import admin from 'firebase-admin';
import { addRecord } from './utils/firestore-db.js';

function registerUserRoutes(app) {
  app.post('/create-user', async (req, res) => {
    const {
      uid,
      name,
      email,
      phoneNumber,
      loginProvider,
      verified,
      image_url,
      idToken,
    } = req.body;

    const user = {
      uid,
      name,
      email,
      phoneNumber,
      loginProvider,
      verified,
      image_url,

      status: 'ACTIVE',
      created: new Date(),
      preferences: {},
      metadata: '',
    };

    try {
      await addRecord('users', user, uid);
      const decodedToken = await admin.auth().verifyIdToken(idToken);

      res.status(201).send({
        user: decodedToken,
        message: 'User created successfully.',
      });
      admin.auth().setCustomUserClaims(uid, { existingUser: true });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).send('Error creating user.');
    }
  });
}

export default registerUserRoutes;
