export enum EventSource {
    openMSX = 0,
    WebMSX = 1,
  }

export enum EventType {
    LAUNCH = 0,
}

export class Event {
    source: EventSource;
    type: EventType;
    data: string;
    timestamp: number;

    constructor(source: EventSource, type: EventType, data: string, timestamp: number = 0) {
        this.source = source;
        this.type = type;
        this.data = data;
        if (timestamp === 0) {
            this.timestamp = Date.now();
        } else {
            this.timestamp = timestamp;
        }
    }
}
