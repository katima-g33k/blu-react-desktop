import moment from 'moment';

import Member from './Member';

export default class Transaction {
  constructor(transaction = {}) {
    const member = transaction.member || transaction.parent;

    this.code = transaction.code;
    this.date = transaction.date ? moment(transaction.date) : null;
    this.member = member ? new Member(member) : null;
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
