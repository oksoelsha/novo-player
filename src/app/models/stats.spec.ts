import { Stats } from './stats';

describe('Stats', () => {
  it('should create an instance', () => {
    expect(new Stats(1, 2, 3, 4, 5, 6, 7)).toBeTruthy();
  });
});

describe('Stats', () => {
  it('should be set fields correctly', () => {
    var stats: Stats = new Stats(1, 2, 3, 4, 5, 6, 7);
    expect(stats.totalGames).toEqual(1);
    expect(stats.totalListings).toEqual(2);
    expect(stats.totalRoms).toEqual(3);
    expect(stats.totalDisks).toEqual(4);
    expect(stats.totalTapes).toEqual(5);
    expect(stats.totalHarddisks).toEqual(6);
    expect(stats.totalLaserdiscs).toEqual(7);
  });
});