import moment from 'moment';
import Comment from './Comment';
import Copy from './Copy';

export default class Account {
  constructor(account = {}) {
    this.registration = account.registration;
    this.last_activity = account.last_activity;
    this.comment = account.comment ? account.comment.map(comment => new Comment(comment)) : [];
    this.copies = account.copies ? account.copies.map(copy => new Copy(copy)) : [];
    this.transfers = account.transfers || [];
  }

  get deactivationDate() {
    return moment(this.last_activity).add(1, 'year');
  }

  get isActive() {
    return moment().isBefore(this.deactivationDate);
  }

  get lastActivity() {
    return this.last_activity;
  }

  set lastActivity(lastActivity) {
    this.last_activity = lastActivity;
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
