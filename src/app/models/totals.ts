export class Totals {
    listings: number;
    games: number;
    roms: number;
    disks: number;
    tapes: number;
    harddisks: number;
    laserdiscs: number;

    constructor(listings: number, games: number, roms: number, disks: number, tapes: number,
        harddisks: number, laserdiscs: number) {
        this.listings = listings;
        this.games = games;
        this.roms = roms;
        this.disks = disks;
        this.tapes = tapes;
        this.harddisks = harddisks;
        this.laserdiscs = laserdiscs;
    }
}
