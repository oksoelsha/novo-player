import { BrowserWindow, ipcMain } from 'electron';
import { OpenmsxConnector } from './OpenMSXConnector';

export class OpenmsxControlService {

    constructor(private win: BrowserWindow) {
        this.init();
    }

    private init() {
        ipcMain.on('resetOnOpenmsx', (event, pid: number) => {
            this.resetOnOpenmsx(pid);
        });
        ipcMain.on('switchDiskOnOpenmsx', (event, pid: number, disk: string) => {
            this.switchDiskOnOpenmsx(pid, disk);
        });
        ipcMain.on('switchTapeOnOpenmsx', (event, pid: number, tape: string) => {
            this.switchTapeOnOpenmsx(pid, tape);
        });
    }

    private async resetOnOpenmsx(pid: number) {
        this.executeCommandOnOpenmsx(pid, 'reset');

        this.win.webContents.send('resetOnOpenmsxResponse', true);
    }

    private async switchDiskOnOpenmsx(pid: number, disk: string) {
        this.executeCommandOnOpenmsx(pid, 'diska {' + disk.replace(/\\/g, '/') + '}');

        this.win.webContents.send('switchDiskOnOpenmsxResponse', true);
    }

    private async switchTapeOnOpenmsx(pid: number, tape: string) {
        this.executeCommandOnOpenmsx(pid, 'cassetteplayer {' + tape.replace(/\\/g, '/') + '}');

        this.win.webContents.send('switchTapeOnOpenmsxResponse', true);
    }

    private async executeCommandOnOpenmsx(pid: number, command: string) {
        const openmsxConnector = new OpenmsxConnector(pid);

        await openmsxConnector.connect();
        openmsxConnector.sendCommand(command);
        openmsxConnector.disconnect();
    }
}
