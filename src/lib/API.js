import HTTP from './HTTP';
import settings from '../settings';

const { apiUrl } = settings;

const API = {
  category: {
    select: (callback) => {
      HTTP.post(`${apiUrl}/category/select`, {}, callback);
    },
  },
  comment: {
    delete: (id, callback) => {
      HTTP.post(`${apiUrl}/comment/delete`, { id }, callback);
    },
    insert: (member, comment, callback) => {
      HTTP.post(`${apiUrl}/comment/insert`, { member, comment }, callback);
    },
    update: (id, comment, callback) => {
      HTTP.post(`${apiUrl}/comment/update`, { id, comment }, callback);
    },
  },
  copy: {
    delete: (id, callback) => {
      HTTP.post(`${apiUrl}/copy/delete`, { id }, callback);
    },
    insert: (memberNo, itemId, price, callback) => {
      const data = {
        item_id: itemId,
        member_no: memberNo,
        price,
      };

      HTTP.post(`${apiUrl}/copy/insert`, data, callback);
    },
    update: (id, price, callback) => {
      HTTP.post(`${apiUrl}/copy/update`, { id, price }, callback);
    },
  },
  item: {
    exists: (ean13, callback) => {
      HTTP.post(`${apiUrl}/item/exists`, { ean13 }, callback);
    },
    insert: (item, callback) => {
      HTTP.post(`${apiUrl}/item/insert`, { item }, callback);
    },
    search: (search, options, callback) => {
      HTTP.post(`${apiUrl}/item/search`, { ...options, search }, callback);
    },
    select: (options, callback) => {
      HTTP.post(`${apiUrl}/item/select`, options, callback);
    },
    update: (id, item, callback) => {
      HTTP.post(`${apiUrl}/item/update`, { id, item }, callback);
    },
    updateStatus: (id, status, callback) => {
      HTTP.post(`${apiUrl}/item/updateStatus`, { id, status }, callback);
    },
    updateStorage: (id, storage, callback) => {
      HTTP.post(`${apiUrl}/item/update_storage`, { id, storage }, callback);
    },
  },
  member: {
    exists: (no, callback) => {
      HTTP.post(`${apiUrl}/member/exists`, { no }, callback);
    },
    getName: (no, callback) => {
      HTTP.post(`${apiUrl}/member/getName`, { no }, callback);
    },
    insert: (member, callback) => {
      HTTP.post(`${apiUrl}/member/insert`, member, callback);
    },
    pay: (no, callback) => {
      HTTP.post(`${apiUrl}/member/pay`, { no }, callback);
    },
    renew: (no, callback) => {
      HTTP.post(`${apiUrl}/member/renew`, { no }, callback);
    },
    search: (search, options, callback) => {
      HTTP.post(`${apiUrl}/member/search`, { ...options, search }, callback);
    },
    select: (no, callback) => {
      HTTP.post(`${apiUrl}/member/select`, { no }, callback);
    },
    update: (no, member, callback) => {
      HTTP.post(`${apiUrl}/member/update`, { no, member }, callback);
    },
  },
  reservation: {
    delete: (member, item, callback) => {
      HTTP.post(`${apiUrl}/reservation/delete`, { member, item }, callback);
    },
    deleteAll: (callback) => {
      HTTP.post(`${apiUrl}/reservation/deleteAll`, {}, callback);
    },
    insert: (member, item, callback) => {
      HTTP.post(`${apiUrl}/reservation/insert`, { member, item }, callback);
    },
    select: (callback) => {
      HTTP.post(`${apiUrl}/reservation/select`, {}, callback);
    },
  },
  state: {
    select: (callback) => {
      HTTP.post(`${apiUrl}/state/select`, {}, callback);
    },
  },
  storage: {
    delete: (callback) => {
      HTTP.post(`${apiUrl}/storage/delete`, {}, callback);
    },
    select: (callback) => {
      HTTP.post(`${apiUrl}/storage/select`, {}, callback);
    },
  },
  transaction: {
    delete: (copy, type, callback) => {
      HTTP.post(`${apiUrl}/transaction/delete`, { copy, type }, callback);
    },
    insert: (memberNo, copyIDs, transactionType, callback) => {
      const data = {
        copies: copyIDs,
        member: memberNo,
        type: transactionType,
      };
      HTTP.post(`${apiUrl}/transaction/insert`, data, callback);
    },
  },
};

export default API;
