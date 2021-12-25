import { BrowserWindow, ipcMain } from 'electron';
import { EventProcessor } from './EventProcessor';
import * as Datastore from 'nedb';
import * as os from 'os';
import * as path from 'path';
import { Event } from '../src/app/models/event';
import { EventDO } from './data/event-do';
import { EventProcessorFactory } from './EventProcessorFactory';

export class EventLogService {

    private database: Datastore;
    private readonly databasePath: string = path.join(os.homedir(), 'Novo Player');
    private readonly databaseFile: string = path.join(this.databasePath, 'events');
    private readonly MAXIMUM_LOG_ENTRIES: number = 600;
    private eventProcessors: EventProcessor[];

    constructor(private win: BrowserWindow) {
        this.database = new Datastore({ filename: this.databaseFile, autoload: true });
        this.eventProcessors = EventProcessorFactory.getEventProcessors(win, this.database);
        this.init();
    }

    logEvent(userEvent: Event) {
        const self = this;
        const eventDO = new EventDO(userEvent);

        this.database.count({}, (err: any, count: number) => {
            if (count >= self.MAXIMUM_LOG_ENTRIES) {
                self.database.find({}).sort({ timestamp: 1 }).limit(1).exec((err: any, entry: any) => {
                    self.database.remove({ _id: entry[0]._id }, {}, (err: any, numRemoved: number) => {
                    });
                });
            }
            self.database.insert(eventDO, (err: any, savedEvent: EventDO) => {
                if (err != null) {
                    for (const eventProcessor of this.eventProcessors) {
                        eventProcessor.process();
                    }
                }
            });
        });
    }

    private init() {
        ipcMain.on('logEvent', (event, userEvent: Event) => {
            this.logEvent(userEvent);
        });

        ipcMain.on('getEvents', (event, pageSize: number, currentPage: number) => {
            this.getEvents(pageSize, currentPage);
        });
    }

    private getEvents(pageSize: number, currentPage: number) {
        const self = this;
        const events: Event[] = [];
        let total = 0;

        this.database.count({}, (err: any, count: number) => {
            total = count;
            let offset = currentPage * pageSize;
            self.database.find({}).sort({ timestamp: -1 }).skip(offset).limit(pageSize).exec((err: any, entries: any) => {
                for (let entry of entries) {
                    let event: Event = new Event(entry.source, entry.type, entry.data, entry.timestamp);
                    events.push(event);
                }
                self.win.webContents.send('getEventsResponse', { total, events });
            });
        });
    }
}
