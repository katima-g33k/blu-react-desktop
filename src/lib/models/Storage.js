import Item from './Item';

export default class Storage {
  constructor(storage = {}) {
    this.no = storage.no || 0;
    this.item = storage.item ? storage.item.map(item => new Item(item)) : [];
  }
}
