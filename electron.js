require('babel-register');

const electron = require('electron');

const { app, BrowserWindow } = electron;
const options = {
  debug: false,
};

let mainWindow;

function resetMainWindow() {
  mainWindow = null;
}

function createWindow() {
  mainWindow = new BrowserWindow(options);
  mainWindow.loadURL(`file://${__dirname}/src/index.html`);
  mainWindow.maximize();

  mainWindow.on('closed', resetMainWindow);

  if (options.debug) {
    mainWindow.webContents.openDevTools();
  }
}

app.on('ready', createWindow);
app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit());
app.on('activate', () => mainWindow === null && createWindow());
