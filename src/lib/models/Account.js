import moment from 'moment';
import Comment from './Comment';
import Copy from './Copy';

export default class Account {
  constructor(account = {}) {
    this.registration = account.registration;
    this.lastActivity = account.lastActivity;
    this.comment = account.comment ? account.comment.map(comment => new Comment(comment)) : [];
    this.copies = account.copies ? account.copies.map(copy => new Copy(copy)) : [];
    this.transfers = account.transfers || [];
  }

  get deactivationDate() {
    return moment(this.lastActivity).add(1, 'year');
  }

  get isActive() {
    return moment().isBefore(this.deactivationDate);
  }

  getAddedCopies() {
    return this.copies.filter(copy => copy.isAdded || copy.isReserved);
  }

  getSoldCopies() {
    return this.copies.filter(copy => copy.isSold);
  }

  donateAll() {
    this.copies.forEach((copy) => {
      if ((copy.isAdded || copy.isReserved || copy.isSold) && !copy.isDonated) {
        copy.donate();
      }
    });
  }
}
