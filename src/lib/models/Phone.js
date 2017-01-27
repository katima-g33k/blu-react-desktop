export default class Phone {
  constructor(phone = {}) {
    this.id = phone.id || 0;
    this.number = phone.number || '';
    this.note = phone.note || '';
  }

  toString() {
    const number = this.number.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    const hasNote = this.note && this.note !== '';
    return hasNote ? `${number} (${this.note})` : number;
  }
}
