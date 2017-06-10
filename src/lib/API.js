import APIClient from './APIClient/APIClient';
import settings from '../settings';

export default new APIClient(settings.apiUrl, settings.apiKey);
