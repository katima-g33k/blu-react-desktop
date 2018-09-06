export default class Scanner {
  constructor(barcodeFirstChar, barcodeLastChar, currentElementId) {
    this.element = currentElementId ? document.getElementById(currentElementId) : window;
    this.barcodeFirstChar = barcodeFirstChar;
    this.barcodeLastChar = barcodeLastChar;
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

  dispatch = (listener, ...args) => {
    this.listeners[listener].forEach(func => func(...args));
  }

  initScanner = () => {
    this.element.onkeydown = (event) => {
      this.dispatch('onInput', event.key);

      if (event.key === this.barcodeFirstChar) {
        this.barcode = event.key;
      } else if (this.barcode.slice(0, 1) === this.barcodeFirstChar) {
        this.barcode += event.key;
      }

      if (event.key === this.barcodeLastChar) {
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

  updateScanChars = (barcodeFirstChar, barcodeLastChar) => {
    this.barcodeFirstChar = barcodeFirstChar;
    this.barcodeLastChar = barcodeLastChar;
  }
}
