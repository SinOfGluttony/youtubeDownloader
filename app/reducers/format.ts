import { Action } from 'redux';
import { UPDATE_FORMAT } from '../actions/format';

export default function format(state = '', action: Action<string>) {
  if (action.type === UPDATE_FORMAT) {
    const { ipcRenderer } = require('electron');
    ipcRenderer.send('format', {
      format: action.format
    });
    return action.format;
  }

  return state;
}
