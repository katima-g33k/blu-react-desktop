/* eslint import/prefer-default-export: 0 */
import { browserHistory } from 'react-router';

export const canChangeLocation = () => !browserHistory.getCurrentLocation().pathname.match(/add|edit|copies|settings/);
