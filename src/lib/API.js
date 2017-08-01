import APIClient from './APIClient/APIClient';
import settings from './Settings';

export default new APIClient(settings.apiUrl, settings.apiKey);
