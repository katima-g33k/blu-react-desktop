export default class Author {
  constructor(author = {}) {
    this.id = author.id || 0;
    this.first_name = author.first_name || author.firstName || '';
    this.last_name = author.last_name || author.lastName || '';
  }

  get firstName() {
    return this.first_name;
  }

  set firstName(firstName) {
    this.first_name = firstName;
  }

  get lastName() {
    return this.last_name;
  }

  set lastName(lastName) {
    this.last_name = lastName;
  }

  toString() {
    return this.firstName !== '' ? `${this.lastName} ${this.firstName}` : this.lastName;
  }
}
