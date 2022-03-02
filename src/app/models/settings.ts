export class Settings {
    openmsxPath: string;
    screenshotsPath: string;
    gameMusicPath: string;
    defaultListing: string;
    webmsxPath: string;
    language: string;

    constructor(openmsxPath: string, screenshotsPath: string, gameMusicPath: string, defaultListing: string, webmsxPath: string,
        language: string) {
        this.openmsxPath = openmsxPath;
        this.screenshotsPath = screenshotsPath;
        this.gameMusicPath = gameMusicPath;
        this.defaultListing = defaultListing;
        this.webmsxPath = webmsxPath;
        this.language = language;
    }
}
