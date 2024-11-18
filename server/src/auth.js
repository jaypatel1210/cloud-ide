import config from './config.js';
import verifyFirebaseToken from './middleware/verify-token.js';

function registerAuthRoutes(app) {
  app.post('/set-cookie', (req, res) => {
    const { idToken } = req.body;

    // TODO: createSessionCookie
    if (idToken) {
      res.cookie('authToken', idToken, {
        httpOnly: true,
        secure: true,
        maxAge: config.COOKIE_MAX_AGE,
        sameSite: 'strict',
      });
      res.status(200).send({ message: 'Token stored in cookie.' });
    } else {
      res.status(400).send({ error: 'No token provided.' });
    }
  });

  app.post('/signout', (req, res) => {
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.status(200).send({ message: 'Signed out successfully.' });
  });

  app.post('/me', verifyFirebaseToken, (req, res) => {
    res.status(200).send({
      message: 'Token is valid.',
      status: 'success',
      user: req.user,
    });
  });
}

export default registerAuthRoutes;
