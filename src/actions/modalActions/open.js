import { OPEN_MODAL } from '../actionTypes';

export default (title, message) => ({
  message,
  title,
  type: OPEN_MODAL,
});
