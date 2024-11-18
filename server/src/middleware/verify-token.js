import admin from 'firebase-admin';

async function verifyFirebaseToken(req, res, next) {
  const idToken = req.cookies.authToken;

  if (idToken) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = {
        ...decodedToken,
        displayName: decodedToken.name,
        photoURL: decodedToken.picture,
      };

      next();
    } catch (error) {
      console.error('Error verifying Firebase token:', error);
      return res.status(403).send('Unauthorized access.');
    }
  } else {
    return res.status(403).send('authToken token missing.');
  }
}

export default verifyFirebaseToken;
