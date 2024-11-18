import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';

configDotenv();

const SECRET = process.env.SECRET;

function generateToken() {
  return jwt.sign({ service: 'background' }, SECRET, { expiresIn: '1d' });
}

export default generateToken;
