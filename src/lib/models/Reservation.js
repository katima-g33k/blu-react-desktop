import Copy from './Copy';
import Item from './Item';
import Member from './Member';

export default class Reservation {
  constructor(reservation = {}) {
    this.copy = reservation.copy ? new Copy(reservation.copy) : null;
    this.date = reservation.date;
    this.item = new Item(reservation.item);
    this.parent = new Member(reservation.parent);
  }
}
