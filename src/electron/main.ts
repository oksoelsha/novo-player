import { app, BrowserWindow } from 'electron'
import * as path from 'path'
import * as url from 'url'
import { SettingsService} from './SettingsService'

let win: BrowserWindow
let settingsService: SettingsService

app.on('ready', createWindow)

app.on('activate', () => {
    if (win === null) {
        createWindow()
        initializeServices();
    }
})

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        titleBarStyle: 'hidden',
        backgroundColor: '#2e2c29',
        show: false,
        webPreferences: {
            nodeIntegration: true,
        }
    })
    if (process.platform === "darwin") {
        app.dock.hide();  //hide menu on MacOS
    }

    win.loadURL(
        url.format({
            pathname: path.join(__dirname, `/../../../dist/novo-player/index.html`),
            protocol: 'file:',
            slashes: true,
        })
    )

    win.once('ready-to-show', () => {
        win.show()
    })

    win.on('closed', () => {
        win = null
    })

    initializeServices();
}

function initializeServices() {
    settingsService = new SettingsService(win);
    settingsService.init();
}
