const SCAN_FIRST_CHAR = 'à';
const SCAN_LAST_CHAR = 'À';

class Scanner {
  constructor() {
    this.barcode = '';
    this.listeners = {
      onScan: [],
      onMemberScan: [],
      onItemScan: [],
      onInvalidScan: [],
    };

    this.initScanner = this.initScanner.bind(this);
    this.addListener = this.addListener.bind(this);
    this.dispatch = this.dispatch.bind(this);

    this.initScanner();
  }

  addListener(listener, func) {
    if (this.listeners[listener]) {
      this.listeners[listener].push(func);
    }
  }

  dispatch(listener, ...args) {
    this.listeners[listener].forEach(func => func(...args));
  }

  initScanner() {
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
}

export default new Scanner();
