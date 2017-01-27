export default class Comment {
  constructor(comment) {
    this.id = comment.id || 0;
    this.comment = comment.comment || '';
    this.updated_at = comment.updated_at || comment.updatedAt;
    this.updated_by = comment.updated_by || comment.updatedBy;
  }

  get updatedAt() {
    return this.updated_at;
  }

  set updatedAt(updatedAt) {
    this.updated_at = this.updatedAt;
  }

  get updatedBy() {
    return this.updated_by;
  }

  set updatedBy(updatedBy) {
    this.updated_by = updatedBy;
  }

  toString() {
    return this.comment;
  }
}
