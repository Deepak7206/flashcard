// reducers.js

// import { combineReducers } from 'redux';

const initialState = {
  counter: 0,
  // otherState: initialOtherState,
};

const counterReducer = (state = initialState.counter, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
};

// Define other reducers as needed

export default counterReducer;