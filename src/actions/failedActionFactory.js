import I18n from '../lib/i18n';

export const generateFailAction = (error, type) => ({
  message: error.message,
  title: I18n('modal.error', { code: error.code || 500 }),
  type,
});
