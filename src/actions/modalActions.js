import {
  CLOSE_MODAL,
  OPEN_MODAL,
  UPDATE_MODAL_INPUT,
} from './actionTypes';

export const closeModal = () => ({
  type: CLOSE_MODAL,
});

export const openModal = (title, message) => ({
  message,
  title,
  type: OPEN_MODAL,
});

export const updateInputValue = inputValue => ({
  inputValue,
  type: UPDATE_MODAL_INPUT,
});
