const PROPERTIES = [
  'apiKey',
  'apiUrl',
  'barcodeFirstChar',
  'barcodeLastChar',
  'logLevel',
  'secretKey',
];

export default class Settings {
  static get apiUrl() {
    return localStorage.getItem('apiUrl');
  }

  static set apiUrl(apiUrl) {
    localStorage.setItem('apiUrl', apiUrl);
  }

  static get apiKey() {
    return localStorage.getItem('apiKey');
  }

  static set apiKey(apiKey) {
    localStorage.setItem('apiKey', apiKey);
  }

  static get secretKey() {
    return localStorage.getItem('secretKey');
  }

  static set secretKey(secretKey) {
    localStorage.setItem('secretKey', secretKey);
  }

  static get barcodeFirstChar() {
    return localStorage.getItem('barcodeFirstChar');
  }

  static set barcodeFirstChar(barcodeFirstChar) {
    localStorage.setItem('barcodeFirstChar', barcodeFirstChar);
  }

  static get barcodeLastChar() {
    return localStorage.getItem('barcodeLastChar');
  }

  static set barcodeLastChar(barcodeLastChar) {
    localStorage.setItem('barcodeLastChar', barcodeLastChar);
  }

  static get logLevel() {
    return sessionStorage.getItem('logLevel') || localStorage.getItem('logLevel') || 'none';
  }

  static set logLevel(logLevel) {
    localStorage.setItem('logLevel', logLevel);
  }

  static set sessionLogLevel(logLevel) {
    sessionStorage.setItem('logLevel', logLevel);
  }

  static get() {
    return PROPERTIES.reduce((settings, key) => ({
      ...settings,
      [key]: localStorage.getItem(key),
    }), {});
  }

  static set(settings) {
    Object.keys(settings).forEach((key) => {
      if (PROPERTIES.includes(key)) {
        localStorage.setItem(key, settings[key]);
      }
    });
  }

  static getProperties() {
    return PROPERTIES;
  }
}
