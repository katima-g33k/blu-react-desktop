export default class State {
  constructor(state = {}) {
    this.code = state.code || '';
    this.name = state.name || '';
  }
}
