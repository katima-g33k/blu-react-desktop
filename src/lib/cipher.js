import crypto from 'crypto';

import settings from '../settings';

const algorithm = 'aes-256-ctr';
const secretKey = settings.secretKey;

export const encrypt = (text) => {
  const cipher = crypto.createCipher(algorithm, secretKey);
  return `${cipher.update(text, 'utf8', 'hex')}${cipher.final('hex')}`;
};
