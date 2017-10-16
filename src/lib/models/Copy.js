import Item from './Item';
import Member from './Member';
import Transaction from './Transaction';

export default class Copy {
  constructor({ id = 0, price = 0, transaction = [], item, member }) {
    this.id = id;
    this.price = +price;
    this.transaction = transaction.map(t => new Transaction(t));
    this.item = item ? new Item(item) : null;
    this.member = member ? new Member(member) : null;
  }

  get priceString() {
    return `${this.price} $`;
  }

  get status() {
    const transactions = {};

    this.transaction.forEach((transaction) => {
      transactions[transaction.code] = true;
    });

    if (transactions.PAY) {
      return Copy.STATUS.PAID;
    }

    if (transactions.SELL || transactions.SELL_PARENT) {
      return Copy.STATUS.SOLD;
    }

    if (transactions.RESERVE) {
      return Copy.STATUS.RESERVED;
    }

    return Copy.STATUS.ADDED;
  }

  get dateAdded() {
    return this.transaction.find(t => t.code === Transaction.TYPES.ADD).date;
  }

  get dateSold() {
    const transaction = this.transaction.find(t => Transaction.TYPES.ALL_SELL.indexOf(t.code) > -1);
    return transaction ? transaction.date : '';
  }

  get datePaid() {
    const transaction = this.transaction.find(t => t.code === Transaction.TYPES.PAY);
    return transaction ? transaction.date : '';
  }

  get dateReserved() {
    const transaction = this.transaction.find(t => t.code === Transaction.TYPES.RESERVE);
    return transaction ? transaction.date : '';
  }

  get isDonated() {
    return !!this.transaction.find(t => t.code === Transaction.TYPES.DONATE);
  }

  get isSold() {
    return this.status === Copy.STATUS.SOLD;
  }

  get isAdded() {
    return this.status === Copy.STATUS.ADDED;
  }

  get isPaid() {
    return this.status === Copy.STATUS.PAID;
  }

  get isReserved() {
    return this.status === Copy.STATUS.RESERVED;
  }

  get reservee() {
    const transaction = this.transaction.find(t => t.code === Transaction.TYPES.RESERVE);
    return transaction ? transaction.member : {};
  }

  cancelReservation() {
    this.transaction = this.transaction.filter(transaction =>
      Transaction.TYPES.RESERVE !== transaction.code,
    );
  }

  donate() {
    this.transaction.push(new Transaction({
      code: Transaction.TYPES.DONATE,
      date: new Date(),
    }));
  }

  sell() {
    this.transaction.push(new Transaction({
      code: Transaction.TYPES.SELL,
      date: new Date(),
    }));
  }

  sellParent() {
    if (this.isReserved) {
      this.cancelReservation();
    }

    this.transaction.push(new Transaction({
      code: Transaction.TYPES.SELL_PARENT,
      date: new Date(),
    }));
  }

  refund() {
    this.transaction = this.transaction.filter(transaction =>
      Transaction.TYPES.ALL_SELL.indexOf(transaction.code) === -1,
    );
  }

  pay() {
    this.transaction.push(new Transaction({
      code: Transaction.TYPES.PAY,
      date: new Date(),
    }));
  }

  reserve(member) {
    this.transaction.push(new Transaction({
      code: Transaction.TYPES.RESERVE,
      date: new Date(),
      member,
    }));
  }

  static get STATUS() {
    return {
      ADDED: 'ADDED',
      DONATED: 'DONATED',
      PAID: 'PAID',
      RESERVED: 'RESERVED',
      SOLD: 'SOLD',
    };
  }
}
