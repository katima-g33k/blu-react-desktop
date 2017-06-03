import request from 'request';
import settings from '../settings.json';

const API_BASE_URL = settings.apiUrl;
const API_KEY = settings.apiKey;

const HTTP = {
  call: (method, url, data, callback = () => {}) => {
    const params = url.replace(API_BASE_URL, '').split('/');
    const req = {
      data,
      object: params[0],
      function: params[1],
      'api-key': API_KEY,
    };

    const apiURL = `${API_BASE_URL}index.php?req=${JSON.stringify(req)}`;
    const allowedHeaders = [
      'Origin',
      'X-Authorization',
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Origin',
    ];
    const options = {
      url: apiURL,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': allowedHeaders.join(', '),
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json',
      },
    };
    request[method.toLowerCase()](options, (err, res, body) => {
      try {
        callback(err, err ? null : JSON.parse(body).data);
      } catch (e) {
        callback({ code: 500, message: body });
      }
    });
  },

  get: (url, data, callback = () => {}) => {
    HTTP.call('GET', url, data, (err, res) => {
      callback(err, res);
    });
  },

  post: (url, data, callback = () => {}) => {
    HTTP.call('POST', url, data, (err, res) => {
      callback(err, res);
    });
  },
};

export default HTTP;
