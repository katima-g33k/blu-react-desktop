import Author from './Author';
import Copy from './Copy';
import Reservation from './Reservation';

export default class Item {
  constructor(item = {}) {
    this.id = item.id || 0;
    this.name = item.name || '';
    this.publication = item.publication || '';
    this.edition = item.edition || '';
    this.editor = item.editor || '';
    this.subject = item.subject || {};
    this.isBook = item.isBook || false;
    this.ean13 = item.ean13;
    this.author = item.author ? item.author.map(author => new Author(author)) : [];
    this.copies = item.copies ? item.copies.map(copy => new Copy(copy)) : [];
    this.status = item.status || {};
    this.storage = item.storage || [];
    this.reservation = (item.reservation || []).map(reservation => new Reservation(reservation));
    this.comment = item.comment || '';
    this.stats = item.stats || {};

    this.noEan13 = false;
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

  getStatusString() {
    const status = {
      OUTDATED: 'Désuet',
      REMOVED: 'Retiré',
      VALID: 'Valide',
    };

    return status[this.getStatus()];
  }

  updateStatus(status) {
    switch (status) {
      case Item.STATUS.VALID:
        delete this.status[Item.STATUS.OUTDATED];
        delete this.status[Item.STATUS.REMOVED];
        this.status[status] = new Date();
        break;
      case Item.STATUS.OUTDATED:
        delete this.status[Item.STATUS.REMOVED];
        this.status[status] = new Date();
        break;
      default:
        this.status[status] = new Date();
        break;
    }
  }

  get isInStock() {
    return this.copies.filter(copy => copy.isAdded).length > 0;
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

  clone = () => new Item(this);

  static get STATUS() {
    return {
      VALID: 'VALID',
      OUTDATED: 'OUTDATED',
      REMOVED: 'REMOVED',
    };
  }
}
