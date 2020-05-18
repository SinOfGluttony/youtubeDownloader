/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItem,
  clipboard
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';

const fs = require('fs');
const ytdl = require('ytdl-core');

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let URL: string;
let format: string;
let quality: string;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: true,
    width: 1024,
    height: 728,

    webPreferences:
      process.env.NODE_ENV === 'development' || process.env.E2E_BUILD === 'true'
        ? {
            nodeIntegration: true
          }
        : {
            preload: path.join(__dirname, 'dist/renderer.prod.js'),
            nodeIntegration: true
          }
  });
  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  ipcMain.on('format', (event, info) => {
    [format, quality] = info.format.split(' ');
  });

  ipcMain.on('URL', async (event, info) => {
    URL = info.URL.toString();
  });

  ipcMain.on('submit', async (event, info) => {
    const { path } = info;
    if (!ytdl.validateURL(URL)) {
      event.reply('error', 'Invalid URL');
      return;
    }
    if (!format || !quality) {
      event.reply('error', 'Format missing');
      return;
    }
    if (!path) {
      event.reply(
        'error',
        'You have have not selected a destination folder, submit again.'
      );
      return;
    }
    event.reply('error', '');
    const data = await ytdl.getInfo(URL);
    const video = ytdl(URL, {
      quality: `${format === 'mp4' ? quality : quality.concat('audio')}`
    });
    const videoFullTitle = data.title.split(' ');
    const videoTitle = `${videoFullTitle[0]}_${videoFullTitle[1]}_${videoFullTitle[2]}`;
    const fullPath = `${path}/${videoTitle}.${format}`;
    video.pipe(fs.createWriteStream(fullPath));
    video.on('response', function(res: any) {
      const totalSize = res.headers['content-length'];
      let dataRead = 0;
      res.on('data', function(data: any) {
        dataRead += data.length;
        const percent = dataRead / totalSize;
        const progress = (percent * 100).toFixed(2);
        mainWindow.webContents.send('downloadProgress', progress);
      });
    });
  });
  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};
/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', createWindow);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});
