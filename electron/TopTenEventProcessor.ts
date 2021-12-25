import { BrowserWindow, ipcMain } from 'electron';
import * as Datastore from 'nedb';
import { EventProcessor } from './EventProcessor';

export class TopTenEventProcessor implements EventProcessor {

    constructor(private win: BrowserWindow, private database: Datastore) {
        this.init();
    }

    process(): void {
        // nothing to implement in this case
    }

    private init() {
        ipcMain.on('getTopTenLaunchedGames', (event, pageSize: number, currentPage: number) => {
            this.getTopTenLaunchedGames(pageSize, currentPage);
        });
    }

    private getTopTenLaunchedGames(pageSize: number, currentPage: number) {
        const self = this;
        const launchTimes: Map<string, number> = new Map<string, number>();

        this.database.find({}).exec((err: any, entries: any) => {
            for (let entry of entries) {
                const key = JSON.stringify({ name: entry.data.name, listing: entry.data.listing });
                launchTimes.set(key, this.getCount(launchTimes.get(key)));
            }

            const allCounts = this.getTopTen(launchTimes);
            const total = allCounts.length > 10 ? 10 : allCounts.length;
            const startOfPage = currentPage*pageSize;
            const topTen = allCounts.slice(startOfPage, startOfPage + pageSize);
            let results = {total: total, counts: topTen};
            self.win.webContents.send('getTopTenLaunchedGamesResponse', results);
        });
    }

    private getCount(count: number): number {
        if (count) {
            return ++count;
        } else {
            return 1;
        }
    }

    private getTopTen(launchTimes: Map<string,number>): any[] {
        return [...new Map([...launchTimes.entries()].sort((a,b) => b[1] - a[1]))]
            .map(e =>{ return {game: JSON.parse(e[0]), count: e[1]}; }).slice(0, 10);
    }
}
