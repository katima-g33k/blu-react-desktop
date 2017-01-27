import moment from 'moment';
import Comment from './Comment';

export default class Account {
  constructor(account = {}) {
    this.registration = account.registration;
    this.last_activity = account.last_activity;
    this.comment = account.comment ? account.comment.map(comment => new Comment(comment)) : [];
    this.copies = account.copies || [];
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
}
