import moment from 'moment';

export default class Comment {
  constructor(comment = {}) {
    this.id = comment.id || 0;
    this.comment = comment.comment || '';
    this.updatedAt = moment(comment.updatedAt || new Date());
    this.updatedBy = comment.updatedBy;
  }

  toString() {
    return this.comment;
  }
}
