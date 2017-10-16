import settings from './Settings';

let SCAN_FIRST_CHAR = settings.barcodeFirstChar;
let SCAN_LAST_CHAR = settings.barcodeLastChar;

class Scanner {
  constructor() {
    this.barcode = '';
    this.listeners = {
      onScan: [],
      onMemberScan: [],
      onInput: [],
      onItemScan: [],
      onInvalidScan: [],
    };

    this.initScanner();
  }

  addListener = (listener, func) => {
    if (this.listeners[listener]) {
      this.listeners[listener].push(func);
    }
  }

  calibrate = (code) => {
    SCAN_FIRST_CHAR = code.charAt();
    SCAN_LAST_CHAR = code.charAt(code.length - 1);

    settings.set({
      barcodeFirstChar: SCAN_FIRST_CHAR,
      barcodeLastChar: SCAN_LAST_CHAR,
    });
  }

  dispatch = (listener, ...args) => {
    this.listeners[listener].forEach(func => func(...args));
  }

  initScanner = () => {
    document.onkeydown = (event) => {
      this.dispatch('onInput', event.key);

      if (event.key === SCAN_FIRST_CHAR) {
        this.barcode = event.key;
      } else if (this.barcode.slice(0, 1) === SCAN_FIRST_CHAR) {
        this.barcode += event.key;
      }

      if (event.key === SCAN_LAST_CHAR) {
        const code = this.barcode.replace(/\D/g, '');
        this.dispatch('onScan', code);

        switch (code.length) {
          case 10:
            this.dispatch('onMemberScan', 2 + code.slice(1, 9));
            break;
          case 13:
            this.dispatch('onItemScan', code);
            break;
          default:
            this.dispatch('onInvalidScan', code);
        }

        this.barcode = '';
      }

      if (this.barcode.length > 20) {
        this.barcode = '';
      }
    };
  }

  removeListener = (listener, func) => {
    this.listeners[listener] = this.listeners[listener].filter(currentFunc => currentFunc !== func);
  }
}

export default new Scanner();
