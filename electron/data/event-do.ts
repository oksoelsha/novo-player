import { Event } from "../../src/app/models/event";

export class EventDO {
    source: number;
    type: number;
    data: string;
    timestamp: number;

    constructor(event: Event) {
        this.source = event.source;
        this.type = event.type;
        this.data = event.data;
        this.timestamp = event.timestamp;
    }
}
