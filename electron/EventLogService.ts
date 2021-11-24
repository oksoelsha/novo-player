import { BrowserWindow, ipcMain } from 'electron';
import * as Datastore from 'nedb';
import * as os from 'os';
import * as path from 'path';
import { Event } from '../src/app/models/event';
import { EventDO } from './data/event-do';

export class EventLogService {

    private database: Datastore;
    private readonly databasePath: string = path.join(os.homedir(), 'Novo Player');
    private readonly databaseFile: string = path.join(this.databasePath, 'events');
    private readonly MAXIMUM_LOG_ENTRIES: number = 600;

    constructor(private win: BrowserWindow) {
        this.database = new Datastore({ filename: this.databaseFile, autoload: true });
    }

    init() {
        ipcMain.on('logEvent', (event, userEvent: Event) => {
            this.logEvent(userEvent);
        });

        ipcMain.on('getEvents', (event, pageSize: number, currentPage: number) => {
            this.getEvents(pageSize, currentPage);
        });
    }

    logEvent(userEvent: Event) {
        var self = this;
        var eventDO: EventDO = new EventDO(userEvent);

        this.database.count({}, function (err: any, count: number) {
            if (count >= self.MAXIMUM_LOG_ENTRIES) {
                self.database.find({}).sort({ timestamp: 1 }).limit(1).exec(function (err: any, entry: any) {
                    self.database.remove({ _id: entry[0]._id }, {}, function (err: any, numRemoved: number) {
                    });
                });
            }
            self.database.insert(eventDO, function (err: any, savedEvent: EventDO) {
            });
        });
    }

    private getEvents(pageSize: number, currentPage: number) {
        var self = this;
        let events: Event[] = [];
        let total = 0;

        this.database.count({}, function (err: any, count: number) {
            total = count;
            let offset = currentPage * pageSize;
            self.database.find({}).sort({ timestamp: -1 }).skip(offset).limit(pageSize).exec(function (err: any, entries: any) {
                for (var entry of entries) {
                    let event: Event = new Event(entry.source, entry.type, entry.data, entry.timestamp);
                    events.push(event);
                }
                self.win.webContents.send('getEventsResponse', { "total": total, "events": events });
            });
        });
    }
}
