export class Settings {
    openmsxPath: string;
    screenshotsPath: string;
    defaultListing: string;

    constructor(openmsxPath: string, screenshotsPath: string, defaultListing: string) {
        this.openmsxPath = openmsxPath;
        this.screenshotsPath = screenshotsPath;
        this.defaultListing = defaultListing;
    }
}
