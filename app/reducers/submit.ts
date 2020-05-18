import { Action } from 'redux';
import { UPDATE_PATH } from '../actions/path';

export default function submit(state = '', action: Action<string>) {
  if (action.type === UPDATE_PATH) {
    const { ipcRenderer } = require('electron');
    ipcRenderer.send('submit', {
      path: action.path.filePaths[0]
    });
    return action.path;
  }

  return state;
}
