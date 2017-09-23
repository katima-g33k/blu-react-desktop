export default class Author {
  constructor(author = {}) {
    this.id = author.id || 0;
    this.firstName = author.firstName || '';
    this.lastName = author.lastName || '';
  }

  toString() {
    return this.firstName !== '' ? `${this.lastName} ${this.firstName}` : this.lastName;
  }
}
