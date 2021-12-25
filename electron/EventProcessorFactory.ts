import { BrowserWindow } from 'electron';
import * as Datastore from 'nedb';
import { EventProcessor } from 'EventProcessor';
import { TopTenEventProcessor } from './TopTenEventProcessor'

export class EventProcessorFactory {
    static getEventProcessors(win: BrowserWindow, database: Datastore): EventProcessor[] {
        return [
            new TopTenEventProcessor(win, database)
        ];
    }
}
