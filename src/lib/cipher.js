import crypto from 'crypto';

import settings from '../settings';

const algorithm = 'aes-256-ctr';
const secretKey = settings.secretKey;
const cipher = crypto.createCipher(algorithm, secretKey);

export const encrypt = text => `${cipher.update(text, 'utf8', 'hex')}${cipher.final('hex')}`;
