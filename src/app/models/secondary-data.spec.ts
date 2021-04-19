import { GameSecondaryData } from './secondary-data';

describe('GameSecondaryData', () => {
  it('should create an instance', () => {
    expect(new GameSecondaryData("screenshotData1", "screenshotData2", ["musicFile1", "musicFile2"])).toBeTruthy();
  });
});
