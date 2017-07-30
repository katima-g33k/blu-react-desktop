import crypto from 'crypto';

import settings from '../settings';

const algorithm = 'aes-256-ctr';
const salt = settings.salt;
const cipher = crypto.createCipher(algorithm, salt);

export const encrypt = text => `${cipher.update(text, 'utf8', 'hex')}${cipher.final('hex')}`;
