export default class Transaction {
  constructor(transaction = {}) {
    this.code = transaction.code;
    this.date = transaction.date;
  }

  static get TYPES() {
    return {
      ADD: 'ADD',
      AJUST_INVENTORY: 'AJUST_INVENTORY',
      DONATE: 'DONATE',
      PAY: 'PAY',
      RESERVE: 'RESERVE',
      SELL: 'SELL',
      SELL_PARENT: 'SELL_PARENT',
      get ALL_SELL() {
        return [this.SELL, this.SELL_PARENT];
      },
    };
  }
}
