import { Action } from 'redux';
import { UPDATE_URL } from '../actions/url';

export default function url(state = '', action: Action<string>) {
  if (action.type === UPDATE_URL) {
    const { ipcRenderer } = require('electron');
    ipcRenderer.send('URL', {
      URL: action.url
    });
    return action.url;
  }

  return state;
}
