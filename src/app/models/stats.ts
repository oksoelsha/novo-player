export class Stats {
    totalGames: number;
    totalListings: number;
    totalRoms: number;
    totalDisks: number;
    totalTapes: number;
    totalHarddisks: number;
    totalLaserdiscs: number;

    constructor(totalGames: number, totalListings: number, totalRoms:number, totalDisks:number,
        totalTapes:number, totalHarddisks:number, totalLaserdiscs:number) {
        this.totalGames = totalGames;
        this.totalListings = totalListings;
        this.totalRoms = totalRoms;
        this.totalDisks = totalDisks;
        this.totalTapes = totalTapes;
        this.totalHarddisks = totalHarddisks;
        this.totalLaserdiscs = totalLaserdiscs;
    }
}
