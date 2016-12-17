import request from 'request';

const API_BASE_URL = 'http://localhost/blu-api/';
const API_KEY = '8ecf71749e3a5a5f02d585943e81849f';

const HTTP = {
  call: (method, url, data, callback) => {
    const params = url.replace(API_BASE_URL, '').split('/');
    const req = {
      data,
      object: params[0],
      function: params[1],
      'api-key': API_KEY,
    };

    request[method.toLowerCase()](`${API_BASE_URL}index.php?req=${JSON.stringify(req)}`, (err, res, body) => {
      if (err) {
        callback(err);
      } else {
        const responseData = JSON.parse(`{${body.split('}{')[1]}`).data;
        callback(null, responseData);
      }
    });
  },

  get: (url, data, callback) => {
    HTTP.call('GET', url, data, (err, res) => {
      callback(err, res);
    });
  },

  post: (url, data, callback) => {
    HTTP.call('POST', url, data, (err, res) => {
      callback(err, res);
    });
  },
};

export default HTTP;
