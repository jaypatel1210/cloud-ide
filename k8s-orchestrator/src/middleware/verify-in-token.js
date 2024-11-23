import jwt from 'jsonwebtoken';

const SECRET = process.env.SECRET;

async function verifyInternalToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET);

      if (decoded.service === 'background') {
        next();
      } else {
        res.status(403).send('Forbidden');
      }
    } catch (error) {
      console.error('Error verifying Firebase token:', error);
      return res.status(403).send('Unauthorized access.');
    }
  } else {
    return res.status(403).send('Auth token missing.');
  }
}

export default verifyInternalToken;
