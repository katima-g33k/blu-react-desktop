import Account from './Account';
import Phone from './Phone';
import City from './City';

export default class Member {
  constructor(member = {}) {
    this.no = member.no || 0;
    this.first_name = member.first_name || member.firstName || '';
    this.last_name = member.last_name || member.lastName || '';
    this.email = member.email || '';
    this.is_parent = member.is_parent || member.isParent || false;
    this.address = member.address || '';
    this.zip = member.zip || '';
    this.city = new City(member.city);
    this.account = new Account(member.account);
    this.phone = member.phone ? member.phone.map(phone => new Phone(phone)) : [];
  }

  set firstName(firstName) {
    this.first_name = firstName;
  }

  get firstName() {
    return this.first_name;
  }

  set lastName(lastName) {
    this.last_name = lastName;
  }

  get lastName() {
    return this.last_name;
  }

  set isParent(isParent) {
    this.is_parent = isParent;
  }

  get isParent() {
    return this.is_parent;
  }

  get name() {
    return `${this.first_name} ${this.last_name}`;
  }

  get addressString() {
    if (!this.address) {
      return '';
    }

    const zip = this.zip.replace(/(.{3})(.{3})/, '$1 $2');
    const city = this.city.name;
    const state = this.city.state.code;
    return `${this.address}, ${city} (${state}) ${zip}`;
  }
}
