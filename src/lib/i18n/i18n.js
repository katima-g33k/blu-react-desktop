import { I18n, Translate as t } from 'react-i18nify';
import fr from './fr.js';

I18n.setTranslations({ fr });
I18n.setLocale('fr');

export const Translate = t;
export default I18n;
