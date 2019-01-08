/* eslint import/prefer-default-export: 0 */
import { DIRNAME } from '../constants';

export const getAssetPath = filename => `${DIRNAME === '/' ? '' : `${DIRNAME}/`}../../assets/images/${filename}`;
