import { Totals } from './totals';

describe('Totals', () => {
  it('should create an instance', () => {
    expect(new Totals(1, 2, 3, 4, 5, 6, 7)).toBeTruthy();
  });
});

describe('Totals', () => {
  it('should be set fields correctly', () => {
    var totals: Totals = new Totals(1, 2, 3, 4, 5, 6, 7);
    expect(totals.listings).toEqual(1);
    expect(totals.games).toEqual(2);
    expect(totals.roms).toEqual(3);
    expect(totals.disks).toEqual(4);
    expect(totals.tapes).toEqual(5);
    expect(totals.harddisks).toEqual(6);
    expect(totals.laserdiscs).toEqual(7);
  });
});