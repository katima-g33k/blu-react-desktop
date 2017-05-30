import fs from 'fs';
import settings from '../settings.json';

const SCAN_FIRST_CHAR = settings.barcode.firstChar;
const SCAN_LAST_CHAR = settings.barcode.lastChar;

class Scanner {
  constructor() {
    this.barcode = '';
    this.listeners = {
      onScan: [],
      onMemberScan: [],
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
    const firstChar = code.charAt();
    const lastChar = code.charAt(code.length - 1);

    const newSettings = {
      ...settings,
      barcode: { firstChar, lastChar },
    };

    fs.writeFile('../settings.json', JSON.stringify(newSettings), (err) => {
      if (err) {
        // TODO: Display message
        return;
      }

      // TODO: Display message
    });
  }

  dispatch = (listener, ...args) => {
    this.listeners[listener].forEach(func => func(...args));
  }

  initScanner = () => {
    document.onkeydown = (event) => {
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
            const no = 2 + code.slice(1, 9);
            this.dispatch('onMemberScan', no);
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
