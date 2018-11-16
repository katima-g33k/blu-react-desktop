import Copy from './Copy';
import Item from './Item';
import Member from './Member';

export default class Reservation {
  constructor(reservation = {}) {
    this.id = reservation.id || 0;
    this.copy = reservation.copy ? new Copy(reservation.copy) : null;
    this._date = reservation.date;
    this.item = new Item(reservation.item || {});
    this.parent = new Member(reservation.parent);
  }

  get date() {
    if (this._date) {
      return this._date;
    }

    if (this.copy && this.copy.dateReserved) {
      return this.copy.dateReserved;
    }

    return '';
  }
}
