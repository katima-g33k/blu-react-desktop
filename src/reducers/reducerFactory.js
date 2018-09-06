export default function createReducer(initialState, handlers) {
  return function reducer(currentState, action) {
    let initialStateData;

    try {
      initialStateData = initialState();
    } catch (error) {
      initialStateData = initialState;
    }

    const state = currentState || initialStateData;

    if (handlers[action.type]) {
      return handlers[action.type](state, action);
    }

    return handlers.default ? handlers.default(state, action) : state;
  };
}
