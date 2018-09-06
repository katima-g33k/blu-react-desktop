/* eslint import/prefer-default-export: 0 */
import crypto from 'crypto';

const algorithm = 'aes-256-ctr';

export const encrypt = (text, secret) => {
  const cipher = crypto.createCipher(algorithm, secret);
  return `${cipher.update(text, 'utf8', 'hex')}${cipher.final('hex')}`;
};
