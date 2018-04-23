import API from '../../lib/api';
import I18n from '../../lib/i18n/index';
import { Item } from '../../lib/models';
import { setCopies } from '../copyActions/index';

import {
  FETCH_ITEM_FAIL,
  FETCH_ITEM_PENDING,
  FETCH_ITEM_SUCCESS,
} from '../actionTypes';

const apiUrl = localStorage.getItem('apiUrl');
const apiKey = localStorage.getItem('apiKey');
const apiClient = new API(apiUrl, apiKey);

const fail = error => ({
  message: error.message,
  title: I18n('modal.error', { code: error.code || 500 }),
  type: FETCH_ITEM_FAIL,
});

const pending = () => ({
  type: FETCH_ITEM_PENDING,
});

const success = item => ({
  item,
  type: FETCH_ITEM_SUCCESS,
});

export default id => async (dispatch) => {
  dispatch(pending());

  try {
    const item = new Item(await apiClient.item.get(id));
    dispatch(success(item));
    dispatch(setCopies(item.copies));
  } catch (error) {
    dispatch(fail(error));
  }
};
