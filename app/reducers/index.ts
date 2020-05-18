import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import url from './url';
import submit from './submit';
import format from './format';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    url,
    submit,
    format
  });
}
