const PROPERTIES = [
  'apiKey',
  'apiUrl',
  'barcodeFirstChar',
  'barcodeLastChar',
  'logLevel',
  'secretKey',
];

class Settings {
  get apiUrl() {
    return localStorage.getItem('apiUrl');
  }

  set apiUrl(apiUrl) {
    localStorage.setItem('apiUrl', apiUrl);
  }

  get apiKey() {
    return localStorage.getItem('apiKey');
  }

  set apiKey(apiKey) {
    localStorage.setItem('apiKey', apiKey);
  }

  get secretKey() {
    return localStorage.getItem('secretKey');
  }

  set secretKey(secretKey) {
    localStorage.setItem('secretKey', secretKey);
  }

  get barcodeFirstChar() {
    return localStorage.getItem('barcodeFirstChar');
  }

  set barcodeFirstChar(barcodeFirstChar) {
    localStorage.setItem('barcodeFirstChar', barcodeFirstChar);
  }

  get barcodeLastChar() {
    return localStorage.getItem('barcodeLastChar');
  }

  set barcodeLastChar(barcodeLastChar) {
    localStorage.setItem('barcodeLastChar', barcodeLastChar);
  }

  get logLevel() {
    return sessionStorage.getItem('logLevel') || localStorage.getItem('logLevel') || 'none';
  }

  set logLevel(logLevel) {
    localStorage.setItem('logLevel', logLevel);
  }

  set sessionLogLevel(logLevel) {
    sessionStorage.setItem('logLevel', logLevel);
  }

  get() {
    return PROPERTIES.reduce((settings, key) => {
      settings[key] = localStorage.getItem(key);
      return settings;
    }, {});
  }

  set(settings) {
    Object.keys(settings).forEach((key) => {
      if (PROPERTIES.includes(key)) {
        localStorage.setItem(key, settings[key]);
      }
    });
  }

  getProperties() {
    return PROPERTIES;
  }
}

export default new Settings();
