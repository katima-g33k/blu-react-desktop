import Account from './Account';
import Phone from './Phone';
import City from './City';

export default class Member {
  constructor(member = {}) {
    this.no = member.no || 0;
    this.firstName = member.firstName || '';
    this.lastName = member.lastName || '';
    this.email = member.email || '';
    this.isParent = member.isParent || false;
    this.address = member.address || '';
    this.zip = member.zip || '';
    this.city = new City(member.city);
    this.account = new Account(member.account);
    this.phone = (member.phone || []).map(phone => new Phone(phone));

    while (this.phone.length < 2) {
      this.phone.push(new Phone());
    }

    this.noNo = false;
  }

  get name() {
    return `${this.firstName} ${this.lastName}`;
  }

  get addressString() {
    if (!this.address) {
      return '';
    }

    const zip = this.zip.replace(/(.{3})(.{3})/, '$1 $2');
    const city = this.city.name;
    const state = this.city.state.code;

    if (city) {
      return `${this.address}, ${city} (${state}) ${zip}`;
    }

    return `${this.address}, ${zip}`;
  }
}
