import thunk from 'redux-thunk';

import { createStore, compose, applyMiddleware } from 'redux';

const data = [
  {
    name: 'Ojay',
    email: 'ojima',
  },
];
const initialState = {};
const reducer = (state, action) => {
  return { users: data.users };
};

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  initialState,
  composeEnhancer(applyMiddleware(thunk))
);

export default store;
