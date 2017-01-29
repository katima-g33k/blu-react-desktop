export default class City {
  constructor(city = {}) {
    this.id = city.id || 0;
    this.name = city.name || '';
    this.state = {
      code: city.state ? city.state.code || '' : '',
      name: city.state ? city.state.name || '' : '',
    };
  }
}
