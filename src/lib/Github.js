import request from 'request';

const apiUrl = 'https://api.github.com';
const apiCall = (url, headers) => new Promise((resolve, reject) => {
  request(url, { headers }, (err, res) => {
    if (err) {
      reject(err);
      return;
    }

    try {
      resolve(JSON.parse(res.body));
    } catch (error) {
      resolve(res.body);
    }
  });
});

const Github = {
  repos: {
    releases: {
      getAssets: (owner, repo, assetId) => apiCall(`${apiUrl}/repos/${owner}/${repo}/releases/assets/${assetId}`, { Accept: 'application/octet-stream' }),
      latest: (owner, repo) => apiCall(`${apiUrl}/repos/${owner}/${repo}/releases/latest`),
    },
  },
};

export default Github;
