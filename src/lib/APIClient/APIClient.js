import HTTP from './HTTP';

export default class APIClient {
  constructor(url, key) {
    this.url = url;
    this.key = key;

    HTTP.setAPIKey(key);
    HTTP.setAPIurl(url);

    this.category = {
      select: (callback) => {
        HTTP.post(`${this.url}/category/select`, {}, callback);
      },
    };

    this.comment = {
      delete: (id, callback) => {
        HTTP.post(`${this.url}/comment/delete`, { id }, callback);
      },
      insert: (member, comment, callback) => {
        HTTP.post(`${this.url}/comment/insert`, { member, comment }, callback);
      },
      update: (id, comment, callback) => {
        HTTP.post(`${this.url}/comment/update`, { id, comment }, callback);
      },
    };

    this.copy = {
      delete: (id, callback) => {
        HTTP.post(`${this.url}/copy/delete`, { id }, callback);
      },
      insert: (member, item, price, callback) => {
        HTTP.post(`${this.url}/copy/insert`, { item, member, price }, callback);
      },
      update: (id, price, callback) => {
        HTTP.post(`${this.url}/copy/update`, { id, price }, callback);
      },
    };

    this.item = {
      exists: (ean13, callback) => {
        HTTP.post(`${this.url}/item/exists`, { ean13 }, callback);
      },
      insert: (item, callback) => {
        HTTP.post(`${this.url}/item/insert`, { item }, callback);
      },
      search: (search, options, callback) => {
        HTTP.post(`${this.url}/item/search`, { ...options, search }, callback);
      },
      select: (identifier, options, callback) => {
        options[/\d{13}/.test(identifier) ? 'ean13' : 'id'] = identifier;
        HTTP.post(`${this.url}/item/select`, options, callback);
      },
      update: (id, item, callback) => {
        HTTP.post(`${this.url}/item/update`, { id, item }, callback);
      },
      updateStatus: (id, status, callback) => {
        HTTP.post(`${this.url}/item/updateStatus`, { id, status }, callback);
      },
      updateStorage: (id, storage, callback) => {
        HTTP.post(`${this.url}/item/update_storage`, { id, storage }, callback);
      },
    };

    this.member = {
      exists: (no, callback) => {
        HTTP.post(`${this.url}/member/exists`, { no }, callback);
      },
      getName: (no, callback) => {
        HTTP.post(`${this.url}/member/getName`, { no }, callback);
      },
      insert: (member, callback) => {
        HTTP.post(`${this.url}/member/insert`, member, callback);
      },
      pay: (no, callback) => {
        HTTP.post(`${this.url}/member/pay`, { no }, callback);
      },
      renew: (no, callback) => {
        HTTP.post(`${this.url}/member/renew`, { no }, callback);
      },
      search: (search, options, callback) => {
        HTTP.post(`${this.url}/member/search`, { ...options, search }, callback);
      },
      select: (no, callback) => {
        HTTP.post(`${this.url}/member/select`, { no }, callback);
      },
      update: (no, member, callback) => {
        HTTP.post(`${this.url}/member/update`, { no, member }, callback);
      },
    };

    this.reservation = {
      clear: (callback) => {
        HTTP.post(`${this.url}/reservation/deleteAll`, {}, callback);
      },
      delete: (member, item, callback) => {
        HTTP.post(`${this.url}/reservation/delete`, { member, item }, callback);
      },
      insert: (member, item, callback) => {
        HTTP.post(`${this.url}/reservation/insert`, { member, item }, callback);
      },
      select: (callback) => {
        HTTP.post(`${this.url}/reservation/select`, {}, callback);
      },
    };

    this.state = {
      select: (callback) => {
        HTTP.post(`${this.url}/state/select`, {}, callback);
      },
    };

    this.statistics = {
      byInterval: (startDate, endDate, callback) => {
        HTTP.post(`${this.url}/statistics/byInterval`, { startDate, endDate }, callback);
      },
    };

    this.storage = {
      clear: (callback) => {
        HTTP.post(`${this.url}/storage/delete`, {}, callback);
      },
      select: (callback) => {
        HTTP.post(`${this.url}/storage/select`, {}, callback);
      },
    };

    this.transaction = {
      delete: (copy, type, callback) => {
        HTTP.post(`${this.url}/transaction/delete`, { copy, type }, callback);
      },
      insert: (member, copies, type, callback) => {
        HTTP.post(`${this.url}/transaction/insert`, { copies, member, type }, callback);
      },
    };
  }
}
