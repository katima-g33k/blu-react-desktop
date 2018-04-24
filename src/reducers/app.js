import API from '../lib/api';

const apiUrl = localStorage.getItem('apiUrl');
const apiKey = localStorage.getItem('apiKey');

const initialState = {
  apiClient: new API(apiUrl, apiKey),
};

export default function appReducer(state = initialState, action = {}) {
  switch (action.type) {
    default:
      return state;
  }
}
