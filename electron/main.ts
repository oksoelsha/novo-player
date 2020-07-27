import { app, BrowserWindow } from 'electron'
import * as path from 'path'
import * as url from 'url'
import { SettingsService} from './SettingsService'
import { GamesService } from './GamesService'
import { EmulatorLaunchService } from './EmulatorLaunchService'
import { FilesService } from './FilesService'
import { EmulatorRepositoryService } from './EmulatorRepositoryService'
import { ExtraDataService } from './ExtraDataService'
import { ScanService } from './ScanService'

let win: BrowserWindow
let settingsService: SettingsService
let gamesService: GamesService
let emulatorLaunchService: EmulatorLaunchService
let filesService: FilesService
let emulatorRepositoryService: EmulatorRepositoryService
let extraDataService: ExtraDataService
let scanService: ScanService

app.on('ready', startApp)

app.on('activate', () => {
    if (win === null) {
        startApp()
    }
})

function startApp() {
    createWindow();
    initializeServices();
}

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        titleBarStyle: 'hidden',
        backgroundColor: '#2e2c29',
        show: false,
        webPreferences: {
            nodeIntegration: true
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
}

function initializeServices() {
    settingsService = new SettingsService(win);
    settingsService.init();

    extraDataService = new ExtraDataService();
    extraDataService.init();

    emulatorRepositoryService = new EmulatorRepositoryService(settingsService)
    emulatorRepositoryService.init();

    gamesService = new GamesService(win, emulatorRepositoryService);
    gamesService.init();

    emulatorLaunchService = new EmulatorLaunchService(settingsService);
    emulatorLaunchService.init();

    filesService = new FilesService(win, settingsService);
    filesService.init();

    scanService = new ScanService(win, extraDataService, emulatorRepositoryService);
    scanService.init();
}
