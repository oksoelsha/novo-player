export class Settings {
    openmsxPath: string;
    screenshotsPath: string;
    defaultListing: string;
    webmsxPath: string;

    constructor(openmsxPath: string, screenshotsPath: string, defaultListing: string, webmsxPath:string) {
        this.openmsxPath = openmsxPath;
        this.screenshotsPath = screenshotsPath;
        this.defaultListing = defaultListing;
        this.webmsxPath = webmsxPath;
    }
}
