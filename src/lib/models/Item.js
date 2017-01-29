import Author from './Author';
import Copy from './Copy';

export default class Item {
  constructor(item = {}) {
    this.id = item.id || 0;
    this.name = item.name || '';
    this.publication = item.publication || '';
    this.edition = item.edition || '';
    this.editor = item.editor || '';
    this.subject = item.subject || {};
    this.is_book = item.is_book || item.isBook || false;
    this.ean13 = item.ean13;
    this.author = item.author ? item.author.map(author => new Author(author)) : [];
    this.copies = item.copies ? item.copies.map(copy => new Copy(copy)) : [];
    this.status = item.status || '';
    this.storage = item.storage || [];
    this.reservation = item.reservation || [];
  }

  getStatus() {
    if (this.isRemoved) {
      return Item.STATUS.REMOVED;
    }

    if (this.isOutdated) {
      return Item.STATUS.OUTDATED;
    }

    return Item.STATUS.VALID;
  }

  get isValid() {
    return !this.status.REMOVED && !this.status.OUTDATED;
  }

  get isOutdated() {
    return !this.status.REMOVED && this.status.OUTDATED;
  }

  get isRemoved() {
    return !!this.status.REMOVED;
  }

  get authorString() {
    return this.author.length ? this.author.map(author => author.toString()).join(', ') : '';
  }

  get storageString() {
    return this.storage.length ? this.storage.join('; ') : '';
  }

  static get STATUS() {
    return {
      VALID: 'VALID',
      OUTDATED: 'OUTDATED',
      REMOVED: 'REMOVED',
    };
  }
}
